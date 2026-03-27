import { useNavigate }       from 'react-router-dom'
import { Button }            from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useMyPendingMarks } from '@/hooks/exam/useExams'
import { useExams }          from '@/hooks/exam/useExams'
import { useSubjects }       from '@/hooks/subject/useSubjects'
import { useClasses }        from '@/hooks/class/useClasses'
import { useExamTimetable }  from '@/hooks/exam/useExams'
import { ExamScheduleResponse } from '@/types/exam.types'

const ScheduleCard = ({
  schedule,
}: {
  schedule: ExamScheduleResponse
}) => {
  const navigate           = useNavigate()
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: classes }  = useClasses()
  const { data: exam }     = useExams()

  const subject  = subjects?.data.find((s) => s.id === schedule.subjectId)
  const cls      = classes?.data.find((c) => c.id === schedule.classId)
  const examData = exam?.data.find((e) => e.id === schedule.examId)

  // Get totalMarks from timetable
  const { data: timetable } = useExamTimetable(schedule.examId)
  const entry = timetable?.find((t) => t.id === schedule.timetableId)

  const handleClick = () => {
    navigate(`/teacher/marks/${schedule.id}`, {
      state: {
        examId:      schedule.examId,
        classId:     schedule.classId,
        subjectId:   schedule.subjectId,
        examName:    examData?.examName ?? 'Exam',
        subjectName: subject?.subjectName ?? '—',
        className:   cls?.grade ?? '—',
        section:     cls?.section ?? '—',
        totalMarks:  entry?.totalMarks ?? 100,
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
              {examData?.examName} · Class {cls?.grade}-{cls?.section}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs">
            {entry?.totalMarks ?? 100} marks
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
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      ) : !pending?.length ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
          <BookOpen className="size-8" />
          <p className="text-sm">No pending marks to enter.</p>
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