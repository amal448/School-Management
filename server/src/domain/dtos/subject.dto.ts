export interface CreateSubjectDto {
  subjectName: string
  deptId:      string
}

export interface UpdateSubjectDto {
  subjectName?: string
  deptId?:      string
}

export interface SubjectResponseDto {
  id:          string
  subjectName: string
  deptId:      string
  createdAt:   Date
  updatedAt:   Date
}

export interface SubjectQueryDto {
  deptId?:  string
  search?:  string
  page?:    number
  limit?:   number
}