export interface TopperResponse {
  id:           string
  name:         string
  grade:        string
  department?:  string
  marks:        number       // ← was percentage
  totalMarks:   number       // ← add
  photoUrl?:    string
  academicYear: string
  rank:         number
  isPublished:  boolean
  createdBy:    string
  createdAt:    string
  updatedAt:    string
}

// Grouped response from /api/toppers/public
export type ToppersByGrade = Record<string, TopperResponse[]>

export interface CreateTopperInput {
  name:         string
  grade:        string
  department?:  string
  marks:        number
  totalMarks:   number
  photoUrl?:    string
  academicYear: string
  rank?:         number
  isPublished?: boolean
}

export interface UpdateTopperInput extends Partial<CreateTopperInput> {}
export interface PaginatedToppers {
  data:       TopperResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}