import apiClient from './client'
import {
  CreateClassInput,
  UpdateClassInput,
  AllocateSubjectInput,
  ClassResponse,
  ClassQueryParams,
  PaginatedClasses,
} from '@/types/class.types'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'

export const classApi = {

  getAll: async (params?: ClassQueryParams): Promise<PaginatedClasses> => {
    const res = await apiClient.get<ApiResponse<PaginatedClasses>>(
      ENDPOINTS.CLASSES.BASE, { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<ClassResponse> => {
    const res = await apiClient.get<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateClassInput): Promise<ClassResponse> => {
    const res = await apiClient.post<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.BASE, data
    )
    return res.data.data!
  },

  update: async (id: string, data: UpdateClassInput): Promise<ClassResponse> => {
    const res = await apiClient.patch<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.BY_ID(id), data
    )
    return res.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.CLASSES.BY_ID(id))
  },

  allocateSubject: async (
    classId: string,
    data:    AllocateSubjectInput,
  ): Promise<ClassResponse> => {
    const res = await apiClient.post<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.SUBJECTS(classId), data
    )
    return res.data.data!
  },

  removeSubjectAllocation: async (
    classId:   string,
    subjectId: string,
  ): Promise<ClassResponse> => {
    const res = await apiClient.delete<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.SUBJECT_BY_ID(classId, subjectId)
    )
    return res.data.data!
  },
  assignSubjectTeacher:async(
    classId:string,
    subjectId:string,
    teacherId:string
  ):Promise<ClassResponse>=>{
    const res=await apiClient.patch<ApiResponse<ClassResponse>>(
      ENDPOINTS.CLASSES.ASSIGN_SUBJECT_TEACHER(classId, subjectId), {teacherId}
    )
    return res.data.data!
  }
}