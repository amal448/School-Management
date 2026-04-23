import { UseMutationResult } from "@tanstack/react-query"

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

export interface AddStudentProps {
  classId?: string    // optional — pre-assigns to a class if provided
}
export interface StudentEdItProps {
  student:  StudentResponse
  mutation: UseMutationResult<StudentResponse, Error, UpdateStudentInput>
}

export interface StudentResetProps {
  studentId:   string
  studentName: string
}

export interface ResetFormValues {
  newPassword:     string
  confirmPassword: string
}
