export interface CreateManagerCustomInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

export interface WhitelistManagerInput {
  email: string
}

export interface ManagerResponse {
  id: string
  email: string
  firstName: string
  lastName: string,
  department: string
  fullName: string
  phone: string
  isActive: boolean
  isVerified: boolean
  isFirstTime: boolean
  isBlocked: boolean
  lastLogin?: string
  createdByAdmin: string
  createdAt: string
}

export interface PaginatedManagers {
  data: ManagerResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}
export interface UpdateManagerInput {
  firstName?: string
  lastName?: string
  phone?: string
}