import apiClient from './client'
import { LoginInput, LoginResponse, VerifyOtpInput, VerifyOtpResponse, MeData } from '@/types/auth.types'
import { ApiResponse } from '@/types/api.types'

export const authApi = {

  adminGoogleLogin: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
  },

  login: async (data: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/api/auth/login', data)
    return res.data
  },
  verifyOtp: async (data: VerifyOtpInput): Promise<VerifyOtpResponse> => {
    const res = await apiClient.post<VerifyOtpResponse>('/api/auth/verify-otp', data)
    return res.data
  },

  getMe: async (): Promise<MeData> => {
    const res = await apiClient.get<ApiResponse<MeData>>('/api/auth/me')
    return res.data.data!
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },
  forgotPassword: async (data: { email: string; role: 'MANAGER' | 'TEACHER' }): Promise<void> => {
    await apiClient.post('/api/auth/forgot-password', data)
  },

  resetPassword: async (data: {
    token: string; role: 'MANAGER' | 'TEACHER'; newPassword: string
  }): Promise<void> => {
    await apiClient.post('/api/auth/reset-password', data)
  },
}