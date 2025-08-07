import { createContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

export interface BreadcrumbContextType {
  customLabels: Record<string, string>
  setCustomLabel: (path: string, label: string) => void
  clearCustomLabel: (path: string) => void
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  customLabels: {},
  setCustomLabel: () => {},
  clearCustomLabel: () => {},
})

interface BreadcrumbProviderProps {
  children: ReactNode
}

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({})

  const setCustomLabel = useCallback((path: string, label: string) => {
    setCustomLabels((prev) => ({ ...prev, [path]: label }))
  }, [])

  const clearCustomLabel = useCallback((path: string) => {
    setCustomLabels((prev) => {
      const { [path]: _, ...rest } = prev
      return rest
    })
  }, [])

  const value = useMemo(
    () => ({
      customLabels,
      setCustomLabel,
      clearCustomLabel,
    }),
    [customLabels, setCustomLabel, clearCustomLabel]
  )

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}
