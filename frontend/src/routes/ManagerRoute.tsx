import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function ManagerRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to={ROUTES.MANAGER.DASHBOARD} replace />}
      />
      <Route
        path="dashboard"
        element={<Placeholder title="Manager Dashboard" />}
        // element={<ManagerDashboard />}
      />
      <Route
        path="students"
        element={<Placeholder title="Students Management" />}
        // element={<StudentsPage />}
      />
      <Route
        path="teachers"
        element={<Placeholder title="Teachers Management" />}
        // element={<TeachersPage />}
      />
      <Route
        path="classes"
        element={<Placeholder title="Classes Management" />}
        // element={<ClassesPage />}
      />
      <Route
        path="subjects"
        element={<Placeholder title="Subjects Management" />}
        // element={<SubjectsPage />}
      />
      <Route
        path="departments"
        element={<Placeholder title="Departments" />}
        // element={<DepartmentsPage />}
      />
      <Route
        path="exams"
        element={<Placeholder title="Exam Models & Grading" />}
        // element={<ExamsPage />}
      />
      <Route
        path="analytics"
        element={<Placeholder title="School Analytics" />}
        // element={<AnalyticsPage />}
      />
      <Route
        path="leaderboard"
        element={<Placeholder title="Student Leaderboard" />}
        // element={<LeaderboardPage />}
      />
      <Route
        path="tasks"
        element={<Placeholder title="Task Scheduler" />}
        // element={<TasksPage />}
      />
      <Route
        path="*"
        element={<Navigate to={ROUTES.MANAGER.DASHBOARD} replace />}
      />
    </Routes>
  )
}