export interface ApiResponse<T = void> {
  success:  boolean
  message?: string
  data?:    T
}

export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface ApiError {
  success:   false
  errorCode: string
  message:   string
}