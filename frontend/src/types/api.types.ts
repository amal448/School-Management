export interface ApiResponse<T = void> {
  success:  boolean
  message?: string
  data?:    T
}

export interface ApiError {
  success:   false
  errorCode: string
  message:   string
}