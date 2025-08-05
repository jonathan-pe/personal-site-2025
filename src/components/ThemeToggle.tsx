import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className='h-5 w-5' />
      case 'dark':
        return <Moon className='h-5 w-5' />
      case 'system':
        return <Monitor className='h-5 w-5' />
      default:
        return <Monitor className='h-5 w-5' />
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      className='fixed top-4 right-4 z-50 p-2 transition-colors'
      variant='outline'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
    >
      {getIcon()}
    </Button>
  )
}
