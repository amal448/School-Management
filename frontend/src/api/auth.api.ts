import apiClient       from './client'
import { LoginInput, LoginResponse, MeData } from '@/types/auth.types'
import { ApiResponse } from '@/types/api.types'

export const authApi = {

  adminGoogleLogin: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
  },

  // login: async (data: LoginInput): Promise<LoginResponse> => {
  //   const res = await apiClient.post<LoginResponse>('/api/auth/login', data)
  //   return res.data
  // },

  getMe: async (): Promise<MeData> => {
    const res = await apiClient.get<ApiResponse<MeData>>('/api/auth/me')
    return res.data.data!
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },
}