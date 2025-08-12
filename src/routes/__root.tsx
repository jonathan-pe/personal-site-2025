import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'
import { MobileHeader } from '@/components/MobileHeader'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='personal-site-theme'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className='flex flex-col min-h-screen'>
            <MobileHeader />
            <Outlet />
          </div>
        </SidebarInset>
        <TanStackRouterDevtools position='bottom-right' />
      </SidebarProvider>
    </ThemeProvider>
  )
}
