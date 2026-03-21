import { useMutation, useQuery } from '@tanstack/react-query'
import { subjectApi }            from '@/api/subject.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectQueryParams,
} from '@/types/subject.types'

export const SUBJECTS_KEY = ['subjects'] as const

export const useSubjects = (params?: SubjectQueryParams) => {
  return useQuery({
    queryKey: [...SUBJECTS_KEY, params],
    queryFn:  () => subjectApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: [...SUBJECTS_KEY, id],
    queryFn:  () => subjectApi.getById(id),
    enabled:  !!id,
  })
}

export const useCreateSubject = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateSubjectInput) => subjectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY })
      onSuccess?.()
    },
  })
}

export const useUpdateSubject = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateSubjectInput) => subjectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...SUBJECTS_KEY, id] })
      onSuccess?.()
    },
  })
}

export const useDeleteSubject = () => {
  return useMutation({
    mutationFn: subjectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY })
    },
  })
}