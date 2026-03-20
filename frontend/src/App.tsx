import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider }                     from '@tanstack/react-query'
import { queryClient }                             from '@/lib/query-client'
import ProtectedRoute                              from '@/components/auth/ProtectedRoute'
import { ROUTES, ROLES }                           from '@/config/routes.config'

// Auth pages
import AdminManagerLogin  from '@/pages/auth/AdminManagerLogin'
import AuthCallbackPage   from '@/pages/auth/AuthCallbackPage'
import NotFoundPage       from '@/pages/errors/NotFoundPage'
import UnauthorizedPage   from '@/pages/errors/UnauthorizedPage'

// Role routes
import AdminRoutes        from '@/routes/AdminRoute'

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN} replace />} />

        {/* Public auth */}
        <Route path={ROUTES.AUTH.ADMIN_MANAGER_LOGIN}   element={<AdminManagerLogin />} />
        <Route path={ROUTES.AUTH.ADMIN_GOOGLE_CALLBACK} element={<AuthCallbackPage />} />

        {/* Admin (protected) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Errors */}
        <Route path={ROUTES.AUTH.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*"                        element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App