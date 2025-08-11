export interface ProjectImage {
  src: string
  alt: string
  type: 'hero' | 'screenshot' | 'mockup' | 'diagram'
}

export interface Project {
  id: string
  title: string
  url: string | null
  description: string
  techUsed: string[]
  status: 'live' | 'in-development' | 'archived' | 'concept'
  type: 'personal' | 'client' | 'open-source' | 'freelance' | 'work'
  category: 'web-app' | 'mobile-app' | 'portfolio' | 'e-commerce' | 'tool' | 'game'
  featured: boolean
  githubUrls?: string[]
  demoUrl?: string
  images?: ProjectImage[]
  keyFeatures: string[]
  challenges: string[]
  learnings: string[]
  tags: string[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  teamSize: number
  myRole: string
}
