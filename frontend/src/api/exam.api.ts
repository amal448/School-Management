import apiClient from './client'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/constants/endpoints'
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
      ENDPOINTS.EXAMS.BASE, { params }
    )
    return res.data.data!
  },

  getById: async (id: string): Promise<ExamResponse> => {
    const res = await apiClient.get<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.BY_ID(id)
    )
    return res.data.data!
  },

  create: async (data: CreateExamInput): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.BASE, data
    )
    return res.data.data!
  },

  update: async (
    id: string,
    data: Partial<Pick<CreateExamInput, 'examName' | 'startDate' | 'endDate'>>,
  ): Promise<ExamResponse> => {
    const res = await apiClient.patch<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.BY_ID(id), data
    )
    return res.data.data!
  },

  // ── Common subjects ───────────────────────────────
  addCommonSubject: async (
    examId: string,
    data: AddCommonSubjectInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.COMMON_SUBJECTS(examId), data
    )
    return res.data.data!
  },

  updateCommonSubject: async (
    examId: string,
    data: AddCommonSubjectInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.patch<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.COMMON_SUBJECTS(examId), data
    )
    return res.data.data!
  },

  removeCommonSubject: async (
    examId: string,
    grade: string,
    subjectId: string,
  ): Promise<ExamResponse> => {
    const res = await apiClient.delete<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.REMOVE_COMMON_SUBJECT(examId, grade, subjectId)
    )
    return res.data.data!
  },

  // ── Section languages ─────────────────────────────
  addSectionLanguage: async (
    examId: string,
    data: AddSectionLanguageInput,
  ): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.SECTION_LANGUAGES(examId), data
    )
    return res.data.data!
  },

  removeSectionLanguage: async (
    examId: string,
    grade: string,
    classId: string,
  ): Promise<ExamResponse> => {
    const res = await apiClient.delete<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.REMOVE_SECTION_LANGUAGE(examId, grade, classId)
    )
    return res.data.data!
  },

  // ── Lifecycle ─────────────────────────────────────
  publish: async (examId: string): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.PUBLISH(examId)
    )
    return res.data.data!
  },

  declare: async (examId: string): Promise<ExamResponse> => {
    const res = await apiClient.post<ApiResponse<ExamResponse>>(
      ENDPOINTS.EXAMS.DECLARE(examId)
    )
    return res.data.data!
  },

  // ── Schedules ─────────────────────────────────────
  getSchedules: async (examId: string): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      ENDPOINTS.EXAMS.SCHEDULES(examId)
    )
    return res.data.data!
  },

  // ── Marks ─────────────────────────────────────────
  enterMarks: async (data: EnterMarksInput): Promise<void> => {
    await apiClient.post(ENDPOINTS.EXAMS.MARKS, data)
  },

  getMarksBySchedule: async (scheduleId: string): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      ENDPOINTS.EXAMS.MARKS_BY_SCHEDULE(scheduleId)
    )
    return res.data.data!
  },

  getMyPendingMarks: async (): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      ENDPOINTS.EXAMS.MY_PENDING_MARKS
    )
    return res.data.data!
  },

  getClassResults: async (
    examId: string,
    classId: string,
  ): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      ENDPOINTS.EXAMS.CLASS_RESULTS(examId, classId)
    )
    return res.data.data!
  },

  // Add to examApi:

  getMySchedulesForClass: async (
    classId: string,
  ): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      ENDPOINTS.EXAMS.MY_SCHEDULES_FOR_CLASS(classId)
    )
    return res.data.data!
  },

  getMySubmittedMarks: async (): Promise<ExamScheduleResponse[]> => {
    const res = await apiClient.get<ApiResponse<ExamScheduleResponse[]>>(
      ENDPOINTS.EXAMS.MY_SUBMITTED_MARKS
    )
    return res.data.data!
  },

  getStudentResults: async (studentId: string): Promise<MarksResponse[]> => {
    const res = await apiClient.get<ApiResponse<MarksResponse[]>>(
      ENDPOINTS.EXAMS.STUDENT_RESULTS(studentId)
    )
    return res.data.data!
  },

}