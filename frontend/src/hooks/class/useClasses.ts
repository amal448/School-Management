import { useMutation, useQuery } from '@tanstack/react-query'
import { classApi }              from '@/api/class.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateClassInput,
  UpdateClassInput,
  AllocateSubjectInput,
  ClassQueryParams,
} from '@/types/class.types'

export const CLASSES_KEY = ['classes'] as const

export const useClasses = (params?: ClassQueryParams) => {
  return useQuery({
    queryKey: [...CLASSES_KEY, params],
    queryFn:  () => classApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

export const useClass = (id: string) => {
  return useQuery({
    queryKey: [...CLASSES_KEY, id],
    queryFn:  () => classApi.getById(id),
    enabled:  !!id,
  })
}

export const useCreateClass = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateClassInput) => classApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY })
      onSuccess?.()
    },
  })
}

export const useUpdateClass = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateClassInput) => classApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY })
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, id] })
      onSuccess?.()
    },
  })
}

export const useDeleteClass = () => {
  return useMutation({
    mutationFn: classApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY })
    },
  })
}

export const useAllocateSubject = (classId: string) => {
  return useMutation({
    mutationFn: (data: AllocateSubjectInput) =>
      classApi.allocateSubject(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, classId] })
    },
  })
}

export const useRemoveSubjectAllocation = (classId: string) => {
  return useMutation({
    mutationFn: (subjectId: string) =>
      classApi.removeSubjectAllocation(classId, subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CLASSES_KEY, classId] })
    },
  })
}