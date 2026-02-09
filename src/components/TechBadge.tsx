import { memo } from 'react'

const TechBadge = memo(({ tech }: { tech: string }) => {
  return <span className='px-2 py-1 bg-accent/10 text-accent text-xs rounded-md whitespace-nowrap'>{tech}</span>
})

TechBadge.displayName = 'TechBadge'

export default TechBadge
