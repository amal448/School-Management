import { useNavigate }       from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { BookOpen, ChevronRight, Clock } from 'lucide-react'
import { useMyPendingMarks } from '@/hooks/exam/useExams'
import { useExams }          from '@/hooks/exam/useExams'
import { useSubjects }       from '@/hooks/subject/useSubjects'
import { useClasses }        from '@/hooks/class/useClasses'
import { ExamScheduleResponse } from '@/types/exam.types'

const ScheduleCard = ({ schedule }: { schedule: ExamScheduleResponse }) => {
  const navigate          = useNavigate()
  const { data: exams }   = useExams()
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: classes }  = useClasses()

  const exam    = exams?.data.find((e) => e.id === schedule.examId)
  const subject = subjects?.data.find((s) => s.id === schedule.subjectId)
  const cls     = classes?.data.find((c) => c.id === schedule.classId)

  const handleClick = () => {
    navigate(`/teacher/marks/${schedule.id}`, {
      state: {
        examId:      schedule.examId,
        classId:     schedule.classId,
        subjectId:   schedule.subjectId,
        examName:    exam?.examName    ?? 'Exam',
        subjectName: subject?.subjectName ?? '—',
        className:   cls?.grade        ?? '—',
        section:     cls?.section      ?? '—',
        totalMarks:  schedule.totalMarks,
        passingMarks: schedule.passingMarks,
        marksStatus: schedule.marksStatus,
        scheduleId:  schedule.id,
      },
    })
  }

  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-colors"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="size-4 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-medium truncate">
              {subject?.subjectName ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              {exam?.examName} · Grade {cls?.grade}-{cls?.section}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(schedule.examDate).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short',
              })} · {schedule.startTime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs">
            {schedule.totalMarks} marks
          </Badge>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PendingMarksPage() {
  const { data: pending, isLoading } = useMyPendingMarks()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-medium">Pending marks entry</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pending?.length ?? 0} pending submissions
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
      ) : !pending?.length ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
          <BookOpen className="size-8" />
          <p className="text-sm">No pending marks to enter.</p>
          <p className="text-xs">All your marks are submitted.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}
    </div>
  )
}