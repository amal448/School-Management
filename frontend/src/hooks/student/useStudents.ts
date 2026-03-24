import { useMutation, useQuery } from '@tanstack/react-query'
import { studentApi }            from '@/api/student.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateStudentInput,
  UpdateStudentInput,
  StudentQueryParams,
} from '@/types/student.types'

export const STUDENTS_KEY = ['students'] as const

export const useStudents = (params?: StudentQueryParams) => {
  return useQuery({
    queryKey: [...STUDENTS_KEY, params],
    queryFn:  () => studentApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: [...STUDENTS_KEY, id],
    queryFn:  () => studentApi.getById(id),
    enabled:  !!id,
  })
}

export const useStudentsByClass = (classId: string) => {
  return useQuery({
    queryKey: [...STUDENTS_KEY, 'class', classId],
    queryFn:  () => studentApi.getByClass(classId),
    enabled:  !!classId,
    staleTime: 1000 * 30,
  })
}

export const useCreateStudent = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateStudentInput) => studentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY })
      onSuccess?.()
    },
  })
}

export const useUpdateStudent = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateStudentInput) => studentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...STUDENTS_KEY, id] })
      onSuccess?.()
    },
  })
}

export const useDeactivateStudent = () => {
  return useMutation({
    mutationFn: studentApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_KEY })
    },
  })
}

