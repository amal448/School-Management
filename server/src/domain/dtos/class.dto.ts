export interface SubjectAllocationDto {
  subjectId: string
  teacherId: string
}

export interface CreateClassDto {
  className:           string
  section:             string
  classTeacherId?:     string
  subjectAllocations?: SubjectAllocationDto[]
}

export interface UpdateClassDto {
  className?:          string
  section?:            string
  classTeacherId?:     string
  subjectAllocations?: SubjectAllocationDto[]   // ← add this
}

export interface AllocateSubjectDto {
  subjectId: string
  teacherId: string
}

export interface ClassResponseDto {
  id:                  string
  className:           string
  section:             string
 
  classTeacherId?:     string
  subjectAllocations:  SubjectAllocationDto[]
  createdAt:           Date
  updatedAt:           Date
}

export interface ClassQueryDto {

  search?:       string
  page?:         number
  limit?:        number
}