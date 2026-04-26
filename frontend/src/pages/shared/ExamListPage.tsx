import { useNavigate }       from 'react-router-dom'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Badge }             from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ChevronRight, GraduationCap } from 'lucide-react'
import { useExams }          from '@/hooks/exam/useExams'
import { useAuthStore }      from '@/store/auth.store'
import { CreateExamDialog }  from '@/components/exam/CreateExamDialog'
import { ExamResponse }      from '@/types/exam.types'
import {
  EXAM_TYPE_LABELS,
} from '@/constants/exam.constants'
import { ExamStatusBadge } from '@/components/exam/ExamStatusBadge'
import { ListSkeleton } from '@/components/shared/Skeletons'



const ExamCard = ({ exam }: { exam: ExamResponse }) => {
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


export default function ExamListPage() {
  const { data, isLoading } = useExams()

  return (
    <PageRoot>
      <PageHeader
        title="Exams"
        description={`${data?.total ?? 0} total exams`}
        actions={<CreateExamDialog />}
      />

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : !data?.data.length ? (
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
      )}
    </PageRoot>
  )
}