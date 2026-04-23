import { useNavigate }        from 'react-router-dom'
import { Card, CardContent }  from '@/components/ui/card'
import { Badge }              from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { ExamScheduleResponse } from '@/types/exam.types'

export const ScheduleRow = ({
  schedule,
  examName,
  subjectName,
  className,
  section,
  isSubmitted,
}: {
  schedule:    ExamScheduleResponse
  examName:    string
  subjectName: string
  className:   string
  section:     string
  isSubmitted: boolean
}) => {
  const navigate  = useNavigate()
  const examDate  = new Date(schedule.examDate)
  const isOverdue = !isSubmitted && examDate < new Date()

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() =>
        navigate(
          isSubmitted
            ? `/teacher/marks/${schedule.id}/view`
            : `/teacher/marks/${schedule.id}`,
          {
            state: {
              examId:       schedule.examId,
              classId:      schedule.classId,
              subjectId:    schedule.subjectId,
              subjectName,
              className,
              section,
              totalMarks:   schedule.totalMarks,
              passingMarks: schedule.passingMarks,
              marksStatus:  schedule.marksStatus,
              scheduleId:   schedule.id,
              examName,
            },
          }
        )
      }
    >
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`
            size-9 rounded-lg flex items-center justify-center shrink-0
            ${isSubmitted
              ? 'bg-green-50 dark:bg-green-950/30'
              : isOverdue
                ? 'bg-red-50 dark:bg-red-950/30'
                : 'bg-amber-50 dark:bg-amber-950/30'
            }
          `}>
            {isSubmitted
              ? <CheckCircle2 className="size-4 text-green-600" />
              : isOverdue
                ? <AlertCircle className="size-4 text-red-600" />
                : <Clock className="size-4 text-amber-600" />
            }
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-medium truncate">
              {subjectName} · Grade {className}-{section}
            </p>
            <p className="text-xs text-muted-foreground">
              {examName} · {examDate.toLocaleDateString('en-US', {
                day: 'numeric', month: 'short',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOverdue && !isSubmitted && (
            <Badge
              variant="outline"
              className="text-xs text-red-600 border-red-200"
            >
              Overdue
            </Badge>
          )}
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
