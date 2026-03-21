import apiClient from './client'
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentResponse,
  DepartmentQueryParams,
  PaginatedDepartments,
} from '@/types/department.types'
import { ApiResponse } from '@/types/api.types'

export const departmentApi = {

  getAll: async (params?: DepartmentQueryParams): Promise<PaginatedDepartments> => {
    const res = await apiClient.get<ApiResponse<PaginatedDepartments>>(
      '/api/departments', { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<DepartmentResponse> => {
    const res = await apiClient.get<ApiResponse<DepartmentResponse>>(
      `/api/departments/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateDepartmentInput): Promise<DepartmentResponse> => {
    const res = await apiClient.post<ApiResponse<DepartmentResponse>>(
      '/api/departments', data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateDepartmentInput): Promise<DepartmentResponse> => {
    const res = await apiClient.patch<ApiResponse<DepartmentResponse>>(
      `/api/departments/${id}`, data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/departments/${id}`)
  },
}