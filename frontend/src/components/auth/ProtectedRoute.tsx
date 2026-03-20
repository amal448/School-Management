import { useEffect }    from 'react'
import { Navigate }     from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Role }         from '@/types/auth.types'
import { ROUTES }       from '@/config/routes.config'

interface Props {
  children:     React.ReactNode
  allowedRoles: Role[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, isLoading, isChecked, fetchMe } = useAuthStore()

  useEffect(() => {
    if (!isChecked) fetchMe()
  }, [isChecked, fetchMe])

  if (!isChecked || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.AUTH.UNAUTHORIZED} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute