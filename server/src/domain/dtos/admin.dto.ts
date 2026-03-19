
export interface AdminResponseDto {
  id:          string
  email:       string
  role:        'ADMIN'
  firstName:   string
  lastName:    string
  fullName:    string
  avatar?:     string
  isActive:    boolean
  isVerified:  boolean
  lastLogin?:  Date
  createdAt:   Date
}