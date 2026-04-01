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

export const EXAM_STATUS_COLORS: Record<ExamStatus, string> = {
  [ExamStatus.DRAFT]:         'bg-muted text-muted-foreground',
  [ExamStatus.SCHEDULED]:     'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  [ExamStatus.ONGOING]:       'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  [ExamStatus.MARKS_PENDING]: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  [ExamStatus.DECLARED]:      'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
}

export const MARKS_STATUS_LABELS: Record<MarksStatus, string> = {
  [MarksStatus.PENDING]:   'Pending',
  [MarksStatus.SUBMITTED]: 'Submitted',
  [MarksStatus.LOCKED]:    'Locked',
}

export const MARKS_STATUS_COLORS: Record<MarksStatus, string> = {
  [MarksStatus.PENDING]:   'text-muted-foreground',
  [MarksStatus.SUBMITTED]: 'text-green-600',
  [MarksStatus.LOCKED]:    'text-blue-600',
}

export const CURRENT_ACADEMIC_YEAR = (() => {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1
  return month >= 6
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`
})()

export const ACADEMIC_YEAR_OPTIONS = (() => {
  const y = new Date().getFullYear()
  return [
    `${y - 1}-${y}`,
    `${y}-${y + 1}`,
    `${y + 1}-${y + 2}`,
  ]
})()