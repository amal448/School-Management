export interface TeacherResponse {
  id:            string
  email:         string
  firstName:     string
  lastName:      string
  fullName:      string
  dob?:          string
  gender?:       string
  phone?:        string
  address?:      string
  hireDate?:     string
  qualification?: string
  designation?:  string
  deptId?:       string
  isActive:      boolean
  isVerified:    boolean
  isFirstTime:   boolean
  lastLogin?:    string
  createdBy:     string
  createdAt:     string
}

export interface CreateTeacherInput {
  email:          string
  password:       string
  firstName:      string
  lastName:       string
  phone?:         string
  dob?:           string
  gender?:        string
  address?:       string
  hireDate?:      string
  qualification?: string
  designation?:  string
  deptId?:        string
}

export interface UpdateTeacherInput {
  firstName?:     string
  lastName?:      string
  phone?:         string
  address?:       string
  qualification?: string
  designation?:  string
}

export interface TeacherQueryParams {
  page?:     number
  limit?:    number
  search?:   string
  deptId?:   string
  isActive?: boolean
}

export interface PaginatedTeachers {
  data:       TeacherResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}