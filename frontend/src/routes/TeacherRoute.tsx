// src/routes/TeacherRoute.tsx
import { Navigate, Route, Routes } from 'react-router-dom'
import PendingMarksPage from '@/pages/teacher/PendingMarksPage'
import MarksEntryPage from '@/pages/teacher/MarksEntryPage'
import TeacherMarksViewPage from '@/pages/teacher/TeacherMarksViewPage'
import TeacherClassDetailPage from '@/pages/teacher/TeacherClassDetailPage'
import TeacherStudentProfilePage from '@/pages/teacher/TeacherStudentProfilePage'
import TeacherProfilePage from '@/pages/shared/TeacherProfilePage'
import DashboardLayout from '@/layouts/DashboardLayout'
import TeacherDashboard from '@/pages/teacher/TeacherDashBoard'
import { ROLES } from '@/config/routes.config'
import TeacherClassesPage from '@/pages/teacher/TeacherClassesPage'
import ClassMarksPage from '@/pages/teacher/ClassMarksPage'

export const TeacherRoute = () => (
  // <Route element={<DashboardLayout role={ROLES.ADMIN} />}>
  //     <Route index element={<Navigate to="dashboard" replace />} />
  //     <Route path="dashboard" element={<AdminDashboard />} />
  <Routes>
    <Route element={<DashboardLayout role={ROLES.TEACHER} />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="classes" element={<TeacherClassesPage />} />
      <Route path="classes/:id" element={<TeacherClassDetailPage />} />
      <Route path="students/:id" element={<TeacherStudentProfilePage />} />

      <Route path="classes/:classId/marks" element={<ClassMarksPage />} />
      <Route path="marks/:scheduleId" element={<MarksEntryPage />} />
      <Route path="marks/:scheduleId/view" element={<TeacherMarksViewPage />} />
      <Route path="profile" element={<TeacherProfilePage />} />
    </Route>

  </Routes>
)