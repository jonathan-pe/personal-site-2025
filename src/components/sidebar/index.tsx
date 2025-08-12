import * as React from 'react'
import { NavMain } from '@/components/sidebar/NavMain'
import { AppSidebarFooter } from '@/components/sidebar/SidebarFooter'
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
