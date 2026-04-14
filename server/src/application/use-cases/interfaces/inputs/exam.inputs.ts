import {
  CreateExamDto,
  AddCommonSubjectDto,
  AddSectionLanguageDto,
  UpdateCommonSubjectDto,
  EnterMarksDto,
} from 'src/domain/dtos/exam.dto'

export interface CreateExamInput {
  dto:       CreateExamDto
  createdBy: string
}

export interface AddCommonSubjectInput {
  examId: string
  dto:    AddCommonSubjectDto
}

export interface UpdateCommonSubjectInput {
  examId: string
  dto:    UpdateCommonSubjectDto
}

export interface RemoveCommonSubjectInput {
  examId:    string
  grade:     string
  subjectId: string
}

export interface AddSectionLanguageInput {
  examId: string
  dto:    AddSectionLanguageDto
}

export interface RemoveSectionLanguageInput {
  examId:  string
  grade:   string
  classId: string
}

export interface PublishExamInput {
  examId: string
}

export interface DeclareExamInput {
  examId: string
}

export interface EnterMarksInput {
  dto:       EnterMarksDto
  teacherId: string
}

export interface GetClassResultsInput {
  examId:  string
  classId: string
}

export interface GetStudentResultsInput {
  studentId: string
}

export interface GetSchedulesByClassInput {
  teacherId: string
  classId:   string
}