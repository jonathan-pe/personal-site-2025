import { lazy, Suspense } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar'
import { MobileHeader } from '@/components/MobileHeader'
import { ChatBot } from '@/components/chat/ChatBot'

const RouterDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-router-devtools').then((mod) => ({ default: mod.TanStackRouterDevtools })))
  : null

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
        <ChatBot />
        {RouterDevtools ? (
          <Suspense fallback={null}>
            <RouterDevtools position='bottom-right' />
          </Suspense>
        ) : null}
      </SidebarProvider>
    </ThemeProvider>
  )
}
