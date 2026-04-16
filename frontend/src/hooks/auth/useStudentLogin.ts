// src/hooks/auth/useStudentLogin.ts

import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuthStore }  from '@/store/auth.store'
import { authApi }       from '@/api/auth.api'
import { ROLES } from '@/config/routes.config'

export const useStudentLogin = () => {
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  const navigate  = useNavigate()
  const { setUser } = useAuthStore()

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await authApi.login({
        email,
        password,
        role: ROLES.STUDENT,
      })

      // Student gets direct session — no OTP step
      if (!result.otpSent && result.sessionId) {
        // Fetch user profile to populate auth store
        const me = await authApi.getMe()
        setUser(me.user)
        navigate('/student', { replace: true })
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'LOGIN_FAILED'

      if (message.includes('blocked'))     setError('ACCOUNT_BLOCKED')
      else if (message.includes('Invalid')) setError('INVALID_CREDENTIALS')
      else if (message.includes('setup'))  setError('PASSWORD_NOT_SET')
      else                                 setError('LOGIN_FAILED')
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    password,
    showPassword,
    loading,
    error,
    emailPlaceholder:   'student@school.com',
    handleEmailChange:  (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    toggleShowPassword: () => setShowPassword((p) => !p),
    handleCredentialLogin,
  }
}