export interface StudentResponse {
  id:               string
  email:            string
  firstName:        string
  lastName:         string
  fullName:         string
  dob?:             string
  gender?:          string
  address?:         string
  admissionDate?:   string
  guardianName?:    string
  guardianContact?: string
  classId?:         string
  isActive:         boolean
  isVerified:       boolean
  isFirstTime:      boolean
  lastLogin?:       string
  createdBy:        string
  createdAt:        string
}

export interface CreateStudentInput {
  email:            string
  password:         string
  firstName:        string
  lastName:         string
  dob?:             string
  gender?:          string
  address?:         string
  admissionDate?:   string
  guardianName?:    string
  guardianContact?: string
  classId?:         string
}

export interface UpdateStudentInput {
  firstName?:       string
  lastName?:        string
  address?:         string
  dob?:             string
  gender?:          string
  guardianName?:    string
  guardianContact?: string
}

export interface StudentQueryParams {
  classId?:  string
  search?:   string
  isActive?: boolean
  page?:     number
  limit?:    number
}

export interface PaginatedStudents {
  data:       StudentResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}