import { useNavigate }       from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { Button }            from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react'
import { ExamScheduleResponse } from '@/types/exam.types'

export const ScheduleCard = ({
  schedule,
  isSubmitted,
  examName,
  subjectName,
  grade,
  section,
}: {
  schedule:    ExamScheduleResponse
  isSubmitted: boolean
  examName:    string
  subjectName: string
  grade:       string
  section:     string
}) => {
  const navigate  = useNavigate()
  const examDate  = new Date(schedule.examDate)
  const isOverdue = !isSubmitted && examDate < new Date()

  const handleClick = () => {
    const state = {
      examId:       schedule.examId,
      classId:      schedule.classId,
      subjectId:    schedule.subjectId,
      subjectName,
      className:    grade,
      section,
      totalMarks:   schedule.totalMarks,
      passingMarks: schedule.passingMarks,
      marksStatus:  schedule.marksStatus,
      scheduleId:   schedule.id,
      examName,
    }

    if (isSubmitted) {
      navigate(`/teacher/marks/${schedule.id}/view`, { state })
    } else {
      navigate(`/teacher/marks/${schedule.id}`, { state })
    }
  }

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`
              size-10 rounded-xl flex items-center justify-center shrink-0
              ${isSubmitted
                ? 'bg-green-50 dark:bg-green-950/30'
                : isOverdue
                  ? 'bg-red-50 dark:bg-red-950/30'
                  : 'bg-amber-50 dark:bg-amber-950/30'
              }
            `}>
              {isSubmitted
                ? <CheckCircle2 className="size-5 text-green-600" />
                : isOverdue
                  ? <AlertCircle className="size-5 text-red-600" />
                  : <Clock className="size-5 text-amber-600" />
              }
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{subjectName}</p>
                {isOverdue && (
                  <Badge
                    variant="outline"
                    className="text-xs text-red-600 border-red-200 py-0"
                  >
                    Overdue
                  </Badge>
                )}
                {isSubmitted && (
                  <Badge
                    variant="outline"
                    className="text-xs text-green-600 border-green-200 py-0"
                  >
                    Submitted
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {examName} · {examDate.toLocaleDateString('en-US', {
                  day: 'numeric', month: 'short',
                })} · {schedule.startTime}–{schedule.endTime}
              </p>
              <p className="text-xs text-muted-foreground">
                {schedule.totalMarks} marks · Pass: {schedule.passingMarks}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSubmitted ? (
              <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                View
              </Button>
            ) : (
              <Button size="sm" className="text-xs h-7 gap-1">
                Enter marks
                <ChevronRight className="size-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
