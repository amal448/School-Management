
export interface CreateManagerDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateManagerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ManagerQueryDto {
  isActive?: boolean
  isBlocked?: boolean
  search?: string
  page?: number
  limit?: number
}
export interface ManagerResponseDto {
  id:             string
  email:          string
  role:           'MANAGER'
  firstName:      string
  lastName:       string
  fullName:       string
  phone?:         string
  isActive:       boolean
  isVerified:     boolean
  isFirstTime:    boolean
  isBlocked:      boolean
  blockedBy?:     string
  blockedAt?:     Date
  lastLogin?:     Date
  createdByAdmin: string
  createdAt:      Date
}
export interface PaginatedManagersDto {
  data: ManagerResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}