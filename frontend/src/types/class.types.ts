export interface SubjectAllocation {
  subjectId: string
  teacherId: string
}
export interface AddClassForm {
  className:    string
  section:      string
  academicYear: string
}

export interface ClassResponse {
  id:                 string
  className:          string
  section:            string
  classTeacherId?:    string
  subjectAllocations: SubjectAllocation[]
  createdAt:          string
  updatedAt:          string
}

export interface CreateClassInput {
  className:           string
  section:             string
  classTeacherId?:     string
  subjectAllocations?: SubjectAllocation[]
}

export interface UpdateClassInput {
  className?:      string
  section?:        string
  classTeacherId?: string
}

export interface ClassQueryParams {
  search?: string
  page?:   number
  limit?:  number
}
export interface PaginatedClasses {
  data:       ClassResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}