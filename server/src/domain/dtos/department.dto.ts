export interface CreateDepartmentDto {
  deptName:     string
  deptHeadId?:  string
  description?: string
}

export interface UpdateDepartmentDto {
  deptName?:    string
  deptHeadId?:  string
  description?: string
}

export interface DepartmentResponseDto {
  id:           string
  deptName:     string
  deptHeadId?:  string
  description?: string
  createdAt:    Date
  updatedAt:    Date
}

export interface DepartmentQueryDto {
  search?: string
  page?:   number
  limit?:  number
}