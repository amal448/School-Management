import apiClient from "./client";
import { CreateManagerCustomInput, WhitelistManagerInput, ManagerResponse, PaginatedManagers } from "@/types/manager.types";
import { ApiResponse } from "@/types/api.types";

export const managerApi = {

    getAll: async (params?: {
        page?: number
        limit?: number
        search?: string
        isActive?: boolean
    }): Promise<PaginatedManagers> => {
        const res = await apiClient.get<ApiResponse<PaginatedManagers>>(
            '/api/managers', { params }
        )
        return res.data.data!
    },

    createCustom: async (
        data: CreateManagerCustomInput
    ): Promise<ManagerResponse> => {
        const res = await apiClient.post<ApiResponse<{ user: ManagerResponse }>>(
            '/api/managers',
            data
        )
        return res.data.data!.user
    },

    whitelist: async (data: WhitelistManagerInput): Promise<void> => {
        await apiClient.post('/api/admins/whitelist', {
            email: data.email,
            role: 'manager',
        })
    },

    block: async (managerId: string): Promise<void> => {
        await apiClient.patch(`/api/admins/managers/${managerId}/block`)
    },
    unblock: async (managerId: string): Promise<void> => {
        await apiClient.patch(`/api/admins/managers/${managerId}/unblock`)
    },
    // Deactivate manager
    deactivate: async (managerId: string): Promise<void> => {
        await apiClient.delete(`/api/managers/${managerId}`)
    },
    // src/api/manager.api.ts

    getById: async (id: string): Promise<ManagerResponse> => {
        const res = await apiClient.get<ApiResponse<ManagerResponse>>(
            `/api/managers/${id}`
        )
        return res.data.data!
    },

    update: async (
        id: string,
        data: { firstName?: string; lastName?: string; phone?: string },
    ): Promise<ManagerResponse> => {
        const res = await apiClient.patch<ApiResponse<ManagerResponse>>(
            `/api/managers/${id}`,
            data,
        )
        return res.data.data!
    },
}