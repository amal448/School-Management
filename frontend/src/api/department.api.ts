import apiClient from './client'
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentResponse,
  DepartmentQueryParams,
  PaginatedDepartments,
} from '@/types/department.types'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const departmentApi = {

  getAll: async (params?: DepartmentQueryParams): Promise<PaginatedDepartments> => {
    const res = await apiClient.get<ApiResponse<PaginatedDepartments>>(
      ENDPOINTS.DEPARTMENTS.BASE, { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<DepartmentResponse> => {
    const res = await apiClient.get<ApiResponse<DepartmentResponse>>(
      ENDPOINTS.DEPARTMENTS.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateDepartmentInput): Promise<DepartmentResponse> => {
    const res = await apiClient.post<ApiResponse<DepartmentResponse>>(
      ENDPOINTS.DEPARTMENTS.BASE, data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateDepartmentInput): Promise<DepartmentResponse> => {
    const res = await apiClient.patch<ApiResponse<DepartmentResponse>>(
      ENDPOINTS.DEPARTMENTS.BY_ID(id), data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DEPARTMENTS.BY_ID(id))
  },
}