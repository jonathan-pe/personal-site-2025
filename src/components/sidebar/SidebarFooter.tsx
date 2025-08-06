import { GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface SocialLink {
  name: string
  icon: React.ComponentType<{ className?: string }>
  url: string
  label: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: LinkedinLogoIcon,
    url: 'https://linkedin.com/in/jonathanqpe',
    label: 'Connect on LinkedIn',
  },
  {
    name: 'GitHub',
    icon: GithubLogoIcon,
    url: 'https://github.com/jonathan-pe',
    label: 'View GitHub Profile',
  },
]

export function AppSidebarFooter() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarFooter className='border-t border-border/50'>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'flex-row justify-between items-center'}`}>
            {/* Social Media Links */}
            <div className={`flex ${isCollapsed ? 'flex-col gap-1' : 'gap-2'}`}>
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Button
                    key={link.name}
                    variant='ghost'
                    size='icon'
                    asChild
                    className='h-8 w-8 hover:bg-sidebar-accent!'
                  >
                    <a href={link.url} target='_blank' rel='noopener noreferrer' aria-label={link.label}>
                      <Icon className='h-6 w-6' />
                    </a>
                  </Button>
                )
              })}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
