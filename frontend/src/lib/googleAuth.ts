import { AdminManagerRole, AuthError } from '@/constants/auth'

import { useGoogleLogin } from '@react-oauth/google'

interface UseGoogleOAuthProps {
  selectedRole:   AdminManagerRole
  setError:       (error: AuthError) => void
  setGoogleLoading: (loading: boolean) => void
  onSuccess:      (accessToken: string, role: AdminManagerRole) => void
}

export function useGoogleOAuth({
  selectedRole,
  setError,
  setGoogleLoading,
  onSuccess,
}: UseGoogleOAuthProps) {
  const trigger = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      onSuccess(tokenResponse.access_token, selectedRole)
    },
    onError: () => {
      setError('NOT_WHITELISTED')
      setGoogleLoading(false)
    },
    flow: 'implicit',
  })

  return trigger
}