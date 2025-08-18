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
PROFESSIONAL EXPERIENCE & EXPERTISE:

== CURRENT ROLE ==
Senior Frontend Software Engineer at Meta (July 2024 - Present)
Focus: Infrastructure & Data Center tooling with React ecosystem
Key Accomplishments:
- LEADERSHIP: Led React development for internal Infrastructure & Data Center tools, establishing best practices through PR reviews, documentation, and mentoring backend-heavy teammates
- ARCHITECTURE: Spearheaded development of a scalable data visualization dashboard, delivering clean frontend architecture while partnering with TPMs and backend teams to define data contracts
- IMPACT: Built reusable UI components adopted across three internal tools, improving consistency and responsiveness, while reducing implementation time
- COLLABORATION: Championed team-wide onboarding and UI quality through design pairing and mentorship
- DELIVERY: Wrote and maintained end-to-end tests with Jest to ensure application reliability and feature coverage
Technologies: React, TypeScript, Jest, GraphQL, HTML, CSS
Stack Focus: 95% Frontend, 5% Backend

== PREVIOUS KEY ROLES ==
Senior Frontend Software Engineer at Apple (Feb 2023 - Feb 2024)
Specialization: Internal ML tooling with massive dataset visualization
Key Accomplishments:
- INNOVATION: Spearheaded React development for Apple's internal ML tooling, including building performant interfaces for rendering large-scale logs (~100K+ lines), reducing render time from seconds to milliseconds via virtualization
- DEVELOPMENT: Implemented interactive data visualizations for ML logs and system outputs, building scalable React components that handled large datasets with performant rendering, filtering, and context-driven UI features
- ARCHITECTURE: Developed a flexible UI component library to drive consistent usage and design, reducing UI redundancy and improving dev efficiency
- FULL-STACK: Designed and implemented GraphQL APIs using Hasura, and backend REST services with Node.js to enable seamless data flow and robust integration with frontend interfaces
- IMPROVEMENT: Led architectural improvements across frontend state, layout, and utility patterns to enable scalable feature delivery without compounding tech debt
- DELIVERY: Delivered UX enhancements within strict security and compliance constraints, balancing usability with platform guardrails and performance goals
Technologies: React, JavaScript, GraphQL, Hasura, Node.js, LESS/SCSS, ant-design, HTML, CSS
Stack Focus: 90% Frontend, 10% Backend

Frontend Software Engineer at Reputation (Nov 2021 - Oct 2022)
Focus: Social platform development with API integrations
Key Accomplishments:
- LEADERSHIP: Led React development of new features to the Social platform, increasing customer reach to their audience
- COLLABORATION: Collaborated with Product, Management and QA teams showing strong communication skills and ability to work in a collaborative team environment
- INTEGRATION: Developed integrations with various Social platform APIs (TikTok, Twitter, Google Business Profile, Instagram/Facebook, LinkedIn), enhancing the platform's connectivity and user engagement
- IMPROVEMENT: Refactored underlying Front-End infrastructure, making Front-End development easier and quicker
Technologies: React, Angular, HTML, CSS, JavaScript
Stack Focus: 100% Frontend

Full Stack Software Engineer at Dolby.io (Aug 2020 - Oct 2021)
Focus: Frontend development with microservice integration
Key Accomplishments:
- DEVELOPMENT: Developed new functionality and webpages using React, Redux, and styled-components, enhancing user experience and interface design
- IMPROVEMENT: Refactored existing pages to be mobile-friendly and responsive
- ARCHITECTURE: Created a new Node.js microservice to handle 3rd party integrations with our APIs, improving system efficiency and enabling seamless data exchange
Technologies: React, Redux, styled-components, Node.js, JavaScript, HTML, CSS
Stack Focus: 75% Frontend, 25% Backend

Full Stack Software Engineer at STRATIM (Jan 2019 - Mar 2020)
Focus: Cross-platform development (Java backend, iOS, React ecosystem)
Key Accomplishments:
- DEVELOPMENT: Built JAVA backend services and implemented new features in STRATIM's iOS application cross-functionally
- OPTIMIZATION: Created new and optimized existing Java REST endpoints for STRATIM's mobile application
- IMPACT: Built new features for STRATIM's iOS application, almost doubling its user base
- INNOVATION: Investigated, implemented, and lead STRATIM's migration from Vue.js and iOS native to React.js & React Native
- AUTOMATION: Automated the iOS release/deployment process with fastlane
Technologies: Java, Swift, React, React Native, Vue.js, iOS, HTML, CSS
Stack Focus: 40% Frontend, 60% Backend

Full Stack Software Engineer at Gliffy Inc. (Jul 2017 - Jan 2019)
Focus: Microservices and frontend development
Key Accomplishments:
- DEVELOPMENT: Built Node.js microservices and frontend Ember.js UIs cross-functionally
- COLLABORATION: Partnered with UX/design to create new Ember.js webpages for the Gliffy web app
- ARCHITECTURE: Created a suite of Node.js microservices, allowing for better scalability and increasing engineering efficiency and output
Technologies: Ember.js, JavaScript, Node.js, LESS/SCSS, HTML, CSS
Stack Focus: 50% Frontend, 50% Backend

== TECHNICAL EXPERTISE ANALYSIS ==
Primary Specialization: React Frontend Development with TypeScript
- 95% of recent roles focused on React ecosystem
- Deep expertise in component architecture, state management, and performance optimization
- Specialized in data-heavy applications and visualization interfaces

Secondary Skills:
- Full-stack development capabilities (Node.js, Express, GraphQL)
- Mobile development (React Native, iOS/Swift)
- Database design (MongoDB, PostgreSQL, Prisma)
- API integration and microservices architecture

Technology Categories & Focus Areas:
Frontend Frameworks: React (primary), Angular, Vue.js, Ember.js, Next.js
Programming Languages: TypeScript (preferred), JavaScript, Java, Swift
State Management: Redux, Zustand
Styling: Tailwind CSS, styled-components, LESS/SCSS, CSS
Testing: Jest, end-to-end testing
Backend: Node.js, Express, GraphQL, REST APIs
Databases: MongoDB, PostgreSQL, Prisma
Mobile: React Native, iOS (Swift)
AI/ML Integration: Vercel AI SDK, OpenAI API
Build Tools: Vite, TanStack Router

== PERSONAL PROJECTS ==
1. Personal Website (jonathanpe.com) - LIVE
Technologies: React, TypeScript, Tailwind CSS, Framer Motion, Vite, shadcn, Vercel AI SDK
Complexity: Intermediate
Key Features:
- AI-powered chatbot for interactive portfolio exploration
- Responsive design with dark/light mode toggle
- Smooth animations with Framer Motion
- Type-safe routing with TanStack Router
- Modern component system with shadcn and Tailwind CSS
- Built with AI assistance to enhance development efficiency
Challenges: Integrating AI-powered features on frontend, creating flexible component system, implementing performant animations
Role: Full-stack Developer & Designer

2. kinshipr - Social Event Coordination App (IN DEVELOPMENT)
Technologies: React, TypeScript, Vite, TanStack Router, Zustand, Tailwind CSS, React Native, shadcn, Node.js, Express, MongoDB, Zod, Clerk
Complexity: Advanced
Key Features:
- User authentication and profiles with Clerk
- Friend network management system
- Event creation with detailed planning features
- RSVP tracking and coordination
- Secure data storage with MongoDB
- Type-safe API validation with Zod
- Cross-platform (web + planned mobile)
Challenges: Balancing rapid iteration speed with long-term maintainability, designing scalable backend architecture, implementing authentication flows across platforms, structuring MongoDB schemas for future expansions, managing complex state synchronization
Learnings: Refined data model design skills, gained expertise in Node.js/MongoDB backends, learned Clerk authentication integration, improved state management patterns for multi-platform apps
Role: Full-stack Developer, Designer & System Architect

3. Pulse - Gamified Sports Prediction Platform (IN DEVELOPMENT)
Technologies: React, Next.js, TypeScript, TanStack Router, GraphQL, Prisma, PostgreSQL, Zustand, Tailwind CSS, shadcn, Zod, Clerk
Complexity: Advanced
Key Features:
- Integrated real-time sportsbook odds API
- Developed secure user authentication system
- Responsive Next.js + TypeScript UI
- Built type-safe GraphQL API with Prisma
- Structured relational data in PostgreSQL
- Gamification mechanics (streaks, bonuses, upsets)
- Abuse prevention and rate limiting
Challenges: Designing fair yet engaging game mechanics, navigating legal compliance, implementing scalable authentication, architecting for future feature expansion
Learnings: Structured game logic improves scalability, effective caching critical for live data, well-designed incentives drive engagement, authentication systems require robust configuration, PostgreSQL + Prisma enables maintainable schemas, code-first GraphQL accelerates iteration
Role: Full-stack Developer, Designer & System Architect

4. It's 5 O'Clock Somewhere - LIVE (https://www.5oclock.club)
Technologies: React, Vite, shadcn, TypeScript, Tailwind CSS
Complexity: Beginner
Key Features:
- Real-time timezone calculations showing where it's 5:00 PM globally
- Location-based beverage suggestions
- Interactive world map interface
Challenges: Handling complex timezone logic, creating intuitive UI, integrating location APIs
Learnings: UI/UX design principles, working with date/time libraries, API integration patterns
Role: Frontend Developer

== CAREER PROGRESSION ANALYSIS ==
Career Trajectory: Full-stack → Frontend Specialization at Top Tech Companies
- Started as full-stack engineer with balanced frontend/backend work
- Progressively specialized in frontend development, particularly React
- Advanced to senior roles at major tech companies (Apple, Meta)
- Consistent focus on scalable, performant UI development
- Strong pattern of leadership and mentorship roles

Accomplishment Categories (based on role analysis):
- LEADERSHIP: Leading development initiatives, establishing best practices, mentoring teams
- DEVELOPMENT: Building complex UIs, implementing new features, creating component libraries
- ARCHITECTURE: Designing scalable frontend systems, microservices, data visualization dashboards
- PERFORMANCE: Optimizing render times, handling large datasets, improving efficiency
- COLLABORATION: Cross-functional work with TPMs, backend teams, UX/design, product teams
- INNOVATION: Introducing new technologies, leading migrations, implementing cutting-edge solutions

Core Strengths & Approach:
- React ecosystem expertise with TypeScript for type safety
- Performance optimization for data-heavy applications
- Component library and design system development
- Mentorship and technical leadership
- Full-stack understanding enhancing frontend architecture decisions
- AI integration and modern development practices
- Focus on developer experience and team efficiency
`

async function handler(req: VercelRequest, res: VercelResponse) {
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
      system: `You are an AI assistant helping visitors learn about Jonathan Pe's professional experience and projects. You have access to comprehensive data about his career progression, technical expertise, and project details.

${PROFESSIONAL_INFO}

Guidelines for responses:
- Keep responses professional, concise, and helpful (aim for 2-4 sentences unless more detail is specifically requested)
- Use the detailed accomplishment categories (LEADERSHIP, DEVELOPMENT, ARCHITECTURE, etc.) to provide context about his contributions
- Reference specific technologies, companies, and measurable impacts when relevant
- Explain his career progression from full-stack to frontend specialization at top tech companies
- Highlight his expertise in React ecosystem, TypeScript, and performance optimization
- Mention his experience with large-scale applications (100K+ line logs at Apple, internal tools at Meta)
- If asked about technologies, reference specific projects or roles where he used them
- If asked about non-professional topics, politely redirect to his work experience
- Be conversational but informative, showing understanding of technical depth

Areas of expertise you can discuss in detail:
- React development and component architecture (primary specialization)
- Performance optimization for data-heavy applications
- Frontend system architecture and reusable component libraries
- Full-stack development capabilities (Node.js, Express, databases)
- Mobile development experience (React Native, iOS)
- AI integration in web applications
- Technical leadership and mentoring
- Career progression and growth at tech companies

Example conversation starters you can elaborate on:
- "Tell me about Jonathan's experience at Meta/Apple"
- "What technologies does Jonathan specialize in?"
- "Can you explain his personal projects?"
- "What kind of performance optimizations has he worked on?"
- "How has his career progressed over time?"
- "What's his experience with React and TypeScript?"
- "Tell me about his full-stack capabilities"
- "What AI/ML experience does he have?"

Always provide specific examples from his work when possible, and feel free to go into technical detail when asked about his expertise.`,
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

export default handler
