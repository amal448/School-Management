import { create }      from 'zustand'
import { authApi }     from '@/api/auth.api'
import { AuthUser }    from '@/types/auth.types'
import { queryClient } from '@/lib/query-client'
import { ROUTES }      from '@/config/routes.config'

interface AuthState {
  user:      AuthUser | null
  isLoading: boolean
  isChecked: boolean
  fetchMe:   () => Promise<void>
  logout:    () => Promise<void>
  setUser:   (user: AuthUser) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  isLoading: false,
  isChecked: false,

  fetchMe: async () => {
    set({ isLoading: true })
    try {
      const data = await authApi.getMe()
      set({ user: data.user, isLoading: false, isChecked: true })
    } catch {
      set({ user: null, isLoading: false, isChecked: true })
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      queryClient.clear()
      set({ user: null, isChecked: true })
      window.location.href = ROUTES.AUTH.ADMIN_MANAGER_LOGIN
    }
  },

  setUser:   (user) => set({ user, isChecked: true }),
  clearUser: ()     => set({ user: null, isChecked: true }),
}))