import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import {
  ExamResponse,
  ExamScheduleResponse,
  MarksResponse,
  CreateExamInput,
  AddCommonSubjectInput,
  AddSectionLanguageInput,
  EnterMarksInput,
  ExamQueryParams,
  PaginatedExams,
} from '@/types/exam.types'

export const examApi = {

  getAll: async (params?: ExamQueryParams): Promise<PaginatedExams> => {
    const res = await apiClient.get<ApiResponse<PaginatedExams>>(
      '/api/exams', { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<ExamResponse> => {
    const res = await apiClient.get<ApiResponse<ExamResponse>>(
      `/api/exams/${id}`
    )
    return res.data.data!
  },

  create: async (data: CreateExamInput): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      '/api/exams', data
    )
    return res.data.data!
  },

  update: async (
    id: string,
    data: Partial<Pick<CreateExamInput, 'examName' | 'startDate' | 'endDate'>>,
  ): Promise<ExamResponse> => {
    const res = await apiClient.patch<ApiResponse<ExamResponse>>(
      `/api/exams/${id}`, data
    )
    return res.data.data!
  },

  // ── Common subjects ───────────────────────────────
  addCommonSubject: async (
    examId: string,
    data: AddCommonSubjectInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/grades/subjects`, data
    )
    return res.data.data!
  },

  updateCommonSubject: async (
    examId: string,
    data: AddCommonSubjectInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.patch<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/grades/subjects`, data
    )
    return res.data.data!
  },

  removeCommonSubject: async (
    examId: string,
    grade: string,
    subjectId: string,
  ): Promise<ExamResponse> => {
    const res = await apiClient.delete<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/grades/${grade}/subjects/${subjectId}`
    )
    return res.data.data!
  },

  // ── Section languages ─────────────────────────────
  addSectionLanguage: async (
    examId: string,
    data: AddSectionLanguageInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/grades/languages`, data
    )
    return res.data.data!
  },

  removeSectionLanguage: async (
    examId: string,
    grade: string,
    classId: string,
  ): Promise<ExamResponse> => {
    const res = await apiClient.delete<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/grades/${grade}/languages/${classId}`
    )
    return res.data.data!
  },

  // ── Lifecycle ─────────────────────────────────────
  publish: async (examId: string): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/publish`
    )
    return res.data.data!
  },

  declare: async (examId: string): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      `/api/exams/${examId}/declare`
    )
    return res.data.data!
  },

  // ── Schedules ─────────────────────────────────────
  getSchedules: async (examId: string): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      `/api/exams/${examId}/schedules`
    )
    return res.data.data!
  },

  // ── Marks ─────────────────────────────────────────
  enterMarks: async (data: EnterMarksInput): Promise<void> => {
    await apiClient.post('/api/exams/marks', data)
  },

  getMarksBySchedule: async (scheduleId: string): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      `/api/exams/schedules/${scheduleId}/marks`
    )
    return res.data.data!
  },

  getMyPendingMarks: async (): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      '/api/exams/pending-marks/me'
    )
    return res.data.data!
  },

  getClassResults: async (
    examId: string,
    classId: string,
  ): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      `/api/exams/${examId}/results/${classId}`
    )
    return res.data.data!
  },

  // Add to examApi:

  getMySchedulesForClass: async (
    classId: string,
  ): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      `/api/exams/class/${classId}/my-schedules`
    )
    return res.data.data!
  },

  getMySubmittedMarks: async (): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      '/api/exams/submitted-marks/me'
    )
    return res.data.data!
  },

  getStudentResults: async (studentId: string): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      `/api/exams/student/${studentId}/results`
    )
    return res.data.data!
  },

}