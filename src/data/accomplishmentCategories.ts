import { Users, Code2, TrendingUp, Target, Award, Lightbulb, Zap, GitBranch } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AccomplishmentCategory {
  name: string
  icon: LucideIcon
  color: string
  impact: 'low' | 'medium' | 'high'
  description: string
}

export const ACCOMPLISHMENT_CATEGORIES: Record<string, AccomplishmentCategory> = {
  leadership: {
    name: 'Leadership',
    icon: Users,
    color: 'blue',
    impact: 'high',
    description: 'Leading teams, initiatives, and driving organizational change',
  },
  development: {
    name: 'Development',
    icon: Code2,
    color: 'green',
    impact: 'high',
    description: 'Building, creating, and implementing technical solutions',
  },
  improvement: {
    name: 'Improvement',
    icon: TrendingUp,
    color: 'orange',
    impact: 'medium',
    description: 'Optimizing, enhancing, and refining existing systems',
  },
  collaboration: {
    name: 'Collaboration',
    icon: Users,
    color: 'purple',
    impact: 'medium',
    description: 'Working with teams, mentoring, and cross-functional coordination',
  },
  innovation: {
    name: 'Innovation',
    icon: Lightbulb,
    color: 'yellow',
    impact: 'high',
    description: 'Introducing new technologies, processes, or approaches',
  },
  delivery: {
    name: 'Delivery',
    icon: Target,
    color: 'red',
    impact: 'high',
    description: 'Shipping features, meeting deadlines, and achieving goals',
  },
  impact: {
    name: 'Impact',
    icon: Zap,
    color: 'pink',
    impact: 'high',
    description: 'Measurable business or technical impact',
  },
  architecture: {
    name: 'Architecture',
    icon: GitBranch,
    color: 'indigo',
    impact: 'high',
    description: 'System design, technical architecture, and infrastructure',
  },
  general: {
    name: 'General',
    icon: Award,
    color: 'gray',
    impact: 'medium',
    description: 'General achievements and contributions',
  },
}

export interface CategorizedAccomplishment {
  text: string
  category: AccomplishmentCategory
  impact: 'low' | 'medium' | 'high'
  keywords: string[]
  id: number
}

const KEYWORD_PATTERNS: Record<string, { keywords: string[]; impact?: 'low' | 'medium' | 'high' }> = {
  leadership: {
    keywords: ['led', 'spearheaded', 'championed', 'drove', 'initiated', 'directed', 'managed', 'guided'],
    impact: 'high',
  },
  development: {
    keywords: ['built', 'developed', 'created', 'implemented', 'designed', 'engineered', 'programmed', 'coded'],
    impact: 'high',
  },
  improvement: {
    keywords: ['improved', 'enhanced', 'optimized', 'refactored', 'streamlined', 'upgraded', 'modernized'],
    impact: 'medium',
  },
  collaboration: {
    keywords: ['collaborated', 'partnered', 'mentoring', 'mentored', 'worked with', 'coordinated', 'facilitated'],
    impact: 'medium',
  },
  innovation: {
    keywords: ['pioneered', 'introduced', 'innovated', 'established', 'adopted', 'migrated', 'transformed'],
    impact: 'high',
  },
  delivery: {
    keywords: ['delivered', 'shipped', 'launched', 'deployed', 'completed', 'achieved', 'accomplished'],
    impact: 'high',
  },
  impact: {
    keywords: ['increased', 'reduced', 'doubled', 'improved by', '%', 'metrics', 'performance', 'efficiency'],
    impact: 'high',
  },
  architecture: {
    keywords: ['architected', 'infrastructure', 'scalable', 'microservice', 'system design', 'technical debt'],
    impact: 'high',
  },
}

export const categorizeAccomplishment = (accomplishment: string, index: number): CategorizedAccomplishment => {
  const text = accomplishment.toLowerCase()
  let bestMatch: { category: string; score: number; matchedKeywords: string[] } = {
    category: 'general',
    score: 0,
    matchedKeywords: [],
  }

  // Check each category for keyword matches
  for (const [categoryKey, { keywords }] of Object.entries(KEYWORD_PATTERNS)) {
    const matchedKeywords = keywords.filter((keyword) => text.includes(keyword.toLowerCase()))
    const score = matchedKeywords.length

    if (score > bestMatch.score) {
      bestMatch = {
        category: categoryKey,
        score,
        matchedKeywords,
      }
    }
  }

  const category = ACCOMPLISHMENT_CATEGORIES[bestMatch.category]
  const patternImpact = KEYWORD_PATTERNS[bestMatch.category]?.impact
  const finalImpact = patternImpact || category.impact

  return {
    text: accomplishment,
    category,
    impact: finalImpact,
    keywords: bestMatch.matchedKeywords,
    id: index,
  }
}

export const categorizeAccomplishments = (accomplishments: string[]): CategorizedAccomplishment[] => {
  return accomplishments.map((accomplishment, index) => categorizeAccomplishment(accomplishment, index))
}

export const getAccomplishmentStats = (accomplishments: CategorizedAccomplishment[]) => {
  const categoryCount = accomplishments.reduce((acc, accomplishment) => {
    const categoryName = accomplishment.category.name
    acc[categoryName] = (acc[categoryName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const impactCount = accomplishments.reduce((acc, accomplishment) => {
    acc[accomplishment.impact] = (acc[accomplishment.impact] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => ({ category, count }))

  const impactScore = (impactCount.high || 0) * 3 + (impactCount.medium || 0) * 2 + (impactCount.low || 0) * 1
  const maxPossibleScore = accomplishments.length * 3
  const impactPercentage = Math.round((impactScore / maxPossibleScore) * 100)

  return {
    categoryCount,
    impactCount,
    topCategories,
    impactScore,
    impactPercentage,
    totalAccomplishments: accomplishments.length,
  }
}
