// admin-specific operations for manager crud

import { useMutation, useQuery } from "@tanstack/react-query";
import { managerApi } from "@/api/manager.api";
import { queryClient } from "@/lib/query-client";
import { CreateManagerCustomInput, WhitelistManagerInput, UpdateManagerInput } from "@/types/manager.types";

export const MANAGERS_KEY = ['managers'] as const

//Manager By Id
export const useManager = (id: string) => {
  return useQuery({
    queryKey: [...MANAGERS_KEY, id],
    queryFn: () => managerApi.getById(id),
    enabled: !!id,
  })
}
//Get All Manager 
export const useManagers = (params?: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: [...MANAGERS_KEY, params],
    queryFn: () => managerApi.getAll(params),
    staleTime: 1000 * 30,
  })
}
//Create Manager
export const useCreateManagerCustom = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: CreateManagerCustomInput) =>
      managerApi.createCustom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
      onSuccess?.()
    }
  })
}

// Whitelist manager email
export const useWhitelistManager = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: WhitelistManagerInput) =>
      managerApi.whitelist(data),
    onSuccess: () => {
      onSuccess?.()
    },
  })
}

// Block manager
export const useBlockManager = () => {
  return useMutation({
    mutationFn: managerApi.block,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
    },
  })
}

// Unblock manager
export const useUnblockManager = () => {
  return useMutation({
    mutationFn: managerApi.unblock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
    },
  })
}
// Unblock manager
export const useDeleteManager = () => {
  return useMutation({
    mutationFn: managerApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
    },
  })
}

export const useUpdateManager = (id: string, onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: UpdateManagerInput) => managerApi.update(id, data),
    onSuccess: () => {
      // Invalidate both list and single manager queries
      queryClient.invalidateQueries({ queryKey: MANAGERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...MANAGERS_KEY, id] })
      onSuccess?.()
    },
  })
}
