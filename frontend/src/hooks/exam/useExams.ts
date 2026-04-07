import { useMutation, useQuery } from '@tanstack/react-query'
import { examApi }               from '@/api/exam.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateExamInput,
  AddCommonSubjectInput,
  AddSectionLanguageInput,
  EnterMarksInput,
  ExamQueryParams,
} from '@/types/exam.types'

export const EXAMS_KEY = ['exams'] as const

// ── Queries ───────────────────────────────────────────

export const useExams = (params?: ExamQueryParams) =>
  useQuery({
    queryKey:  [...EXAMS_KEY, params],
    queryFn:   () => examApi.getAll(params),
    staleTime: 1000 * 30,
  })

export const useExam = (id: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, id],
    queryFn:  () => examApi.getById(id),
    enabled:  !!id,
  })

export const useExamSchedules = (examId: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, examId, 'schedules'],
    queryFn:  () => examApi.getSchedules(examId),
    enabled:  !!examId,
  })

export const useMyPendingMarks = () =>
  useQuery({
    queryKey:  [...EXAMS_KEY, 'pending'],
    queryFn:   () => examApi.getMyPendingMarks(),
    staleTime: 1000 * 30,
  })

export const useMarksBySchedule = (scheduleId: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, 'marks', scheduleId],
    queryFn:  () => examApi.getMarksBySchedule(scheduleId),
    enabled:  !!scheduleId,
  })

export const useClassResults = (examId: string, classId: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, examId, 'results', classId],
    queryFn:  () => examApi.getClassResults(examId, classId),
    enabled:  !!examId && !!classId,
  })

// ── Mutations ─────────────────────────────────────────

export const useCreateExam = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (data: CreateExamInput) => examApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
      onSuccess?.()
    },
  })

export const useAddCommonSubject = (examId: string) =>
  useMutation({
    mutationFn: (data: AddCommonSubjectInput) =>
      examApi.addCommonSubject(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const useRemoveCommonSubject = (examId: string) =>
  useMutation({
    mutationFn: ({ grade, subjectId }: { grade: string; subjectId: string }) =>
      examApi.removeCommonSubject(examId, grade, subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const useAddSectionLanguage = (examId: string) =>
  useMutation({
    mutationFn: (data: AddSectionLanguageInput) =>
      examApi.addSectionLanguage(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const useRemoveSectionLanguage = (examId: string) =>
  useMutation({
    mutationFn: ({ grade, classId }: { grade: string; classId: string }) =>
      examApi.removeSectionLanguage(examId, grade, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const usePublishExam = (examId: string) =>
  useMutation({
    mutationFn: () => examApi.publish(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const useDeclareExam = (examId: string) =>
  useMutation({
    mutationFn: () => examApi.declare(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })

export const useEnterMarks = () =>
  useMutation({
    mutationFn: (data: EnterMarksInput) => examApi.enterMarks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
    },
  })

  export const useMySchedulesForClass = (classId: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, 'class-schedules', classId],
    queryFn:  () => examApi.getMySchedulesForClass(classId),
    enabled:  !!classId,
    staleTime: 1000 * 30,
  })

export const useMySubmittedMarks = () =>
  useQuery({
    queryKey:  [...EXAMS_KEY, 'submitted'],
    queryFn:   () => examApi.getMySubmittedMarks(),
    staleTime: 1000 * 30,
  })

export const useStudentResults = (studentId: string) =>
  useQuery({
    queryKey: [...EXAMS_KEY, 'student-results', studentId],
    queryFn:  () => examApi.getStudentResults(studentId),
    enabled:  !!studentId,
    staleTime: 1000 * 60 * 5,
  })