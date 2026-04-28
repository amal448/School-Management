import apiClient from './client'
import { LoginInput, LoginResponse, VerifyOtpInput, VerifyOtpResponse, MeData } from '@/types/auth.types'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const authApi = {

  adminGoogleLogin: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.GOOGLE_LOGIN}`
  },

  login: async (data: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data)
    return res.data
  },
  verifyOtp: async (data: VerifyOtpInput): Promise<VerifyOtpResponse> => {
    const res = await apiClient.post<VerifyOtpResponse>(ENDPOINTS.AUTH.VERIFY_OTP, data)
    return res.data
  },

  getMe: async (): Promise<MeData> => {
    const res = await apiClient.get<ApiResponse<MeData>>(ENDPOINTS.AUTH.ME)
    return res.data.data!
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
  },
  forgotPassword: async (data: { email: string; role: 'MANAGER' | 'TEACHER' }): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  },

  resetPassword: async (data: {
    token: string; role: 'MANAGER' | 'TEACHER'; newPassword: string
  }): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)
  },
}