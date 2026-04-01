import { ExamType, ExamStatus, MarksStatus } from 'src/domain/enums'

export interface SubjectScheduleDto {
  subjectId: string
  examDate: Date
  startTime: string
  endTime: string
  totalMarks: number
  passingMarks: number
}

export interface SectionLanguageDto extends SubjectScheduleDto {
  classId: string
}

export interface GradeConfigDto {
  grade: string
  commonSubjects: SubjectScheduleDto[]
  sectionLanguages: SectionLanguageDto[]
}

export interface ExamResponseDto {
  id: string
  examName: string
  examType: ExamType
  academicYear: string
  startDate: Date
  endDate: Date
  status: ExamStatus
  gradeConfigs: GradeConfigDto[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// ── Create exam ────────────────────────────────────────
export interface CreateExamDto {
  examName: string
  examType: ExamType
  academicYear: string
  startDate: Date
  endDate: Date
  grades: string[]   // which grades this exam applies to e.g. ["10","12"]
}

// ── Grade subject operations ───────────────────────────
export interface AddCommonSubjectDto {
  grade: string
  subjectId: string
  examDate: Date | string   // ← accept both — convert in use case
  startTime: string
  endTime: string
  totalMarks: number
  passingMarks: number
}

export interface UpdateCommonSubjectDto {
  grade: string
  subjectId: string
  examDate?: Date
  startTime?: string
  endTime?: string
  totalMarks?: number
  passingMarks?: number
}

// ── Section language operations ────────────────────────
export interface AddSectionLanguageDto {
  classId: string
  grade: string
  subjectId: string
  examDate: Date | string   // ← accept both — convert in use case
  startTime: string
  endTime: string
  totalMarks: number
  passingMarks: number
}

// ── Marks ──────────────────────────────────────────────
export interface StudentMarkEntryDto {
  studentId: string
  marksScored: number
  isAbsent: boolean
}

export interface EnterMarksDto {
  scheduleId: string
  entries: StudentMarkEntryDto[]
}

export interface MarksResponseDto {
  id: string
  examId: string
  scheduleId: string
  studentId: string
  subjectId: string
  classId: string
  marksScored: number
  totalMarks: number
  grade: string
  isAbsent: boolean
  gradedBy: string
  gradedAt: Date
}

export interface ExamQueryDto {
  status?: ExamStatus
  academicYear?: string
  page?: number
  limit?: number
}
export interface ExamScheduleResponseDto {
  id: string
  examId: string
  classId: string
  subjectId: string
  teacherId: string
  examDate: Date
  startTime: string
  endTime: string
  totalMarks: number
  passingMarks: number
  marksStatus: MarksStatus
  submittedAt?: Date
}