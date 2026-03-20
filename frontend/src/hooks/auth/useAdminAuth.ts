import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore }          from '@/store/auth.store'
import { authApi }               from '@/api/auth.api'
import { queryClient }           from '@/lib/query-client'
import { ROUTES }                from '@/config/routes.config'

export const AUTH_QUERY_KEY = ['auth', 'me'] as const

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn:  async () => {
      const data = await authApi.getMe()
      setUser(data.user)
      return data.user
    },
    retry:    false,
    staleTime: 1000 * 60 * 5,
  })
}

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser)

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.clear()
      clearUser()
      window.location.href = ROUTES.AUTH.ADMIN_MANAGER_LOGIN
    },
  })
}