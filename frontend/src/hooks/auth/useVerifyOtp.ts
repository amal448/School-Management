import { useState }     from 'react'
import { useMutation }  from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi }      from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardPath } from '@/utils/role.utils'
import { OtpRole }      from '@/types/auth.types'
import { AuthError }    from '@/constants/auth'

interface OtpLocationState {
  email: string
  role:  OtpRole
}

export const useVerifyOtp = () => {
  const navigate        = useNavigate()
  const location        = useLocation()
  const fetchMe         = useAuthStore((s) => s.fetchMe)
  const { email, role } = (location.state ?? {}) as OtpLocationState

  const [otp,   setOtp]   = useState('')
  const [error, setError] = useState<AuthError | null>(null)

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyOtp({ email, otp, role }),
    onSuccess: async () => {
      // Cookies set by backend — fetch user then redirect
      await fetchMe()
      const user = useAuthStore.getState().user
      if (user) {
        navigate(getDashboardPath(user.role), { replace: true })
      }
    },
    onError: (err: any) => {
      const code = err?.response?.data?.errorCode as string
      if (code === 'UNAUTHORIZED') setError('OTP_INVALID')
      else                          setError('UNKNOWN')
      setOtp('')
    },
  })

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, '').slice(0, 6))
    if (error) setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return
    verifyMutation.mutate()
  }

  return {
    email, role, otp, error,
    loading: verifyMutation.isPending,
    handleOtpChange, handleSubmit,
  }
}