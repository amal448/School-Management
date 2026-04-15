import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import { ROLES } from '@/config/routes.config'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminTeacherListPage from '@/pages/admin/AdminTeacherListPage'
import AdminManagerListPage from '@/pages/admin/AdminManagerListPage'
import TeacherProfilePage from '@/pages/shared/TeacherProfilePage'
import ManagerProfilePage from '@/pages/admin/ManagerProfilePage'
import DepartmentListPage from '@/pages/shared/DepartmentListPage'
import SubjectListPage from '@/pages/shared/SubjectListPage'
import ClassListPage from '@/pages/shared/ClassListPage'
import ClassDetailPage from '@/pages/shared/ClassDetailPage'
import ExamListPage from '@/pages/shared/ExamListPage'
import ExamDetailPage from '@/pages/shared/ExamDetailPage'
import StudentProfilePage from '@/pages/shared/StudentProfilePage'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64 text-muted-foreground">
    <p className="text-lg font-medium">{title} — coming soon</p>
  </div>
)

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role={ROLES.ADMIN} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teacher" element={<AdminTeacherListPage />} />
        <Route path="teacher/:id" element={<TeacherProfilePage />} />
        {/* <Route path="students" element={<AdminStudentListPage />} /> */}
        <Route path="students/:id" element={<StudentProfilePage />} />


        <Route path="manager" element={<AdminManagerListPage />} />
        <Route path="manager/:id" element={<ManagerProfilePage />} />
        <Route path="departments" element={<DepartmentListPage />} />
        <Route path="subjects" element={<SubjectListPage />} />
        <Route path="classes" element={<ClassListPage />} />
        <Route path="classes/:id" element={<ClassDetailPage />} />
        <Route path="exams" element={<ExamListPage />} />
        <Route path="exams/:id" element={<ExamDetailPage />} />
        <Route path="analytics" element={<Placeholder title="Analytics" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}