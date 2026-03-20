import { useEffect }                    from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore }                 from '@/store/auth.store'
import { ROUTES }                       from '@/config/routes.config'
import { getDashboardPath }             from '@/utils/role.utils'

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate        = useNavigate()
  const fetchMe         = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    const handle = async () => {
      const error = searchParams.get('error')

      if (error) {
        navigate(`${ROUTES.AUTH.ADMIN_MANAGER_LOGIN}?error=oauth_failed`, { replace: true })
        return
      }

      try {
        await fetchMe()
        const user = useAuthStore.getState().user
        if (user) {
          navigate(getDashboardPath(user.role), { replace: true })
        } else {
          navigate(`${ROUTES.AUTH.ADMIN_MANAGER_LOGIN}?error=session_failed`, { replace: true })
        }
      } catch {
        navigate(`${ROUTES.AUTH.ADMIN_MANAGER_LOGIN}?error=session_failed`, { replace: true })
      }
    }

    handle()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <p className="text-sm font-medium">Setting up your session...</p>
      <p className="text-xs text-muted-foreground">You will be redirected shortly</p>
    </div>
  )
}

export default AuthCallbackPage