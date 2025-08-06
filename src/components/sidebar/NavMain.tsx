'use client'

import { ChevronRight, ScrollTextIcon, UserIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { RESUME } from '@/data/resume'
import { PROJECTS } from '@/data/projects'

const items = [
  {
    title: 'About Me',
    url: '/about',
    icon: UserIcon,
    isActive: true,
  },
  {
    title: 'Resume',
    url: '/resume',
    icon: ScrollTextIcon,
    items: RESUME.map((job) => ({
      title: job.companyName,
      url: `/resume/${job.id}`,
    })),
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: BookOpen,
    items: PROJECTS.map((project) => ({
      title: project.title,
      url: `/projects/${project.id}`,
    })),
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
              <SidebarMenuItem>
                <div className='relative group/item'>
                  {item.url ? (
                    <Link to={item.url}>
                      <SidebarMenuButton tooltip={item.title} className='w-full justify-start pr-8'>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  ) : (
                    <SidebarMenuButton tooltip={item.title} className='w-full justify-start pr-8'>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                  <CollapsibleTrigger asChild>
                    <button className='absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-accent/80 group-hover/item:text-accent-foreground transition-colors'>
                      <ChevronRight className='h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url} className='flex items-center gap-2'>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className='flex items-center gap-2'>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
