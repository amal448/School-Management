import { ExamType, ExamStatus, MarksStatus } from '@/types/enums'

export interface ExamResponse {
  id:                string
  examName:          string
  examType:          ExamType
  academicYear:      string
  startDate:         string
  endDate:           string
  applicableClasses: string[]
  status:            ExamStatus
  createdBy:         string
  createdAt:         string
  updatedAt:         string
}

export interface TimetableEntryResponse {
  id:           string
  examId:       string
  subjectId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface ExamScheduleResponse {
  id:          string
  examId:      string
  timetableId: string
  classId:     string
  subjectId:   string
  teacherId:   string
  marksStatus: MarksStatus
  submittedAt?: string
}

export interface StudentMarkEntry {
  studentId:   string
  marksScored: number
  isAbsent:    boolean
}

export interface MarksResponse {
  id:          string
  examId:      string
  scheduleId:  string
  studentId:   string
  subjectId:   string
  classId:     string
  marksScored: number
  totalMarks:  number
  grade:       string
  isAbsent:    boolean
  gradedBy:    string
  gradedAt:    string
}

export interface CreateExamInput {
  examName:          string
  examType:          ExamType
  academicYear:      string
  startDate:         string
  endDate:           string
  applicableClasses: string[]
}

export interface CreateTimetableEntryInput {
  subjectId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface EnterMarksInput {
  scheduleId: string
  entries:    StudentMarkEntry[]
}

export interface ExamQueryParams {
  status?:       ExamStatus
  academicYear?: string
  classId?:      string
  page?:         number
  limit?:        number
}

export interface PaginatedExams {
  data:       ExamResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}