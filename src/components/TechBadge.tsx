const TechBadge = ({ tech }: { tech: string }) => {
  return <span className='px-2 py-1 bg-accent/10 text-accent text-xs rounded-md'>{tech}</span>
}

export default TechBadge
