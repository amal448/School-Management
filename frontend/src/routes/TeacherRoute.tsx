import { ROUTES } from '@/config/routes.config'
import { Routes, Route, Navigate } from 'react-router-dom'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to={ROUTES.TEACHER.DASHBOARD} replace />} />
      <Route path="dashboard" element={<Placeholder title="Teacher Dashboard" />} />
      <Route path="classes" element={<Placeholder title="My Classes" />} />
      <Route path="attendance" element={<Placeholder title="Record Attendance" />} />
      <Route path="marks" element={<Placeholder title="Upload Marks" />} />
      <Route path="assignments" element={<Placeholder title="Assignments" />} />
      <Route path="students" element={<Placeholder title="My Students" />} />
      <Route path="*" element={<Navigate to={ROUTES.TEACHER.DASHBOARD} replace />} />
    </Routes>
  )
}