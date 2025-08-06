import * as React from 'react'
import { NavMain } from '@/components/sidebar/NavMain'
import { AppSidebarFooter } from '@/components/sidebar/SidebarFooter'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from '@/components/ui/sidebar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@tanstack/react-router'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link to='/'>
          <div className='flex items-center gap-4'>
            <Avatar>
              <AvatarImage src='/src/assets/profileIcon.jpg' />
            </Avatar>
            {state === 'expanded' && <h1 className='text-lg text-foreground'>Jonathan Pe</h1>}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
