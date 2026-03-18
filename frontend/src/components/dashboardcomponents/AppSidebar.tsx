import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { GraduationCap, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { NAV_BY_ROLE, type Role } from "@/constants"

interface AppSidebarProps {
  role: Role
}

export function AppSidebar({ role }: AppSidebarProps) {
  const location = useLocation()
  const navItems = NAV_BY_ROLE[role]
  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar className="border-r">

      {/* ── Brand ── */}
      <SidebarHeader className="px-5 py-5 border-b">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base leading-tight">SchoolMS</span>
            <span className="text-xs text-muted-foreground capitalize">{role} panel</span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="gap-1 p-0">
          <SidebarGroupLabel className="px-2 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-11 px-3 rounded-lg text-sm font-medium gap-3 transition-all duration-150
                        hover:bg-accent hover:text-accent-foreground
                        data-[active=true]:bg-primary data-[active=true]:text-primary-foreground
                        data-[active=true]:shadow-sm data-[active=true]:font-semibold"
                    >
                      <Link to={item.path} onClick={handleNavClick}>
                        <div className={`size-8 rounded-md flex items-center justify-center shrink-0 transition-colors
                          ${isActive
                            ? 'bg-primary-foreground/15'
                            : 'bg-muted group-hover:bg-accent-foreground/10'
                          }`}
                        >
                          <item.icon className="size-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-11 px-3 rounded-lg text-sm font-medium gap-3 w-full
                text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-150"
            >
              <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <LogOut className="size-4" />
              </div>
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}