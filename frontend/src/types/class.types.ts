export interface SubjectAllocation {
  subjectId: string
  teacherId: string
}

export interface ClassResponse {
  id:                 string
  className:          string
  section:            string
  academicYear:       string
  classTeacherId?:    string
  subjectAllocations: SubjectAllocation[]
  createdAt:          string
  updatedAt:          string
}

export interface CreateClassInput {
  className:    string
  section:      string
  academicYear: string
  classTeacherId?: string
}

export interface UpdateClassInput {
  className?:      string
  section?:        string
  academicYear?:   string
  classTeacherId?: string
}

export interface AllocateSubjectInput {
  subjectId: string
  teacherId: string
}

export interface ClassQueryParams {
  academicYear?: string
  search?:       string
  page?:         number
  limit?:        number
}

export interface PaginatedClasses {
  data:       ClassResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}