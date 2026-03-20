import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout             from '@/layouts/DashboardLayout'
import { ROLES }                   from '@/config/routes.config'
import AdminDashboard              from '@/pages/admin/AdminDashboard'
import AdminTeacherListPage        from '@/pages/admin/AdminTeacherListPage'
import AdminStudentListPage        from '@/pages/admin/AdminStudentListPage'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-muted-foreground">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role={ROLES.ADMIN} />}>
        <Route index                  element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"       element={<AdminDashboard />} />
        <Route path="teachers"        element={<AdminTeacherListPage />} />
        <Route path="students"        element={<AdminStudentListPage />} />
        <Route path="classes"         element={<Placeholder title="Classes" />} />
        <Route path="departments"     element={<Placeholder title="Departments" />} />
        <Route path="subjects"        element={<Placeholder title="Subjects" />} />
        <Route path="exams"           element={<Placeholder title="Exams" />} />
        <Route path="analytics"       element={<Placeholder title="Analytics" />} />
        <Route path="settings"        element={<Placeholder title="Settings" />} />
        <Route path="*"               element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}