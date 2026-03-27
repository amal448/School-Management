import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, ChevronRight } from 'lucide-react'
import { useExams } from '@/hooks/exam/useExams'
import { useClasses } from '@/hooks/class/useClasses'
import { useAuthStore } from '@/store/auth.store'
import { CreateExamDialog } from '@/components/exam/CreateExamDialog'
import { ExamResponse } from '@/types/exam.types'
import { ExamStatus } from '@/types/enums'
import {
  EXAM_TYPE_LABELS,
  EXAM_STATUS_LABELS,
} from '@/constants/exam.constants'
import { Skeleton } from '@/components/ui/skeleton'

// ── Status badge ───────────────────────────────────────
const ExamStatusBadge = ({ status }: { status: ExamStatus }) => {
  const variantMap: Record<ExamStatus, string> = {
    [ExamStatus.DRAFT]: 'bg-muted text-muted-foreground',
    [ExamStatus.SCHEDULED]: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    [ExamStatus.ONGOING]: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    [ExamStatus.MARKS_PENDING]: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
    [ExamStatus.DECLARED]: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  }
  return (
    <span className={`
      text-xs font-medium px-2 py-0.5 rounded-md
      ${variantMap[status]}
    `}>
      {EXAM_STATUS_LABELS[status]}
    </span>
  )
}

// ── Exam card ──────────────────────────────────────────
const ExamCard = ({ exam }: { exam: ExamResponse }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: classes } = useClasses()

  const detailPath = user?.role === 'ADMIN'
    ? `/admin/exams/${exam.id}`
    : `/manager/exams/${exam.id}`

  const applicableClasses = exam.applicableClasses ?? []
  const classLabels = applicableClasses
    .slice(0, 3)
    .map((classId) => {
      const cls = classes?.data.find((c) => c.id === classId)
      return cls ? `${cls.grade}-${cls.section}` : null
    })
    .filter(Boolean)

  const extraCount = exam.applicableClasses.length - 3

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() => navigate(detailPath)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ExamStatusBadge status={exam.status} />
              <span className="text-xs text-muted-foreground">
                {EXAM_TYPE_LABELS[exam.examType]}
              </span>
            </div>

            <h3 className="font-medium text-base truncate">
              {exam.examName}
            </h3>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {new Date(exam.startDate).toLocaleDateString()} —{' '}
                {new Date(exam.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {exam.applicableClasses.length} classes
              </span>
            </div>

            {/* Class pills */}
            {classLabels.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {classLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{extraCount} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  )
}



// ── Page ──────────────────────────────────────────────
export default function ExamListPage() {
  const { data, isLoading } = useExams()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Exams</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data?.total ?? 0} total exams
          </p>
        </div>
        <CreateExamDialog />
      </div>

      {isLoading ? <Skeleton /> : (
        !data?.data.length ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
            <p className="text-sm">No exams yet.</p>
            <p className="text-xs">Create an exam to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.data.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )
      )}
    </div>
  )
}