import { useState }              from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button }                from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import {
  useExam, useExamTimetable, useExamSchedules,
  usePublishExam, useDeclareExam, useDeleteTimetableEntry,
} from '@/hooks/exam/useExams'
import { useSubjects }             from '@/hooks/subject/useSubjects'
import { useTeachers }             from '@/hooks/teacher/useTeachers'
import { useClasses }              from '@/hooks/class/useClasses'
import { AddTimetableEntryDialog } from '@/components/exam/AddTimetableEntryDialog'
import { ExamScheduleResponse }    from '@/types/exam.types'
import { ExamStatus, MarksStatus } from '@/types/enums'
import {
  EXAM_TYPE_LABELS,
  EXAM_STATUS_LABELS,
  MARKS_STATUS_LABELS,
} from '@/constants/exam.constants'

// ── Confirm action dialog ──────────────────────────────
const ConfirmActionDialog = ({
  label,
  description,
  onConfirm,
  isPending,
  variant = 'default',
}: {
  label:       string
  description: string
  onConfirm:   () => void
  isPending:   boolean
  variant?:    'default' | 'destructive'
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant === 'destructive' ? 'destructive' : 'default'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                disabled={isPending}
                onClick={() => { onConfirm(); setOpen(false) }}
              >
                {isPending ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Marks status icon ──────────────────────────────────
const MarksStatusIcon = ({ status }: { status: MarksStatus }) => {
  if (status === MarksStatus.SUBMITTED || status === MarksStatus.LOCKED) {
    return <CheckCircle2 className="size-4 text-green-600" />
  }
  return <XCircle className="size-4 text-muted-foreground" />
}

// ── Skeleton ───────────────────────────────────────────
const Skeleton = () => (
  <div className="p-6 flex flex-col gap-6 animate-pulse">
    <div className="h-8 w-48 bg-muted rounded" />
    <div className="h-32 bg-muted rounded-xl" />
    <div className="h-64 bg-muted rounded-xl" />
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function ExamDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: exam,      isLoading } = useExam(id ?? '')
  const { data: timetable }            = useExamTimetable(id ?? '')
  const { data: schedules }            = useExamSchedules(id ?? '')
  const { data: subjects }             = useSubjects({ limit: 100 })
  const { data: teachers }             = useTeachers()
  const { data: classes }              = useClasses()

  const publishMutation        = usePublishExam(id ?? '')
  const declareMutation        = useDeclareExam(id ?? '')
  const deleteTimetableMutation = useDeleteTimetableEntry(id ?? '')

  const resolveSubject = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)

  const resolveTeacher = (tid: string) =>
    teachers?.data.find((t) => t.id === tid)

  const resolveClass = (cid: string) =>
    classes?.data.find((c) => c.id === cid)

  if (isLoading) return <Skeleton />
  if (!exam) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Exam not found</p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  const isDraft    = exam.status === ExamStatus.DRAFT
  const isOngoing  = exam.status === ExamStatus.ONGOING
  const isPending  = exam.status === ExamStatus.MARKS_PENDING
  const isDeclared = exam.status === ExamStatus.DECLARED

  // ── Fix 1: proper typed reduce ─────────────────────
  const schedulesByClass = (schedules ?? []).reduce
    <Record<string, ExamScheduleResponse[]>
  >((acc, s) => {
    if (!acc[s.classId]) acc[s.classId] = []
    acc[s.classId].push(s)
    return acc
  }, {})

  const totalSchedules     = schedules?.length ?? 0
  const submittedSchedules = schedules?.filter(
    (s) => s.marksStatus !== MarksStatus.PENDING
  ).length ?? 0

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground mt-0.5"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="w-px h-5 bg-border mt-1" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-medium">{exam.examName}</h1>
              <span className="text-xs text-muted-foreground">
                {EXAM_TYPE_LABELS[exam.examType]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{exam.academicYear}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(exam.startDate).toLocaleDateString()} —{' '}
                {new Date(exam.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className={`
            text-xs font-medium px-2.5 py-1 rounded-md
            ${exam.status === ExamStatus.DRAFT         ? 'bg-muted text-muted-foreground' : ''}
            ${exam.status === ExamStatus.SCHEDULED     ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' : ''}
            ${exam.status === ExamStatus.ONGOING       ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : ''}
            ${exam.status === ExamStatus.MARKS_PENDING ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400' : ''}
            ${exam.status === ExamStatus.DECLARED      ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : ''}
          `}>
            {EXAM_STATUS_LABELS[exam.status]}
          </span>

          {isDraft && (
            <ConfirmActionDialog
              label="Publish exam"
              description="Publishing will generate exam schedules for all selected classes. Timetable cannot be edited after publishing."
              onConfirm={() => publishMutation.mutate()}
              isPending={publishMutation.isPending}
            />
          )}

          {(isPending || isOngoing) && (
            <ConfirmActionDialog
              label="Declare results"
              description="This will declare results for all students. Marks will be locked and visible to students."
              onConfirm={() => declareMutation.mutate()}
              isPending={declareMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Classes',   value: exam.applicableClasses.length },
          { label: 'Subjects',  value: timetable?.length ?? 0        },
          { label: 'Schedules', value: totalSchedules                 },
          { label: 'Submitted', value: `${submittedSchedules}/${totalSchedules}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-secondary rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-medium mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Timetable ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Exam timetable
            </CardTitle>
            {isDraft && <AddTimetableEntryDialog examId={exam.id} />}
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {!timetable?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              {isDraft
                ? 'Add subjects to build the timetable.'
                : 'No timetable entries found.'}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {['Subject', 'Date', 'Time', 'Marks', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`
                        text-xs font-medium text-muted-foreground
                        uppercase tracking-wide px-6 py-3
                        ${i === 4 ? 'text-right' : 'text-left'}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timetable.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-3 text-sm font-medium">
                      {resolveSubject(entry.subjectId)?.subjectName ?? '—'}
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {new Date(entry.examDate).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short',
                      })}
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {entry.startTime} — {entry.endTime}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {entry.passingMarks}/{entry.totalMarks}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {isDraft && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive hover:text-destructive h-7"
                          onClick={() =>
                            deleteTimetableMutation.mutate(entry.id)
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ── Schedule status (after publish) ── */}
      {!isDraft && !!schedules?.length && (
        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Marks entry status
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {submittedSchedules}/{totalSchedules} submitted
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="divide-y divide-border">
              {Object.entries(schedulesByClass).map(
                ([classId, classSchedules]) => {
                  const cls = resolveClass(classId)

                  return (
                    <div key={classId} className="px-6 py-4">
                      {/* ── Fix 2: use className field from ClassResponse ── */}
                      <p className="text-sm font-medium mb-3">
                        Class {cls?.grade ?? '?'}-{cls?.section ?? '?'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* ── Fix 3: typed schedule ── */}
                        {classSchedules.map((schedule: ExamScheduleResponse) => {
                          const subject = resolveSubject(schedule.subjectId)
                          const teacher = resolveTeacher(schedule.teacherId)

                          return (
                            <div
                              key={schedule.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border"
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-medium truncate">
                                  {subject?.subjectName ?? '—'}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {teacher?.fullName ?? 'No teacher'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-xs text-muted-foreground">
                                  {/* ── Fix 4: typed marksStatus ── */}
                                  {MARKS_STATUS_LABELS[schedule.marksStatus as MarksStatus]}
                                </span>
                                <MarksStatusIcon
                                  status={schedule.marksStatus as MarksStatus}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}