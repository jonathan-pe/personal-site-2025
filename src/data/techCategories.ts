import { Code2, Database, Smartphone, Paintbrush, TestTube, Globe, Cpu, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface TechCategory {
  name: string
  icon: LucideIcon
  color: string
  priority: number // Higher number = higher priority for determining focus
}

export interface TechMetadata {
  category: TechCategory
  subcategory?: string
  description?: string
  focusArea: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'testing' | 'infrastructure'
}

export const TECH_CATEGORIES: Record<string, TechCategory> = {
  'Frontend Framework': {
    name: 'Frontend Framework',
    icon: Code2,
    color: 'blue',
    priority: 10,
  },
  'Backend Framework': {
    name: 'Backend Framework',
    icon: Database,
    color: 'green',
    priority: 10,
  },
  'Programming Language': {
    name: 'Programming Language',
    icon: Code2,
    color: 'purple',
    priority: 8,
  },
  'Runtime Environment': {
    name: 'Runtime Environment',
    icon: Cpu,
    color: 'orange',
    priority: 7,
  },
  'Mobile Development': {
    name: 'Mobile Development',
    icon: Smartphone,
    color: 'pink',
    priority: 9,
  },
  'Styling/Markup': {
    name: 'Styling/Markup',
    icon: Paintbrush,
    color: 'cyan',
    priority: 4,
  },
  'Testing Framework': {
    name: 'Testing Framework',
    icon: TestTube,
    color: 'red',
    priority: 5,
  },
  'Query Language': {
    name: 'Query Language',
    icon: Database,
    color: 'indigo',
    priority: 6,
  },
  'UI Library': {
    name: 'UI Library',
    icon: Package,
    color: 'teal',
    priority: 6,
  },
  'Web Technology': {
    name: 'Web Technology',
    icon: Globe,
    color: 'gray',
    priority: 3,
  },
}

export const TECH_METADATA: Record<string, TechMetadata> = {
  // Frontend Frameworks
  React: {
    category: TECH_CATEGORIES['Frontend Framework'],
    subcategory: 'Component Library',
    description: 'Modern component-based UI library',
    focusArea: 'frontend',
  },
  Angular: {
    category: TECH_CATEGORIES['Frontend Framework'],
    subcategory: 'Full Framework',
    description: 'Comprehensive frontend framework',
    focusArea: 'frontend',
  },
  'Vue.js': {
    category: TECH_CATEGORIES['Frontend Framework'],
    subcategory: 'Progressive Framework',
    description: 'Approachable frontend framework',
    focusArea: 'frontend',
  },
  'Ember.js': {
    category: TECH_CATEGORIES['Frontend Framework'],
    subcategory: 'Convention-based Framework',
    description: 'Opinionated frontend framework',
    focusArea: 'frontend',
  },

  // Backend/Runtime
  'Node.js': {
    category: TECH_CATEGORIES['Runtime Environment'],
    subcategory: 'JavaScript Runtime',
    description: 'Server-side JavaScript runtime',
    focusArea: 'backend',
  },
  Java: {
    category: TECH_CATEGORIES['Programming Language'],
    subcategory: 'Enterprise Language',
    description: 'Object-oriented programming language',
    focusArea: 'backend',
  },

  // Mobile
  'React Native': {
    category: TECH_CATEGORIES['Mobile Development'],
    subcategory: 'Cross-platform',
    description: 'React-based mobile framework',
    focusArea: 'mobile',
  },
  Swift: {
    category: TECH_CATEGORIES['Programming Language'],
    subcategory: 'iOS Development',
    description: "Apple's programming language",
    focusArea: 'mobile',
  },
  iOS: {
    category: TECH_CATEGORIES['Mobile Development'],
    subcategory: 'Native Platform',
    description: 'Apple mobile platform',
    focusArea: 'mobile',
  },

  // Programming Languages
  TypeScript: {
    category: TECH_CATEGORIES['Programming Language'],
    subcategory: 'Typed JavaScript',
    description: 'Statically typed JavaScript',
    focusArea: 'fullstack',
  },
  JavaScript: {
    category: TECH_CATEGORIES['Programming Language'],
    subcategory: 'Dynamic Language',
    description: 'Dynamic programming language',
    focusArea: 'fullstack',
  },

  // Styling/Markup
  HTML: {
    category: TECH_CATEGORIES['Styling/Markup'],
    subcategory: 'Markup Language',
    description: 'Standard markup language',
    focusArea: 'frontend',
  },
  CSS: {
    category: TECH_CATEGORIES['Styling/Markup'],
    subcategory: 'Styling Language',
    description: 'Cascading style sheets',
    focusArea: 'frontend',
  },
  'LESS/SCSS': {
    category: TECH_CATEGORIES['Styling/Markup'],
    subcategory: 'CSS Preprocessor',
    description: 'Enhanced CSS with variables and mixins',
    focusArea: 'frontend',
  },

  // State Management & Data
  Redux: {
    category: TECH_CATEGORIES['Frontend Framework'],
    subcategory: 'State Management',
    description: 'Predictable state container',
    focusArea: 'frontend',
  },
  GraphQL: {
    category: TECH_CATEGORIES['Query Language'],
    subcategory: 'API Query Language',
    description: 'Flexible API query language',
    focusArea: 'fullstack',
  },
  Hasura: {
    category: TECH_CATEGORIES['Backend Framework'],
    subcategory: 'GraphQL Engine',
    description: 'Auto-generated GraphQL APIs',
    focusArea: 'backend',
  },

  // UI Libraries
  'styled-components': {
    category: TECH_CATEGORIES['UI Library'],
    subcategory: 'CSS-in-JS',
    description: 'Component-styled CSS library',
    focusArea: 'frontend',
  },
  'ant-design': {
    category: TECH_CATEGORIES['UI Library'],
    subcategory: 'Component Library',
    description: 'Enterprise-grade UI components',
    focusArea: 'frontend',
  },

  // Testing
  Jest: {
    category: TECH_CATEGORIES['Testing Framework'],
    subcategory: 'JavaScript Testing',
    description: 'JavaScript testing framework',
    focusArea: 'testing',
  },
}

export interface TechFocus {
  primary: string
  description: string
  focusAreas: Array<'frontend' | 'backend' | 'fullstack' | 'mobile' | 'testing' | 'infrastructure'>
}

export const getTechFocus = (techUsed: string[]): TechFocus => {
  const techMetadata = techUsed.map((tech) => TECH_METADATA[tech]).filter(Boolean)
  const focusAreas = techMetadata.map((meta) => meta.focusArea)

  // Count focus areas
  const focusCount = focusAreas.reduce((acc, area) => {
    acc[area] = (acc[area] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Determine primary focus based on highest priority technologies
  const highPriorityTech = techUsed
    .filter((tech) => TECH_METADATA[tech])
    .sort((a, b) => (TECH_METADATA[b]?.category.priority || 0) - (TECH_METADATA[a]?.category.priority || 0))

  let primary = 'Full-stack development'
  let description = 'Balanced development across multiple technologies'

  if (highPriorityTech.length > 0) {
    const topTech = highPriorityTech[0]
    const metadata = TECH_METADATA[topTech]

    if (metadata) {
      switch (metadata.focusArea) {
        case 'frontend':
          if (techUsed.includes('React') || techUsed.includes('Angular') || techUsed.includes('Vue.js')) {
            primary = `${topTech} frontend development`
            description = `Frontend-focused with ${topTech} ecosystem expertise`
          } else {
            primary = 'Frontend development'
            description = 'User interface and experience focused development'
          }
          break
        case 'backend':
          primary = `${topTech} backend development`
          description = `Backend-heavy with ${topTech} ${metadata.subcategory?.toLowerCase() || 'development'}`
          break
        case 'mobile':
          primary = `${topTech} mobile development`
          description = `Mobile application development with ${topTech}`
          break
        case 'fullstack':
          primary = 'Full-stack development'
          description = `Full-stack ${topTech} development across web technologies`
          break
      }
    }
  }

  // Override for specific combinations
  if (focusCount.frontend && focusCount.backend) {
    primary = 'Full-stack development'
    description = 'End-to-end development spanning frontend and backend'
  }

  if (focusCount.mobile && (focusCount.frontend || focusCount.backend)) {
    primary = 'Cross-platform development'
    description = 'Mobile and web development across multiple platforms'
  }

  return {
    primary,
    description,
    focusAreas: Object.keys(focusCount) as Array<
      'frontend' | 'backend' | 'fullstack' | 'mobile' | 'testing' | 'infrastructure'
    >,
  }
}

export const getTechCategory = (tech: string): TechCategory => {
  return TECH_METADATA[tech]?.category || TECH_CATEGORIES['Web Technology']
}

export const calculateStackComplexity = (
  techUsed: string[]
): {
  score: number
  level: 'Simple' | 'Moderate' | 'Complex' | 'Advanced'
  description: string
} => {
  const score = Math.min((techUsed.length / 10) * 100, 100)

  let level: 'Simple' | 'Moderate' | 'Complex' | 'Advanced'
  let description: string

  if (score < 30) {
    level = 'Simple'
    description = 'Focused technology stack'
  } else if (score < 60) {
    level = 'Moderate'
    description = 'Well-rounded technology stack'
  } else if (score < 80) {
    level = 'Complex'
    description = 'Diverse technology stack'
  } else {
    level = 'Advanced'
    description = 'Comprehensive technology ecosystem'
  }

  return { score, level, description }
}
