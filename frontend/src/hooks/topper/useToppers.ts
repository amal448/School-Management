import { useMutation, useQuery } from '@tanstack/react-query'
import { topperApi } from '@/api/topper.api'
import { queryClient } from '@/lib/query-client'
import { CreateTopperInput, ToppersByGrade, UpdateTopperInput } from '@/types/topper.types'

export const TOPPERS_KEY = ['toppers'] as const

export const useToppers = (params?: {
  grade?: string; academicYear?: string; isPublished?: boolean
}) =>
  useQuery({
    queryKey: [...TOPPERS_KEY, params],
    queryFn: () => topperApi.getAll(params),
    staleTime: 1000 * 30,
  })

export const usePublicToppers = () =>
  useQuery<ToppersByGrade>({     // ← explicit generic type
    queryKey:  [...TOPPERS_KEY, 'public'],
    queryFn:   () => topperApi.getPublic(),
    staleTime: 1000 * 60 * 10,
  })

// ← remove usePublicToppersByGrade

export const useCreateTopper = () =>
  useMutation({
    mutationFn: (data: CreateTopperInput) => topperApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPPERS_KEY }),
  })

export const useUpdateTopper = (id: string) =>
  useMutation({
    mutationFn: (data: UpdateTopperInput) => topperApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPPERS_KEY }),
  })

export const usePublishTopper = () =>
  useMutation({
    mutationFn: (id: string) => topperApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPPERS_KEY }),
  })

export const useUnpublishTopper = () =>
  useMutation({
    mutationFn: (id: string) => topperApi.unpublish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPPERS_KEY }),
  })

export const useDeleteTopper = () =>
  useMutation({
    mutationFn: (id: string) => topperApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOPPERS_KEY }),
  })