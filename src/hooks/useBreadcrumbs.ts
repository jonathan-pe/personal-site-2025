import { useLocation } from '@tanstack/react-router'
import { useContext, useEffect, useCallback, useMemo } from 'react'
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage: boolean
}

interface UseBreadcrumbsReturn {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbLabel: (label: string) => void
}

export const useBreadcrumbs = (): UseBreadcrumbsReturn => {
  const location = useLocation()
  const { customLabels, setCustomLabel, clearCustomLabel } = useContext(BreadcrumbContext)

  // Memoize the setBreadcrumbLabel function to prevent re-renders
  const setBreadcrumbLabel = useCallback(
    (label: string) => {
      setCustomLabel(location.pathname, label)
    },
    [location.pathname, setCustomLabel]
  )

  // Auto-cleanup when path changes or component unmounts
  useEffect(() => {
    return () => {
      clearCustomLabel(location.pathname)
    }
  }, [location.pathname, clearCustomLabel])

  // Memoize breadcrumbs generation based on location and custom labels
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    // For root route, just show "Home"
    if (location.pathname === '/') {
      return [{ label: 'Home', href: '/', isCurrentPage: true }]
    }

    // Split path into segments and create breadcrumbs
    const segments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/', isCurrentPage: false }]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Check if we have a custom label for this specific path first
      let label = customLabels[currentPath]

      // If no custom label and it's the current page, check if the full current path has a label
      if (!label && isLast) {
        label = customLabels[location.pathname]
      }

      // Fall back to formatted segment
      if (!label) {
        label = formatSegment(segment)
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      })
    })

    return breadcrumbs
  }, [location.pathname, customLabels])

  return {
    breadcrumbs,
    setBreadcrumbLabel,
  }
}

const formatSegment = (segment: string): string => {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
