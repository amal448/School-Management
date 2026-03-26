import { ExamType,ExamStatus,MarksStatus } from "../enums";

export interface CreateExamDto {
  examName:          string
  examType:          ExamType
  academicYear:      string
  startDate:         Date
  endDate:           Date
  applicableClasses: string[]
}

export interface UpdateExamDto {
  examName?:         string
  startDate?:        Date
  endDate?:          Date
  applicableClasses?: string[]
}

export interface ExamResponseDto {
  id:                string
  examName:          string
  examType:          ExamType
  academicYear:      string
  startDate:         Date
  endDate:           Date
  applicableClasses: string[]
  status:            ExamStatus
  createdBy:         string
  createdAt:         Date
  updatedAt:         Date
}

// ── Timetable ─────────────────────────────────────────
export interface CreateTimetableEntryDto {
  examId:       string
  subjectId:    string
  examDate:     Date
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

export interface TimetableEntryResponseDto {
  id:           string
  examId:       string
  subjectId:    string
  examDate:     Date
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
}

// ── Schedule ──────────────────────────────────────────
export interface ExamScheduleResponseDto {
  id:          string
  examId:      string
  timetableId: string
  classId:     string
  subjectId:   string
  teacherId:   string
  marksStatus: MarksStatus
  submittedAt?: Date
}

// ── Marks ─────────────────────────────────────────────
export interface StudentMarkEntryDto {
  studentId:   string
  marksScored: number
  isAbsent:    boolean
}

export interface EnterMarksDto {
  scheduleId: string
  entries:    StudentMarkEntryDto[]
}

export interface MarksResponseDto {
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
  gradedAt:    Date
}

// ── Query ─────────────────────────────────────────────
export interface ExamQueryDto {
  status?:       ExamStatus
  academicYear?: string
  classId?:      string
  page?:         number
  limit?:        number
}