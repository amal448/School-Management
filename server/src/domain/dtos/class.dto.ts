export interface SubjectAllocationDto {
  subjectId: string
  subject?: any
  teacherId?: string
  teacher?: any
}

export interface CreateClassDto {
  grade: string
  section: string
  classTeacherId?: string
  subjectAllocations?: SubjectAllocationDto[]
}

export interface UpdateClassDto {
  grade?: string
  section?: string
  classTeacherId?: string
  subjectAllocations?: SubjectAllocationDto[]   // ← add this
}

export interface AllocateSubjectDto {
  subjectId: string
  teacherId: string
}

export interface ClassResponseDto {
  id: string
  grade: string
  section: string
  classTeacherId?: string
  classTeacher?: any
  subjectAllocations: SubjectAllocationDto[]
  createdAt: Date
  updatedAt: Date
}

export interface ClassQueryDto {
  grade?: string
  search?: string
  page?: number
  limit?: number
}