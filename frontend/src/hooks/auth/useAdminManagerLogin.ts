import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { ROUTES } from '@/config/routes.config'
import {
  AdminRoleOption,
  AuthError,
} from '@/constants/auth'

export const useAdminManagerLogin = () => {
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState<AdminRoleOption>('ADMIN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const isAdmin = selectedRole === 'ADMIN'
  const isManager = selectedRole === 'MANAGER'
  const isTeacher = selectedRole === 'TEACHER'

  const currentRoleLabel = isAdmin ? 'Admin' : isManager ? 'Manager' :'Teacher'

  const emailPlaceholder =isAdmin ? 'admin@school.com' :isManager ? 'manager@school.com' : 'teacher@school.com'

  // Admin Google OAuth
  const googleMutation = useMutation({
    mutationFn: async () => { authApi.adminGoogleLogin() },
  })

  // Manager credentials → OTP
  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ email, password, role: selectedRole as 'MANAGER' | 'TEACHER' }),
    onSuccess: () => {
      navigate(ROUTES.AUTH.VERIFY_OTP, {
        state: { email, role: selectedRole },
      })
    },
    onError: (err: any) => {
      const code = err?.response?.data?.errorCode as string
      if (code === 'FORBIDDEN') setError('ACCOUNT_BLOCKED')
      else if (code === 'UNAUTHORIZED' || code === 'NOT_FOUND') setError('INVALID_CREDENTIALS')
      else setError('UNKNOWN')
    },
  })

  const handleRoleChange = (role: AdminRoleOption) => {
    setSelectedRole(role)
    setError(null)
    setEmail('')
    setPassword('')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) setError(null)
  }

  const toggleShowPassword = () => setShowPassword((p) => !p)

  const handleGoogleLogin = () => {
    if (!isAdmin) return
    setError(null)
    googleMutation.mutate()
  }

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isManager && !isTeacher) return
    setError(null)
    loginMutation.mutate()
  }

  return {
    email, password, showPassword, error,
    selectedRole, isAdmin, isManager,
    currentRoleLabel, emailPlaceholder,
    loading: loginMutation.isPending,
    googleLoading: googleMutation.isPending,
    handleRoleChange, handleEmailChange, handlePasswordChange,
    toggleShowPassword, handleCredentialLogin, handleGoogleLogin,
  }
}