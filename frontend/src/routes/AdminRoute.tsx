import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import { ROLES } from '@/constants'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import StudentListPage from '@/pages/admin/StudentListPage'
import TeacherListPage from '@/pages/admin/TeacherListPage'

// import ClassesPage     from '@/pages/admin/ClassesPage'
// import DepartmentsPage from '@/pages/admin/DepartmentsPage'
// import SubjectsPage    from '@/pages/admin/SubjectsPage'
// import ExamsPage       from '@/pages/admin/ExamsPage'
// import AnalyticsPage   from '@/pages/admin/AnalyticsPage'
// import SettingsPage    from '@/pages/admin/SettingsPage'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

// AdminRoute.tsx — no login route here
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role={ROLES.ADMIN} />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard"   element={<AdminDashboard />} />
        <Route path="teachers"    element={<TeacherListPage />} />
        <Route path="students"    element={<StudentListPage />} />
        <Route path="classes"     element={<Placeholder title="Classes" />} />
        <Route path="departments" element={<Placeholder title="Departments" />} />
        <Route path="subjects"    element={<Placeholder title="Subjects" />} />
        <Route path="exams"       element={<Placeholder title="Exams" />} />
        <Route path="analytics"   element={<Placeholder title="Analytics" />} />
        <Route path="settings"    element={<Placeholder title="Settings" />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}