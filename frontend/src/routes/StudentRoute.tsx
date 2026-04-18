import { ROLES, ROUTES } from '@/config/routes.config'
import DashboardLayout from '@/layouts/DashboardLayout'
import StudentDashboard from '@/pages/student/StudentDashBoardPage'
import StudentResultsPage from '@/pages/student/StudentResultsPage'
import { Routes, Route, Navigate } from 'react-router-dom'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role={ROLES.STUDENT} />}>
        <Route index element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />

        <Route path="results" element={<StudentResultsPage />} />

        <Route path="performance" element={<Placeholder title="My Performance" />} />
        <Route path="attendance" element={<Placeholder title="My Attendance" />} />
        <Route path="assignments" element={<Placeholder title="My Assignments" />} />
        <Route path="*" element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
      </Route>

    </Routes>
  )
}