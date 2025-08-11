import type { Job } from '@/types/resume'

export interface RoleContext {
  level: 'Entry' | 'Mid' | 'Senior' | 'Staff' | 'Principal' | 'Lead'
  type: 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'Data' | 'Product'
  specialization?: string
  description: string
}

export interface CareerProgression {
  position: number
  total: number
  isCurrentRole: boolean
  isFirstRole: boolean
  isMostRecent: boolean
  progression: 'promotion' | 'lateral' | 'new-company' | 'career-change'
  description: string
}

const ROLE_LEVEL_KEYWORDS = {
  Entry: ['junior', 'associate', 'entry', 'intern'],
  Mid: ['software engineer', 'developer', 'engineer'],
  Senior: ['senior', 'sr.', 'sr '],
  Staff: ['staff', 'principal', 'architect'],
  Principal: ['principal', 'chief', 'lead architect'],
  Lead: ['lead', 'team lead', 'tech lead', 'engineering lead'],
}

const ROLE_TYPE_KEYWORDS = {
  Frontend: ['frontend', 'front-end', 'ui', 'user interface', 'react', 'angular', 'vue'],
  Backend: ['backend', 'back-end', 'server', 'api', 'microservice'],
  'Full Stack': ['full stack', 'fullstack', 'full-stack'],
  Mobile: ['mobile', 'ios', 'android', 'react native', 'swift'],
  DevOps: ['devops', 'infrastructure', 'platform', 'sre', 'reliability'],
  Data: ['data', 'analytics', 'ml', 'machine learning', 'ai'],
  Product: ['product', 'pm', 'product manager'],
}

export const analyzeRole = (job: Job): RoleContext => {
  const roleText = job.role.toLowerCase()

  // Determine level - check in order of specificity (most senior first)
  let level: RoleContext['level'] = 'Mid'

  // Check Senior level first since it's more specific than general "engineer" keywords
  if (ROLE_LEVEL_KEYWORDS.Senior.some((keyword) => roleText.includes(keyword))) {
    level = 'Senior'
  } else if (ROLE_LEVEL_KEYWORDS.Principal.some((keyword) => roleText.includes(keyword))) {
    level = 'Principal'
  } else if (ROLE_LEVEL_KEYWORDS.Staff.some((keyword) => roleText.includes(keyword))) {
    level = 'Staff'
  } else if (ROLE_LEVEL_KEYWORDS.Lead.some((keyword) => roleText.includes(keyword))) {
    level = 'Lead'
  } else if (ROLE_LEVEL_KEYWORDS.Entry.some((keyword) => roleText.includes(keyword))) {
    level = 'Entry'
  } else if (ROLE_LEVEL_KEYWORDS.Mid.some((keyword) => roleText.includes(keyword))) {
    level = 'Mid'
  }

  // Determine type
  let type: RoleContext['type'] = 'Full Stack'
  let specialization: string | undefined

  for (const [typeName, keywords] of Object.entries(ROLE_TYPE_KEYWORDS)) {
    if (keywords.some((keyword) => roleText.includes(keyword))) {
      type = typeName as RoleContext['type']

      // Set specialization based on tech stack
      if (type === 'Frontend' && job.techUsed.includes('React')) {
        specialization = 'React'
      } else if (type === 'Mobile' && job.techUsed.includes('iOS')) {
        specialization = 'iOS developer'
      } else if (type === 'Backend' && job.techUsed.includes('Java')) {
        specialization = 'Java developer'
      }
      break
    }
  }

  // Generate description
  let description = `${level}-level position`

  if (specialization) {
    description += ` specializing in ${specialization}`
  } else {
    description += ` in ${type.toLowerCase()} development`
  }

  // Add context based on tech stack diversity
  const techCount = job.techUsed.length
  if (techCount > 7) {
    description += ' with diverse technology stack'
  } else if (techCount > 4) {
    description += ' with comprehensive tech skills'
  } else {
    description += ' with focused expertise'
  }

  return {
    level,
    type,
    specialization,
    description,
  }
}

export const analyzeCareerProgression = (jobs: Job[], currentJobId: string): CareerProgression => {
  const currentJobIndex = jobs.findIndex((job) => job.id === currentJobId)
  const currentJob = jobs[currentJobIndex]
  const total = jobs.length
  const position = total - currentJobIndex // Reverse order (most recent = 1)

  const isCurrentRole = currentJob.endDate === 'Present'
  const isFirstRole = currentJobIndex === total - 1
  const isMostRecent = currentJobIndex === 0

  // Determine progression type
  let progression: CareerProgression['progression'] = 'new-company'

  if (currentJobIndex < total - 1) {
    const previousJob = jobs[currentJobIndex + 1]
    const currentLevel = analyzeRole(currentJob).level
    const previousLevel = analyzeRole(previousJob).level

    const levelHierarchy = ['Entry', 'Mid', 'Senior', 'Staff', 'Principal', 'Lead']
    const currentLevelIndex = levelHierarchy.indexOf(currentLevel)
    const previousLevelIndex = levelHierarchy.indexOf(previousLevel)

    if (currentLevelIndex > previousLevelIndex) {
      progression = 'promotion'
    } else if (currentLevelIndex === previousLevelIndex) {
      progression = 'lateral'
    } else {
      progression = 'career-change'
    }
  }

  // Generate description
  let description: string

  if (isCurrentRole) {
    description = 'Currently active role'
  } else if (isMostRecent) {
    description = 'Most recent position'
  } else if (isFirstRole) {
    description = 'First professional role'
  } else {
    description = `Position ${position} of ${total} in career timeline`
  }

  return {
    position,
    total,
    isCurrentRole,
    isFirstRole,
    isMostRecent,
    progression,
    description,
  }
}
