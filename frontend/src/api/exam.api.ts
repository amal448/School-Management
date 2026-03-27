import { ExamResponse,TimetableEntryResponse,ExamScheduleResponse, MarksResponse,CreateExamInput,CreateTimetableEntryInput,EnterMarksInput,ExamQueryParams,PaginatedExams, } from '@/types/exam.types'
import apiClient from './client'
import { ApiResponse } from '@/types/api.types'

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

  update: async (id: string, data: Partial<CreateExamInput>): Promise<ExamResponse> => {
    const res = await apiClient.patch<ApiResponse<ExamResponse>>(
      `/api/exams/${id}`, data
    )
    return res.data.data!
  },

  // Timetable
  getTimetable: async (examId: string): Promise<TimetableEntryResponse[]> => {
    const res = await apiClient.get<ApiResponse<TimetableEntryResponse[]>>(
      `/api/exams/${examId}/timetable`
    )
    return res.data.data!
  },

  addTimetableEntry: async (
    examId: string,
    data:   CreateTimetableEntryInput,
  ): Promise<TimetableEntryResponse> => {
    const res = await apiClient.post<ApiResponse<TimetableEntryResponse>>(
      `/api/exams/${examId}/timetable`, data
    )
    return res.data.data!
  },

  deleteTimetableEntry: async (
    examId:  string,
    entryId: string,
  ): Promise<void> => {
    await apiClient.delete(`/api/exams/${examId}/timetable/${entryId}`)
  },

  // Lifecycle
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

  // Schedules
  getSchedules: async (examId: string): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      `/api/exams/${examId}/schedules`
    )
    return res.data.data!
  },

  // Marks
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
    examId:  string,
    classId: string,
  ): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      `/api/exams/${examId}/results/${classId}`
    )
    return res.data.data!
  },
}