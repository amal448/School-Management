import { ROUTES } from '@/config/routes.config'
import { Routes, Route, Navigate } from 'react-router-dom'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function StudentRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />}
      />
      <Route
        path="dashboard"
        element={<Placeholder title="Student Dashboard" />}
        // element={<StudentDashboard />}
      />
      <Route
        path="performance"
        element={<Placeholder title="My Performance" />}
        // element={<PerformancePage />}
      />
      <Route
        path="attendance"
        element={<Placeholder title="My Attendance" />}
        // element={<AttendancePage />}
      />
      <Route
        path="results"
        element={<Placeholder title="Exam Results" />}
        // element={<ResultsPage />}
      />
      <Route
        path="assignments"
        element={<Placeholder title="My Assignments" />}
        // element={<AssignmentsPage />}
      />
      <Route
        path="*"
        element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />}
      />
    </Routes>
  )
}