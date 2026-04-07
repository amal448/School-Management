import { useMutation, useQuery } from '@tanstack/react-query'
import { teacherApi }            from '@/api/teacher.api'
import { queryClient }           from '@/lib/query-client'
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  TeacherQueryParams,
} from '@/types/teacher.types'

export const TEACHERS_KEY = ['teachers'] as const
export const MY_CLASSES_KEY = ['teacher', 'me', 'classes'] as const
export const MY_PROFILE_KEY = ['teacher', 'me'] as const

// ── Fetch all teachers ─────────────────────────────────
export const useTeachers = (params?: TeacherQueryParams) => {
  return useQuery({
    queryKey: [...TEACHERS_KEY, params],
    queryFn:  () => teacherApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

// ── Fetch single teacher ───────────────────────────────
export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: [...TEACHERS_KEY, id],
    queryFn:  () => teacherApi.getById(id),
    enabled:  !!id,
  })
}

// ── Create teacher ─────────────────────────────────────
export const useCreateTeacher = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateTeacherInput) => teacherApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_KEY })
      onSuccess?.()
    },
  })
}

// ── Reactivate teacher ─────────────────────────────────
export const useReactivateTeacher = () => {
  return useMutation({
    mutationFn: teacherApi.reactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_KEY })
    },
  })
}
export const useMyProfile = () =>
  useQuery({
    queryKey:  MY_PROFILE_KEY,
    queryFn:   () => teacherApi.getMe(),
    staleTime: 1000 * 60 * 10,   // 10 min — profile rarely changes
    gcTime:    1000 * 60 * 30,
  })

export const useMyClasses = () =>
  useQuery({
    queryKey:  MY_CLASSES_KEY,
    queryFn:   () => teacherApi.getMyClasses(),
    staleTime: 1000 * 60 * 5,    // 5 min
    gcTime:    1000 * 60 * 15,
  })


// ── Update teacher ─────────────────────────────────────
export const useUpdateTeacher = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateTeacherInput) => teacherApi.update(id, data),
    //           ↑ data only — id is baked in via closure
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...TEACHERS_KEY, id] })
      onSuccess?.()
    },
  })
}

// ── Deactivate teacher ─────────────────────────────────
export const useDeactivateTeacher = () => {
  return useMutation({
    mutationFn: teacherApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_KEY })
    },
  })
}

// ── Assign department ──────────────────────────────────
export const useAssignDepartment = () => {
  return useMutation({
    mutationFn: ({ id, deptId }: { id: string; deptId: string }) =>
      teacherApi.assignDepartment(id, deptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHERS_KEY })
    },
  })
}