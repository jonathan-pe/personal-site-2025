import type { VercelRequest, VercelResponse } from '@vercel/node'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

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

// Professional information for the AI assistant
const PROFESSIONAL_INFO = `
PROFESSIONAL EXPERIENCE:
Current Role: Senior Frontend Software Engineer at Meta (July 2024 - Present)
- Led React development for internal Infrastructure & Data Center tools
- Spearheaded development of scalable data visualization dashboard
- Built reusable UI components adopted across three internal tools
- Championed team-wide onboarding and UI quality through design pairing and mentorship
- Technologies: React, TypeScript, Jest, GraphQL, HTML, CSS

Previous Role: Senior Frontend Software Engineer at Apple (Feb 2023 - Feb 2024)
- Spearheaded React development for Apple's internal ML tooling
- Built performant interfaces for rendering large-scale logs (~100K+ lines)
- Implemented interactive data visualizations for ML logs and system outputs
- Developed flexible UI component library
- Designed and implemented GraphQL APIs using Hasura
- Technologies: React, JavaScript, GraphQL, Hasura, Node.js, LESS/SCSS, ant-design

Other Experience:
- Frontend Software Engineer at Reputation (Nov 2021 - Oct 2022): React, Angular development for Social platform
- Full Stack Software Engineer at Dolby.io (Aug 2020 - Oct 2021): React, Redux, Node.js microservices
- Full Stack Software Engineer at STRATIM (Jan 2019 - Mar 2020): Java backend, iOS development, React/React Native
- Full Stack Software Engineer at Gliffy Inc. (Jul 2017 - Jan 2019): Node.js microservices, Ember.js

CURRENT PROJECTS:
1. Personal Website (2025) - React, TypeScript, Tailwind CSS, Framer Motion, Vite, shadcn, Vercel AI SDK
   - Responsive design with dark/light mode, smooth animations
   - Type-safe routing with TanStack Router, modern component system
   - AI-powered chatbot for interactive portfolio exploration
   - Built with AI to enhance development efficiency

2. kinshipr (In Development) - Full-stack social networking platform
   - Technologies: React, TypeScript, React Native, Node.js, Express, MongoDB, Zustand, Clerk
   - Features: User authentication, friend networks, event planning, RSVP tracking
   - Role: Full-stack Developer, Designer, and System Architect

3. Pulse (In Development) - Gamified sports prediction app
   - Technologies: Next.js, TypeScript, GraphQL, Prisma, PostgreSQL, Zustand
   - Features: Real-time sportsbook odds integration, secure authentication
   - Advanced complexity full-stack project

4. It's 5 O'Clock Somewhere - Fun timezone app
   - Technologies: React, Vite, TypeScript, Tailwind CSS
   - Features: Real-time timezone calculations, location-based beverage suggestions
   - Live at: https://www.5oclock.club

TECHNICAL SKILLS:
Frontend: React, TypeScript, Next.js, Tailwind CSS, Framer Motion, JavaScript, HTML, CSS
Backend: Node.js, Express, GraphQL, REST APIs, Java, Swift
Databases: MongoDB, PostgreSQL, Prisma
Mobile: React Native, iOS (Swift)
AI/ML: Vercel AI SDK, OpenAI API integration
Tools: Vite, TanStack Router, Zustand, Zod, Clerk Auth, Jest, Git
Specialties: Full-stack development, system architecture, UI/UX design, performance optimization

APPROACH & STRENGTHS:
- Specializes in React and modern frontend development
- Strong focus on TypeScript and type safety
- Experience with large-scale applications (Meta, Apple internal tools)
- Full-stack capabilities with backend and database design
- UI/UX design skills and component system architecture
- Performance optimization for large datasets and complex interfaces
`

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

    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(400).send('Invalid messages format')
    }

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      system: `You are an AI assistant helping visitors learn about Jonathan Pe's professional experience and projects. 

${PROFESSIONAL_INFO}

Guidelines for responses:
- Keep responses professional, concise, and helpful (aim for 2-4 sentences unless more detail is specifically requested)
- Focus on Jonathan's technical skills, project experience, and development approach
- Provide specific examples from his work when relevant
- If asked about technologies he's used, reference specific projects or roles
- If asked about non-professional topics, politely redirect to his work experience
- Be conversational but informative
- Highlight his progression from full-stack to frontend specialization at top tech companies

Example topics you can discuss:
- His experience at Meta and Apple with large-scale React applications
- His personal projects like kinshipr, Pulse, and his personal website
- Technical skills in React, TypeScript, Node.js, GraphQL, etc.
- His approach to UI/UX design and component architecture
- His experience with different tech stacks and databases
- Career progression and learnings from different companies`,
      temperature: 0.7,
    })

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Stream the response using the text stream
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
