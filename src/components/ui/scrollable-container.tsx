import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollableContainerProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showFadeGradient?: boolean
}

export const ScrollableContainer = ({
  children,
  className,
  contentClassName,
  showFadeGradient = true,
}: ScrollableContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollability()
    const container = containerRef.current
    if (!container) return

    // Check scrollability on mount and resize
    const resizeObserver = new ResizeObserver(checkScrollability)
    resizeObserver.observe(container)

    // Check on scroll
    container.addEventListener('scroll', checkScrollability)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('scroll', checkScrollability)
    }
  }, [children])

  return (
    <div className={cn('relative', className)}>
      {/* Left fade gradient */}
      {showFadeGradient && canScrollLeft && (
        <div className='absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
      )}

      {/* Right fade gradient */}
      {showFadeGradient && canScrollRight && (
        <div className='absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
      )}

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className={cn('overflow-x-auto', canScrollLeft || canScrollRight ? 'scroll-indicator' : '', contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}
