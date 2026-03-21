export interface SubjectResponse {
  id:          string
  subjectName: string
  deptId:      string
  createdAt:   string
  updatedAt:   string
}

export interface CreateSubjectInput {
  subjectName: string
  deptId:      string
}

export interface UpdateSubjectInput {
  subjectName?: string
  deptId?:      string
}

export interface SubjectQueryParams {
  deptId?:  string
  search?:  string
  page?:    number
  limit?:   number
}

export interface PaginatedSubjects {
  data:       SubjectResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}