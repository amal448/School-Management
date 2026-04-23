import { ExamStatus } from '@/types/enums'
import { EXAM_STATUS_LABELS, EXAM_STATUS_COLORS } from '@/constants/exam.constants'

export const ExamStatusBadge = ({ status }: { status: ExamStatus }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${EXAM_STATUS_COLORS[status]}`}>
    {EXAM_STATUS_LABELS[status]}
  </span>
)
