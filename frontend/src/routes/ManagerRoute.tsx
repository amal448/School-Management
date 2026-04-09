import { ROLES, ROUTES } from '@/config/routes.config'
import DashboardLayout from '@/layouts/DashboardLayout'
import AdminTeacherListPage from '@/pages/admin/AdminTeacherListPage'
import ClassDetailPage from '@/pages/shared/ClassDetailPage'
import ClassListPage from '@/pages/shared/ClassListPage'
import DepartmentListPage from '@/pages/shared/DepartmentListPage'
import ExamDetailPage from '@/pages/shared/ExamDetailPage'
import ExamListPage from '@/pages/shared/ExamListPage'
import StudentProfilePage from '@/pages/shared/StudentProfilePage'
import SubjectListPage from '@/pages/shared/SubjectListPage'
import TeacherProfilePage from '@/pages/shared/TeacherProfilePage'
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
        <Route index element={<Navigate to={ROUTES.MANAGER.DASHBOARD} replace />} />
        <Route path="dashboard" element="" />
        <Route path="students/:id" element={<StudentProfilePage />} />
        <Route path="teacher" element={<AdminTeacherListPage />} />
        <Route path="teacher/:id" element={<TeacherProfilePage />} />
        <Route path="departments" element={<DepartmentListPage />} />
        <Route path="subjects" element={<SubjectListPage />} />
        <Route path="classes" element={<ClassListPage />} />
        <Route path="classes/:id" element={<ClassDetailPage />} />
        <Route path="exams" element={<ExamListPage />} />
        <Route path="exams/:id" element={<ExamDetailPage />} />
        <Route path="analytics" element={<Placeholder title="School Analytics" />} />
        <Route path="leaderboard" element={<Placeholder title="Student Leaderboard" />} />
        <Route path="tasks" element={<Placeholder title="Task Scheduler" />} />
        <Route path="*" element={<Navigate to={ROUTES.MANAGER.DASHBOARD} replace />} />
      </Route>

    </Routes>
  )
}