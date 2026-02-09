import { memo, useMemo } from 'react'
import TechBadge from '@/components/TechBadge'

interface TechBadgeListProps {
  techList: string[]
  maxVisible?: number
  className?: string
}

const TechBadgeList = memo(({ techList, maxVisible = 4, className = '' }: TechBadgeListProps) => {
  const { visibleTech, remainingCount } = useMemo(() => {
    return {
      visibleTech: techList.slice(0, maxVisible),
      remainingCount: techList.length - maxVisible,
    }
  }, [techList, maxVisible])

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleTech.map((tech) => (
        <TechBadge key={tech} tech={tech} />
      ))}
      {remainingCount > 0 && (
        <span className='px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md whitespace-nowrap'>
          +{remainingCount} more
        </span>
      )}
    </div>
  )
})

TechBadgeList.displayName = 'TechBadgeList'

export default TechBadgeList
