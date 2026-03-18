import { useState } from 'react'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCheck,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Role } from '@/constants'

// ── Types ──────────────────────────────────────────────
interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'alert'
}

interface DashboardNavbarProps {
  role: Role
  userName?: string
  userEmail?: string
  avatarUrl?: string
}

// ── Mock notifications (replace with real data) ────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New student enrolled',
    message: 'Arjun Menon has been added to Class 10-A.',
    time: '2 min ago',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Exam schedule updated',
    message: 'Mid-term exams rescheduled to next Monday.',
    time: '1 hr ago',
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Attendance alert',
    message: '3 students below 75% attendance this month.',
    time: '3 hr ago',
    read: false,
    type: 'alert',
  },
  {
    id: '4',
    title: 'Report generated',
    message: 'Monthly analytics report is ready.',
    time: 'Yesterday',
    read: true,
    type: 'info',
  },
]

// ── Notification icon by type ──────────────────────────
const NotifIcon = ({ type }: { type: Notification['type'] }) => {
  if (type === 'warning') return <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
  if (type === 'alert')   return <AlertCircle   className="size-4 text-red-500   mt-0.5 shrink-0" />
  return                         <Info          className="size-4 text-blue-500  mt-0.5 shrink-0" />
}

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

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}