import type { Icon } from '@/types/icon'

export interface Job {
  id: string
  companyName: string
  role: string
  startDate: string
  endDate: string
  icon: Icon
  accomplishments: string[]
  techUsed: string[]
  stackFocus: {
    frontend: number // percentage (0-100)
    backend: number // percentage (0-100)
  }
}
