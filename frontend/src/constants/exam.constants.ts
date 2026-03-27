import { ExamType, ExamStatus, MarksStatus } from '@/types/enums'

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  [ExamType.UNIT_TEST]:  'Unit Test',
  [ExamType.MIDTERM]:    'Mid Term',
  [ExamType.QUARTERLY]:  'Quarterly',
  [ExamType.FINAL]:      'Final Exam',
  [ExamType.MOCK]:       'Mock Exam',
}

export const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  [ExamStatus.DRAFT]:         'Draft',
  [ExamStatus.SCHEDULED]:     'Scheduled',
  [ExamStatus.ONGOING]:       'Ongoing',
  [ExamStatus.MARKS_PENDING]: 'Marks Pending',
  [ExamStatus.DECLARED]:      'Declared',
}

export const EXAM_STATUS_VARIANT: Record<ExamStatus, string> = {
  [ExamStatus.DRAFT]:         'secondary',
  [ExamStatus.SCHEDULED]:     'outline',
  [ExamStatus.ONGOING]:       'default',
  [ExamStatus.MARKS_PENDING]: 'warning',
  [ExamStatus.DECLARED]:      'success',
}

export const MARKS_STATUS_LABELS: Record<MarksStatus, string> = {
  [MarksStatus.PENDING]:   'Pending',
  [MarksStatus.SUBMITTED]: 'Submitted',
  [MarksStatus.LOCKED]:    'Locked',
}

export const CURRENT_ACADEMIC_YEAR = (() => {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1   // June is month 6 — new academic year
  return month >= 6
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`
})()

export const ACADEMIC_YEAR_OPTIONS = [
  `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`,
  `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  `${new Date().getFullYear() + 1}-${new Date().getFullYear() + 2}`,
]