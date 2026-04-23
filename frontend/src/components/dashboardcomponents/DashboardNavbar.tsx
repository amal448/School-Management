import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { DashboardNavbarProps } from '@/types/auth.types'



// ── Component ──────────────────────────────────────────
export function DashboardNavbar({
  role,
  userName  = 'Admin User',
  userEmail = 'admin@schoolms.com',
  avatarUrl,
}: DashboardNavbarProps) {

  
  // Initials fallback for avatar
  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-2.5 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">

      {/* Left — trigger + breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="shrink-0" />
        <div className="hidden sm:block h-5 w-px bg-border" />
        {/* <span className="hidden sm:block text-sm text-muted-foreground capitalize">
          {role} Portal
        </span> */}
        
            <Badge style={{backgroundColor:'red'}}>  {role.toUpperCase()} PORTAL</Badge>
       
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">

    
        {/* ── Profile Dropdown ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              {/* Avatar */}
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                {avatarUrl
                  ? <img src={avatarUrl} alt={userName} className="size-full object-cover" />
                  : initials
                }
              </div>
              {/* Name — hidden on small screens */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{role}</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Identity */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>

            {/* <DropdownMenuSeparator /> */}

            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup> */}

            {/* <DropdownMenuSeparator /> */}

            {/* <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4 mr-2" />
              Logout
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}