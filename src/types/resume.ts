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
}
