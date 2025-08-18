import type { VercelRequest, VercelResponse } from '@vercel/node'

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
    console.log('Chat test endpoint called')
    console.log('Request body:', req.body)

    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // Set headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    })

    // Send a simple test response in chunks to simulate streaming
    const testResponse =
      "Hello! This is a test response from the API. I'm Jonathan's AI assistant, and I'm working correctly!"

    // Split into chunks and send with small delays
    const chunks = testResponse.split(' ')
    for (const chunk of chunks) {
      res.write(chunk + ' ')
      // Small delay to simulate real streaming
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    res.end()
  } catch (error) {
    console.error('Chat test API error:', error)

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Test API error occurred',
      })
    } else {
      res.end()
    }
  }
}
