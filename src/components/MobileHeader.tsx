import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar'

export function MobileHeader() {
  const { isMobile } = useSidebar()

  // Only show on mobile devices
  if (!isMobile) {
    return null
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden'>
      <div className='flex h-14 items-center px-4'>
        <SidebarTrigger className='mr-2' />
        <div className='flex items-center space-x-2'>
          <h1 className='text-lg font-semibold'>Jonathan Pe</h1>
        </div>
      </div>
    </header>
  )
}
