export interface CreateTopperDto {
  name: string
  grade: string
  department?: string
  marks: number
  totalMarks: number
  rank?: number
  photoUrl?: string
  academicYear: string
  isPublished?: boolean
}

export interface UpdateTopperDto {
  name?: string
  grade?: string
  department?: string
  marks?: number
  totalMarks?: number
  rank?: number
  photoUrl?: string
  academicYear?: string
}

export interface TopperResponseDto {
  id: string
  name: string
  grade: string
  department?: string
  marks: number
  rank?:number
  totalMarks: number
  photoUrl?: string
  academicYear: string
  isPublished: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ToppersByGradeDto {
  [grade: string]: TopperResponseDto[]
}

export interface TopperQueryDto {
  grade?:       string
  academicYear?: string
  isPublished?: boolean
  page?:        number
  limit?:       number
}