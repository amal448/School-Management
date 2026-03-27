import { examApi } from "@/api/exam.api"
import { queryClient } from "@/lib/query-client"
import { CreateExamInput, CreateTimetableEntryInput, EnterMarksInput, ExamQueryParams } from "@/types/exam.types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const EXAMS_KEY = ['exams'] as const

export const useExams = (params?: ExamQueryParams) => {
    return useQuery({
        queryKey: [...EXAMS_KEY, params],
        queryFn: () => examApi.getAll(params),
        staleTime: 1000 * 30
    })
}

export const useExam = (id: string) => {
    return useQuery({
        queryKey: [...EXAMS_KEY, id],
        queryFn: () => examApi.getById(id),
        enabled: !!id
    })
}

export const useCreateExam = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: (data: CreateExamInput) => examApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
            onSuccess?.()
        }
    })
}

export const useExamTimetable = (examId: string) => {
    return useQuery({
        queryKey: [...EXAMS_KEY, examId, 'timetable'],
        queryFn: () => examApi.getTimetable(examId),
        enabled: !!examId
    })
}
//per subject
export const useAddTimetableEntry = (examId: string) => {
    return useMutation({
        mutationFn: (data: CreateTimetableEntryInput) =>
            examApi.addTimetableEntry(examId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...EXAMS_KEY, examId, 'timetable']
            })
        }
    })
}

export const useDeleteTimetableEntry = (examId: string) => {
    return useMutation({
        mutationFn: (entryId: string) =>
            examApi.deleteTimetableEntry(examId, entryId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...EXAMS_KEY, examId, 'timetable'],
            })
        },
    })
}

export const usePublishExam = (examId: string) => {
    return useMutation({
        mutationFn: () => examApi.publish(examId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
            queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
        }
    })
}

export const useDeclareExam = (examId: string) => {
  return useMutation({
    mutationFn: () => examApi.declare(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
      queryClient.invalidateQueries({ queryKey: [...EXAMS_KEY, examId] })
    },
  })
}

export const useExamSchedules = (examId: string) => {
  return useQuery({
    queryKey: [...EXAMS_KEY, examId, 'schedules'],
    queryFn:  () => examApi.getSchedules(examId),
    enabled:  !!examId,
  })
}

export const useEnterMarks = () => {
  return useMutation({
    mutationFn: (data: EnterMarksInput) => examApi.enterMarks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAMS_KEY })
    },
  })
}

export const useMyPendingMarks = () => {
  return useQuery({
    queryKey: [...EXAMS_KEY, 'pending-marks'],
    queryFn:  () => examApi.getMyPendingMarks(),
    staleTime: 1000 * 30,
  })
}

export const useClassResults = (examId: string, classId: string) => {
  return useQuery({
    queryKey: [...EXAMS_KEY, examId, 'results', classId],
    queryFn:  () => examApi.getClassResults(examId, classId),
    enabled:  !!examId && !!classId,
  })
}