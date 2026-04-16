import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROUTES, ROLES } from '@/config/routes.config'

import AdminManagerLogin from '@/pages/auth/AdminLoginPage'
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage'
import NotFoundPage from '@/pages/errors/NotFoundPage'
import UnauthorizedPage from '@/pages/errors/UnauthorizedPage'

import AdminRoutes from '@/routes/AdminRoute'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import ManagerRoutes from './routes/ManagerRoute'
import { TeacherRoute } from './routes/TeacherRoute'
import PublicRoutes from './routes/PublicRoute'
import StudentRoutes from './routes/StudentRoute'
import StudentLoginPage from './pages/auth/StudentLogin'

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/*" element={<PublicRoutes />} />
        {/* <Route path="/" element={<Navigate to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN} replace />} /> */}

        {/* Public auth */}
        <Route path={ROUTES.AUTH.ADMIN_MANAGER_LOGIN} element={<AdminManagerLogin />} />
        <Route path={ROUTES.AUTH.STUDENT_LOGIN} element={<StudentLoginPage />} />
        <Route path={ROUTES.AUTH.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={ROUTES.AUTH.ADMIN_GOOGLE_CALLBACK} element={<AuthCallbackPage />} />

        {/* Admin (protected) */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
        />
        {/* Admin (protected) */}
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
              <ManagerRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
              <TeacherRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentRoutes />
            </ProtectedRoute>
          }
        />

        {/* Errors */}
        <Route path={ROUTES.AUTH.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App