export interface DepartmentResponse {
  id:           string
  deptName:     string
  deptHeadId?:  string
  description?: string
  createdAt:    string
  updatedAt:    string
}

export interface CreateDepartmentInput {
  deptName:     string
  deptHeadId?:  string
  description?: string
}

export interface UpdateDepartmentInput {
  deptName?:    string
  deptHeadId?:  string
  description?: string
}

export interface DepartmentQueryParams {
  search?: string
  page?:   number
  limit?:  number
}

export interface PaginatedDepartments {
  data:       DepartmentResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}