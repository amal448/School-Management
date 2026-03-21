// pages/admin/AdminDashboard.tsx
import { PageRoot, PageHeader, StatsGrid, StatCard, ContentGrid, PageSection } from '@/components/ui/page'
import { Users, GraduationCap, BookOpen, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManagerDashboard() {
  return (
    <PageRoot>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Amal. Here's what's happening today."
        actions={<Button size="sm">Download Report</Button>}
      />

      <StatsGrid>
        <StatCard title="Total Students" value="1,284"  icon={GraduationCap} trend={{ value: 4.2,  label: 'vs last month' }} />
        <StatCard title="Teachers"       value="86"     icon={Users}         trend={{ value: 1.1,  label: 'vs last month' }} />
        <StatCard title="Active Courses" value="34"     icon={BookOpen}      trend={{ value: -2.0, label: 'vs last month' }} />
        <StatCard title="Avg Attendance" value="91.4%"  icon={BarChart3}     trend={{ value: 0.8,  label: 'vs last month' }} />
      </StatsGrid>

      <ContentGrid>
        <div className="lg:col-span-2">
          <PageSection>
            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>...</CardContent>
            </Card>
          </PageSection>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent>...</CardContent>
          </Card>
        </div>
      </ContentGrid>
    </PageRoot>
  )
}