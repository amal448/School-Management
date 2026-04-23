import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Clock, Lock, CheckCircle2 } from 'lucide-react'
import { MarksStatus } from '@/types/enums'

export const SubjectRow = ({
  subjectName,
  examName,
  scheduleId,
  examId,
  classId,
  subjectId,
  grade,
  section,
  totalMarks,
  passingMarks,
  marksStatus,
  isPending,
}: {
  subjectName: string
  examName: string
  scheduleId: string
  examId: string
  classId: string
  subjectId: string
  grade: string
  section: string
  totalMarks: number
  passingMarks: number
  marksStatus: MarksStatus
  isPending: boolean
}) => {
  const navigate = useNavigate()

  const goToMarks = (viewOnly = false) =>
    navigate(
      viewOnly
        ? `/teacher/marks/${scheduleId}/view`
        : `/teacher/marks/${scheduleId}`,
      {
        state: {
          examId, classId, subjectId, subjectName,
          className: grade, section,
          totalMarks, passingMarks, marksStatus, scheduleId, examName,
        },
      }
    )

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-b last:border-b-0 border-border">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`
          size-8 rounded-lg flex items-center justify-center shrink-0
          ${isPending
            ? 'bg-amber-50 dark:bg-amber-950/30'
            : 'bg-green-50 dark:bg-green-950/30'
          }
        `}>
          {isPending
            ? <Clock className="size-4 text-amber-600" />
            : <Lock className="size-4 text-green-600" />
          }
        </div>
        <div>
          <p className="text-sm font-medium">{subjectName}</p>
          <p className="text-xs text-muted-foreground">
            {examName} · {totalMarks} marks
          </p>
        </div>
      </div>

      {isPending ? (
        <Button
          size="sm"
          className="text-xs h-7 gap-1.5"
          onClick={() => goToMarks(false)}
        >
          Enter marks
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 gap-1.5"
          onClick={() => goToMarks(true)}
        >
          <CheckCircle2 className="size-3 text-green-600" />
          View marks
        </Button>
      )}
    </div>
  )
}
