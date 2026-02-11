import type { Icon } from '@/types/icon'
import type { Job } from '@/types/resume'
import {
  AppleIcon,
  DolbyIcon,
  EpicGamesIcon,
  GliffyIcon,
  MetaIcon,
  ReputationIcon,
  STRATIMIcon,
} from '@/assets/CompanyIcons'

import resumeData from './resume.json'

type ResumeRecord = Omit<Job, 'icon'>

const iconMap: Record<string, Icon> = {
  epicGames: EpicGamesIcon,
  meta: MetaIcon,
  apple: AppleIcon,
  reputation: ReputationIcon,
  dolbyIO: DolbyIcon,
  STRATIM_OPENLANE: STRATIMIcon,
  gliffy: GliffyIcon,
}

const resumeRecords = resumeData as ResumeRecord[]

export const RESUME: Array<Job> = resumeRecords.map((job) => ({
  ...job,
  icon: iconMap[job.id],
}))
