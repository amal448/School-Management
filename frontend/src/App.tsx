import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import AdminRoutes from './routes/AdminRoute'
import ManagerRoutes from './routes/ManagerRoute'
import TeacherRoutes from './routes/TeacherRoute'
import StudentRoutes from './routes/StudentRoute'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path={ROUTES.HOME}    element={<div>Home</div>}  />
        <Route path={ROUTES.ABOUT}   element={<div>About</div>} />
        <Route path={ROUTES.COURSES} element={<div>Courses</div>} />
        <Route path={ROUTES.CONTACT} element={<div>Contact</div>} />
        <Route path={ROUTES.LOGIN}   element={<div>Login</div>}  />

        {/* ── Role Routes ── */}
        <Route
          path={ROUTES.ADMIN.ROOT + '/*'}
          element={<AdminRoutes />}
        />
        <Route
          path={ROUTES.MANAGER.ROOT + '/*'}
          element={<ManagerRoutes />}
        />
        <Route
          path={ROUTES.TEACHER.ROOT + '/*'}
          element={<TeacherRoutes />}
        />
        <Route
          path={ROUTES.STUDENT.ROOT + '/*'}
          element={<StudentRoutes />}
        />

        {/* ── Catch-all ── */}
        <Route
          path="*"
          element={<Navigate to={ROUTES.HOME} replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}
