import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import DashboardLayout from '@/layouts/DashboardLayout'
import { ROLES } from '@/constants'

// ── Page imports (create these files as you build) ────
// import AdminDashboard  from '@/pages/admin/AdminDashboard'
// import TeachersPage    from '@/pages/admin/TeachersPage'
// import StudentsPage    from '@/pages/admin/StudentsPage'
// import ClassesPage     from '@/pages/admin/ClassesPage'
// import DepartmentsPage from '@/pages/admin/DepartmentsPage'
// import SubjectsPage    from '@/pages/admin/SubjectsPage'
// import ExamsPage       from '@/pages/admin/ExamsPage'
// import AnalyticsPage   from '@/pages/admin/AnalyticsPage'
// import SettingsPage    from '@/pages/admin/SettingsPage'

// ── Placeholder until pages are built ─────────────────
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-gray-400">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role={ROLES.ADMIN} />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route path="dashboard" element={<Placeholder title="Admin Dashboard" />}
        // element={<AdminDashboard />}
        />
        <Route path="teachers" element={<Placeholder title="Teachers" />}
        // element={<TeachersPage />}
        />
        <Route path="students" element={<Placeholder title="Students" />}
        // element={<StudentsPage />}
        />
        <Route path="classes" element={<Placeholder title="Classes" />}
        // element={<ClassesPage />}
        />
        <Route path="departments" element={<Placeholder title="Departments" />}
        // element={<DepartmentsPage />}
        />
        <Route path="subjects" element={<Placeholder title="Subjects" />}
        // element={<SubjectsPage />}
        />
        <Route path="exams" element={<Placeholder title="Exams" />}
        // element={<ExamsPage />}
        />
        <Route path="analytics" element={<Placeholder title="Analytics" />}
        // element={<AnalyticsPage />}
        />
        <Route path="settings" element={<Placeholder title="Settings" />}
        // element={<SettingsPage />}
        />

        {/* Catch-all inside /admin → redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />}
        />
      </Route>

    </Routes>
  )
}