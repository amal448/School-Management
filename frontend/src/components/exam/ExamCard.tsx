import { useNavigate }       from 'react-router-dom'
import { Badge }             from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ChevronRight, GraduationCap } from 'lucide-react'
import { useAuthStore }      from '@/store/auth.store'
import { ExamResponse }      from '@/types/exam.types'
import { EXAM_TYPE_LABELS } from '@/constants/exam.constants'
import { ExamStatusBadge } from '@/components/exam/ExamStatusBadge'

export const ExamCard = ({ exam }: { exam: ExamResponse }) => {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()

  const detailPath = user?.role === 'ADMIN'
    ? `/admin/exams/${exam.id}`
    : `/manager/exams/${exam.id}`

  const grades = exam.gradeConfigs.map((g) => g.grade)
    .sort((a, b) => Number(a) - Number(b))

  const totalSubjects = exam.gradeConfigs.reduce(
    (sum, g) => sum + g.commonSubjects.length, 0
  )

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
              <span className="text-xs text-muted-foreground">
                · {exam.academicYear}
              </span>
            </div>

            <h3 className="font-medium text-base truncate">{exam.examName}</h3>

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {new Date(exam.startDate).toLocaleDateString()} —{' '}
                {new Date(exam.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="size-3.5" />
                {grades.length} grade{grades.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex gap-1 flex-wrap">
              {grades.map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  Grade {g}
                </Badge>
              ))}
            </div>
          </div>

          <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  )
}
