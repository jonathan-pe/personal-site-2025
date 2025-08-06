export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Styling/Design'
  | 'State Management'
  | 'Testing'
  | 'Other'
  | 'Data Fetching'
  | 'Tooling'
  | 'Databases/ORMs'
  | 'Authentication'
  | 'DevOps'
  | 'Data Visualization'
  | 'Performance/Analytics'

export type SkillLevel = 1 | 2 | 3 | 4 | 5

export interface Skill {
  id: string
  name: string
  level: SkillLevel
  category: SkillCategory
}
