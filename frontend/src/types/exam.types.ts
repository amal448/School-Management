import { ExamType, ExamStatus, MarksStatus } from '@/types/enums'

export interface SubjectSchedule {
  subjectId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface SectionLanguage extends SubjectSchedule {
  classId: string
}

export interface GradeConfig {
  grade:            string
  commonSubjects:   SubjectSchedule[]
  sectionLanguages: SectionLanguage[]
}

export interface ExamResponse {
  id:           string
  examName:     string
  examType:     ExamType
  academicYear: string
  startDate:    string
  endDate:      string
  status:       ExamStatus
  gradeConfigs: GradeConfig[]
  createdBy:    string
  createdAt:    string
  updatedAt:    string
}

export interface ExamScheduleResponse {
  id:           string
  examId:       string
  classId:      string
  subjectId:    string
  teacherId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
  marksStatus:  MarksStatus
  submittedAt?: string
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
  examName:     string
  examType:     ExamType
  academicYear: string
  startDate:    string
  endDate:      string
  grades:       string[]
}

export interface AddCommonSubjectInput {
  grade:        string
  subjectId:    string
  examDate:     string 
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface AddSectionLanguageInput {
  grade:        string
  classId:      string
  subjectId:    string
  examDate:     string
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface StudentMarkEntry {
  studentId:   string
  marksScored: number
  isAbsent:    boolean
}

export interface EnterMarksInput {
  scheduleId: string
  entries:    StudentMarkEntry[]
}

export interface ExamQueryParams {
  status?:       ExamStatus
  academicYear?: string
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