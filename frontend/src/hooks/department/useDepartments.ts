import { useMutation, useQuery } from '@tanstack/react-query'
import { departmentApi }         from '@/api/department.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentQueryParams,
} from '@/types/department.types'

export const DEPARTMENTS_KEY = ['departments'] as const

export const useDepartments = (params?: DepartmentQueryParams) => {
  return useQuery({
    queryKey: [...DEPARTMENTS_KEY, params],
    queryFn:  () => departmentApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: [...DEPARTMENTS_KEY, id],
    queryFn:  () => departmentApi.getById(id),
    enabled:  !!id,
  })
}

export const useCreateDepartment = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateDepartmentInput) => departmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEY })
      onSuccess?.()
    },
  })
}

export const useUpdateDepartment = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateDepartmentInput) => departmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...DEPARTMENTS_KEY, id] })
      onSuccess?.()
    },
  })
}

export const useDeleteDepartment = () => {
  return useMutation({
    mutationFn: departmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_KEY })
    },
  })
}