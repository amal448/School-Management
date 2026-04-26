import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button }                  from '@/components/ui/button'
import { Badge }                   from '@/components/ui/badge'
import { Card, CardContent }       from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft, BookOpen, CheckCircle2,
  Clock, AlertCircle, ChevronRight,
} from 'lucide-react'
import {
  useMySchedulesForClass,
} from '@/hooks/exam/useExams'
import { useExams }                from '@/hooks/exam/useExams'
import { useSubjects }             from '@/hooks/subject/useSubjects'
import { ExamScheduleResponse }    from '@/types/exam.types'
import { MarksStatus } from '@/types/enums'

interface LocationState {
  grade:   string
  section: string
}

// ── Schedule card ──────────────────────────────────────
const ScheduleCard = ({
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

// ── Empty state ────────────────────────────────────────
const EmptyState = ({
  icon: Icon,
  message,
  sub,
}: {
  icon:    React.ElementType
  message: string
  sub:     string
}) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
    <Icon className="size-8" />
    <div className="text-center">
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-0.5">{sub}</p>
    </div>
  </div>
)

import { ListSkeleton } from '@/components/shared/Skeletons'

// ── Page ──────────────────────────────────────────────
export default function ClassMarksPage() {
  const { classId }  = useParams<{ classId: string }>()
  const navigate     = useNavigate()
  const { state }    = useLocation()
  const pageState    = state as LocationState | null

  const { data: schedules, isLoading: pendingLoading } =
    useMySchedulesForClass(classId ?? '')

  const { data: exams }    = useExams()
  const { data: subjects } = useSubjects({ limit: 100 })

  // Split pending vs submitted
  const pending = (schedules ?? []).filter(
    (s) => s.marksStatus === MarksStatus.PENDING
  )
  const submitted = (schedules ?? []).filter(
    (s) =>
      s.marksStatus === MarksStatus.SUBMITTED ||
      s.marksStatus === MarksStatus.LOCKED
  )

  const resolveExamName    = (examId: string) =>
    exams?.data.find((e) => e.id === examId)?.examName ?? 'Exam'

  const resolveSubjectName = (subjectId: string) =>
    subjects?.data.find((s) => s.id === subjectId)?.subjectName ?? '—'

  const grade   = pageState?.grade   ?? '—'
  const section = pageState?.section ?? '—'

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="w-px h-5 bg-border" />
        <div>
          <h1 className="text-lg font-medium">Marks management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grade {grade}-{section}
          </p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
          <p className="text-xs text-amber-700 dark:text-amber-400">Pending</p>
          <p className="text-2xl font-medium text-amber-700 dark:text-amber-300 mt-1">
            {pending.length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
          <p className="text-xs text-green-700 dark:text-green-400">Submitted</p>
          <p className="text-2xl font-medium text-green-700 dark:text-green-300 mt-1">
            {submitted.length}
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1 gap-2">
            Pending
            {pending.length > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700"
              >
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex-1 gap-2">
            Submitted
            {submitted.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {submitted.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Pending tab ── */}
        <TabsContent value="pending" className="mt-4">
          {pendingLoading ? (
            <ListSkeleton count={3} />
          ) : !pending.length ? (
            <EmptyState
              icon={CheckCircle2}
              message="All marks submitted"
              sub="No pending marks for this class."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pending
                .sort((a, b) =>
                  new Date(a.examDate).getTime() -
                  new Date(b.examDate).getTime()
                )
                .map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    isSubmitted={false}
                    examName={resolveExamName(schedule.examId)}
                    subjectName={resolveSubjectName(schedule.subjectId)}
                    grade={grade}
                    section={section}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        {/* ── Submitted tab ── */}
        <TabsContent value="submitted" className="mt-4">
          {pendingLoading ? (
            <ListSkeleton count={3} />
          ) : !submitted.length ? (
            <EmptyState
              icon={BookOpen}
              message="No submitted marks"
              sub="Marks submitted for this class will appear here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {submitted
                .sort((a, b) =>
                  new Date(b.examDate).getTime() -
                  new Date(a.examDate).getTime()
                )
                .map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    isSubmitted={true}
                    examName={resolveExamName(schedule.examId)}
                    subjectName={resolveSubjectName(schedule.subjectId)}
                    grade={grade}
                    section={section}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  )
}