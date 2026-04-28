import apiClient from "./client";
import { CreateManagerCustomInput, WhitelistManagerInput, ManagerResponse, PaginatedManagers } from "@/types/manager.types";
import { ApiResponse } from "@/types/api.types";
import { ENDPOINTS } from "@/constants/endpoints";

export const managerApi = {

    getAll: async (params?: {
        page?: number
        limit?: number
        search?: string
        isActive?: boolean
    }): Promise<PaginatedManagers> => {
        const res = await apiClient.get<ApiResponse<PaginatedManagers>>(
            ENDPOINTS.MANAGERS.BASE, { params }
        )
        return res.data.data!
    },

    createCustom: async (
        data: CreateManagerCustomInput
    ): Promise<ManagerResponse> => {
        const res = await apiClient.post<ApiResponse<{ user: ManagerResponse }>>(
            ENDPOINTS.MANAGERS.BASE,
            data
        )
        return res.data.data!.user
    },

    whitelist: async (data: WhitelistManagerInput): Promise<void> => {
        await apiClient.post(ENDPOINTS.MANAGERS.WHITELIST, {
            email: data.email,
            role: 'manager',
        })
    },

    block: async (managerId: string): Promise<void> => {
        await apiClient.patch(ENDPOINTS.MANAGERS.BLOCK(managerId))
    },
    unblock: async (managerId: string): Promise<void> => {
        await apiClient.patch(ENDPOINTS.MANAGERS.UNBLOCK(managerId))
    },
    // Deactivate manager
    deactivate: async (managerId: string): Promise<void> => {
        await apiClient.delete(ENDPOINTS.MANAGERS.BY_ID(managerId))
    },
    // src/api/manager.api.ts

    getById: async (id: string): Promise<ManagerResponse> => {
        const res = await apiClient.get<ApiResponse<ManagerResponse>>(
            ENDPOINTS.MANAGERS.BY_ID(id)
        )
        return res.data.data!
    },

    update: async (
        id: string,
        data: { firstName?: string; lastName?: string; phone?: string },
    ): Promise<ManagerResponse> => {
        const res = await apiClient.patch<ApiResponse<ManagerResponse>>(
            ENDPOINTS.MANAGERS.BY_ID(id),
            data,
        )
        return res.data.data!
    },
}