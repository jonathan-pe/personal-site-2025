import type { VercelRequest, VercelResponse } from '@vercel/node'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { CoreMessage } from 'ai'
import { createRequire } from 'node:module'

interface Job {
  id: string
  companyName: string
  role: string
  startDate: string
  endDate: string
  accomplishments: string[]
  techUsed: string[]
  stackFocus: {
    frontend: number
    backend: number
  }
}

interface Project {
  id: string
  title: string
  url: string | null
  description: string
  techUsed: string[]
  status: 'live' | 'in-development'
  keyFeatures: string[]
  myRole: string
}

const require = createRequire(import.meta.url)
const PROJECTS = require('../src/data/projects.json') as Project[]
const RESUME = require('../src/data/resume.json') as Job[]

// Rate limiting using in-memory storage (Note: In production, consider using Redis or KV)
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = parseInt(process.env.CHAT_RATE_LIMIT_REQUESTS_PER_MINUTE || '10')

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const userLimit = rateLimit.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false
  }

  userLimit.count++
  return true
}

const safeProjects = Array.isArray(PROJECTS) ? PROJECTS : []
const safeResume = Array.isArray(RESUME) ? RESUME : []

const PROFESSIONAL_INFO = JSON.stringify({ resume: safeResume, projects: safeProjects })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get client IP for rate limiting
    const clientIp =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.socket?.remoteAddress ||
      'unknown'

    const ip = Array.isArray(clientIp) ? clientIp[0] : clientIp.split(',')[0]

    if (!checkRateLimit(ip)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(429).send('Rate limit exceeded. Please try again in a minute.')
    }

    const { messages } = req.body as { messages?: Array<{ role: string; content: string }> }

    if (!messages || !Array.isArray(messages)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(400).send('Invalid messages format')
    }

    const safeMessages: CoreMessage[] = messages
      .filter((message) => message.role === 'user' || message.role === 'assistant' || message.role === 'system')
      .map((message) => ({
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
      }))

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: safeMessages,
      system: `You are an AI assistant that answers questions about Jonathan Pe's work experience and projects.

Use the JSON data below as the single source of truth. Do not invent details. If something is not in the data, say so.

Data (JSON):
${PROFESSIONAL_INFO}

Guidelines:
- Keep responses concise unless the user asks for more detail.
- Use markdown bullets for lists when helpful.
- Focus only on professional topics.
`,
      temperature: 0.7,
    })

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Transfer-Encoding', 'chunked')

    try {
      for await (const textPart of result.textStream) {
        res.write(textPart)
      }
      res.end()
    } catch (streamError) {
      console.error('Streaming error:', streamError)
      if (!res.headersSent) {
        res.status(500).json('I apologize, but I encountered an error while streaming. Please try again.')
      }
    }
  } catch (error) {
    console.error('Chat API error:', error)

    // Always return text response for consistency with streaming
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(500).send('I apologize, but I encountered an error. Please try again in a moment.')
    } else {
      res.end()
    }
  }
}
