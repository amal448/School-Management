import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={ROUTES.TEACHER.DASHBOARD} replace />}
      />
      <Route
        path="dashboard"
        element={<Placeholder title="Teacher Dashboard" />}
        // element={<TeacherDashboard />}
      />
      <Route
        path="classes"
        element={<Placeholder title="My Classes" />}
        // element={<MyClassesPage />}
      />
      <Route
        path="attendance"
        element={<Placeholder title="Record Attendance" />}
        // element={<AttendancePage />}
      />
      <Route
        path="marks"
        element={<Placeholder title="Upload Marks" />}
        // element={<MarksPage />}
      />
      <Route
        path="assignments"
        element={<Placeholder title="Assignments" />}
        // element={<AssignmentsPage />}
      />
      <Route
        path="students"
        element={<Placeholder title="My Students" />}
        // element={<MyStudentsPage />}
      />
      <Route
        path="*"
        element={<Navigate to={ROUTES.TEACHER.DASHBOARD} replace />}
      />
    </Routes>
  )
}