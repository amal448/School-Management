import { ExamScheduleResponse } from '@/types/exam.types'
import { useNavigate } from 'react-router-dom'
import { useMyClasses } from '@/hooks/teacher/useTeachers'
import { AlertCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge' 


// ── Pending mark card ──────────────────────────────────
export const PendingCard = ({
  schedule,
}: {
  schedule: ExamScheduleResponse
  teacherId: string
}) => {
  const navigate = useNavigate()
  const { data: classes } = useMyClasses()

  const cls = classes?.find((c) => c.id === schedule.classId)
  const examDate = new Date(schedule.examDate)
  const isOverdue = examDate < new Date()

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/40 cursor-pointer transition-colors"
      onClick={() =>
        navigate(`/teacher/marks/${schedule.id}`, {
          state: {
            examId: schedule.examId,
            classId: schedule.classId,
            subjectId: schedule.subjectId,
            // subjectName: subject?.subjectName ?? '—',
            className: cls?.grade ?? '—',
            section: cls?.section ?? '—',
            totalMarks: schedule.totalMarks,
            passingMarks: schedule.passingMarks,
            marksStatus: schedule.marksStatus,
            scheduleId: schedule.id,
          },
        })
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`
          size-8 rounded-lg flex items-center justify-center shrink-0
          ${isOverdue ? 'bg-red-50 dark:bg-red-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}
        `}>
          {isOverdue
            ? <AlertCircle className="size-4 text-red-600" />
            : <Clock className="size-4 text-amber-600" />
          }
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-xs text-muted-foreground">
            {examDate.toLocaleDateString('en-US', {
              day: 'numeric', month: 'short',
            })} · {schedule.totalMarks} marks
          </p>
        </div>
      </div>
      {isOverdue && (
        <Badge
          variant="outline"
          className="text-xs text-red-600 border-red-200 shrink-0 ml-2"
        >
          Overdue
        </Badge>
      )}
    </div>
  )
}
