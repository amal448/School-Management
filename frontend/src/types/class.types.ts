import { LucideIcon } from 'lucide-react'

export interface SubjectAllocation {
  subjectId: string
  subject?: any
  teacherId?: string
  teacher?: any
}
export interface AddClassForm {
  grade:    string
  section:      string
  academicYear: string
}

export interface ClassResponse {
  id:                 string
  grade:          string
  section:            string
  classTeacherId?:    string
  classTeacher?:      any
  subjectAllocations: SubjectAllocation[]
  createdAt:          string
  updatedAt:          string
}

export interface CreateClassInput {
  grade:           string
  section:             string
  classTeacherId?:     string
  subjectAllocations?: SubjectAllocation[]
}

export interface UpdateClassInput {
  grade?:      string
  section?:        string
  classTeacherId?: string
}

export interface ClassQueryParams {
  grade?: string
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
export interface AddClassForm {
  grade: string
  section:   string
}
export interface AssignSubjectProps {
  classId:     string
  subjectId:   string
  subjectName: string
  currentTeacherId?: string

}
export interface ClassSectionProps {
 selectedClass:   string | undefined   
  selectedSection: string | undefined  
  onClassChange:   (cls: string) => void
  onSectionChange: (sec: string) => void
  classError?:     boolean
  sectionError?:   boolean
}

export interface StatProps {
  label: string
  value: string | number
  icon:  LucideIcon
  onClick?:()=> void
}