import TechBadge from '@/components/TechBadge'

interface TechBadgeListProps {
  techList: string[]
  maxVisible?: number
  className?: string
}

const TechBadgeList = ({ techList, maxVisible = 4, className = '' }: TechBadgeListProps) => {
  const visibleTech = techList.slice(0, maxVisible)
  const remainingCount = techList.length - maxVisible

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
}

export default TechBadgeList
