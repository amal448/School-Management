import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/dashboardcomponents/AppSidebar'
import { DashboardNavbar } from '@/components/dashboardcomponents/DashboardNavbar'
import { Role } from '@/config/routes.config'

interface DashboardLayoutProps {
  role: Role
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <main className="flex flex-col flex-1 min-h-screen">
        <DashboardNavbar
          role={role}
          userName="Amal Thomas"
          userEmail="amal@schoolms.com"
        />
        <div className="flex-1 p-6 flex flex-col gap-6 min-h-0">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout