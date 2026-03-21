import { ROLES, ROUTES } from '@/config/routes.config'
import DashboardLayout from '@/layouts/DashboardLayout'
import ClassListPage from '@/pages/shared/ClassListPage'
import DepartmentListPage from '@/pages/shared/DepartmentListPage'
import SubjectListPage from '@/pages/shared/SubjectListPage'
import { Routes, Route, Navigate } from 'react-router-dom'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function ManagerRoutes() {
  return (
    <Routes>

      <Route element={<DashboardLayout role={ROLES.MANAGER} />}>
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
        <Route path="departments" element={<DepartmentListPage />} />
        <Route path="subjects" element={<SubjectListPage />} />
        <Route path="classes" element={<ClassListPage />} />
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
      </Route>

    </Routes>
  )
}