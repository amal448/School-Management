import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, CheckCircle2, XCircle,
  AlertCircle, Clock, Trash2,
} from 'lucide-react'
import {
  useExam, useExamSchedules,
  usePublishExam, useDeclareExam,
  useRemoveCommonSubject, useRemoveSectionLanguage,
} from '@/hooks/exam/useExams'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { useTeachers } from '@/hooks/teacher/useTeachers'
import { useClasses } from '@/hooks/class/useClasses'
import { AddSectionLanguageDialog } from '@/components/exam/AddSectionLanguageDialog'
import { ExamStatus, MarksStatus } from '@/types/enums'
import { ExamResponse, GradeConfig } from '@/types/exam.types'
import {
  EXAM_TYPE_LABELS,
  EXAM_STATUS_LABELS,
  EXAM_STATUS_COLORS,
  MARKS_STATUS_LABELS,
  MARKS_STATUS_COLORS,
} from '@/constants/exam.constants'
import { AddCommonSubjectDialog } from '@/components/exam/AddCommonSubjectDialog'
import { Skeleton } from '@/components/ui/skeleton'

// ── Confirm dialog (inline) ────────────────────────────
const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending,
  variant = 'default',
}: {
  trigger: React.ReactNode
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  isPending: boolean
  variant?: 'default' | 'destructive'
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background border border-border rounded-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4 shadow-lg">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant={variant}
                disabled={isPending}
                onClick={() => { onConfirm(); setOpen(false) }}
              >
                {isPending ? 'Processing...' : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Grade config panel ─────────────────────────────────
const GradeConfigPanel = ({
  exam,
  examId,
  gradeConfig,
  isDraft,
  resolveSubject,
  resolveClass,
}: {
  exam: ExamResponse,
  examId: string,
  gradeConfig: GradeConfig
  isDraft: boolean
  resolveSubject: (id: string) => string
  resolveClass: (id: string) => string
}) => {
  const removeSubject = useRemoveCommonSubject(examId)
  const removeLang = useRemoveSectionLanguage(examId)

  return (
    <Card key={gradeConfig.grade}>
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Grade {gradeConfig.grade}
          </CardTitle>
          {isDraft && (
            <div className="flex gap-2">
              <AddCommonSubjectDialog
                exam={exam}
                gradeConfig={gradeConfig}
              />
              <AddSectionLanguageDialog
                exam={exam}
                gradeConfig={gradeConfig}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5 mt-4 flex flex-col gap-4">

        {/* Common subjects */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Common subjects — all sections
          </p>
          {!gradeConfig.commonSubjects.length ? (
            <p className="text-xs text-muted-foreground">
              No subjects added yet.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {['Subject', 'Date', 'Time', 'Marks', ''].map((h, i) => (
                      <th
                        key={i}
                        className={`
                          text-xs font-medium text-muted-foreground
                          uppercase tracking-wide px-4 py-2.5
                          ${i === 4 ? 'text-right' : 'text-left'}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradeConfig.commonSubjects.map((s) => (
                    <tr key={s.subjectId}>
                      <td className="px-4 py-2.5 text-sm font-medium">
                        {resolveSubject(s.subjectId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {new Date(s.examDate).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {s.startTime}–{s.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {s.passingMarks}/{s.totalMarks}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {isDraft && (
                          <ConfirmDialog
                            trigger={
                              <button className="text-destructive hover:text-destructive/80 transition-colors">
                                <Trash2 className="size-3.5" />
                              </button>
                            }
                            title="Remove subject"
                            description={`Remove ${resolveSubject(s.subjectId)} from Grade ${gradeConfig.grade}?`}
                            confirmLabel="Remove"
                            onConfirm={() => removeSubject.mutate({
                              grade: gradeConfig.grade,
                              subjectId: s.subjectId,
                            })}
                            isPending={removeSubject.isPending}
                            variant="destructive"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section languages */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Section languages — additional
          </p>
          {!gradeConfig.sectionLanguages.length ? (
            <p className="text-xs text-muted-foreground">
              No section languages added.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {['Section', 'Language', 'Date', 'Time', ''].map((h, i) => (
                      <th
                        key={i}
                        className={`
                          text-xs font-medium text-muted-foreground
                          uppercase tracking-wide px-4 py-2.5
                          ${i === 4 ? 'text-right' : 'text-left'}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradeConfig.sectionLanguages.map((l) => (
                    <tr key={l.classId}>
                      <td className="px-4 py-2.5 text-sm font-medium">
                        {resolveClass(l.classId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm">
                        {resolveSubject(l.subjectId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {new Date(l.examDate).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {l.startTime}–{l.endTime}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {isDraft && (
                          <ConfirmDialog
                            trigger={
                              <button className="text-destructive hover:text-destructive/80 transition-colors">
                                <Trash2 className="size-3.5" />
                              </button>
                            }
                            title="Remove language"
                            description={`Remove language for ${resolveClass(l.classId)}?`}
                            confirmLabel="Remove"
                            onConfirm={() => removeLang.mutate({
                              grade: gradeConfig.grade,
                              classId: l.classId,
                            })}
                            isPending={removeLang.isPending}
                            variant="destructive"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}



// ── Page ──────────────────────────────────────────────
export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: exam, isLoading } = useExam(id ?? '')
  const { data: schedules } = useExamSchedules(id ?? '')
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: teachers } = useTeachers()
  const { data: classes } = useClasses()

  const publishMutation = usePublishExam(id ?? '')
  const declareMutation = useDeclareExam(id ?? '')

  const resolveSubject = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)?.subjectName ?? '—'

  const resolveTeacher = (tid: string) =>
    teachers?.data.find((t) => t.id === tid)?.fullName ?? '—'

  const resolveClass = (cid: string) => {
    const c = classes?.data.find((c) => c.id === cid)
    return c ? `${c.grade}-${c.section}` : '—'
  }

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

  const isDraft = exam.status === ExamStatus.DRAFT
  const isPending = exam.status === ExamStatus.MARKS_PENDING
  const isOngoing = exam.status === ExamStatus.ONGOING
  const isDeclared = exam.status === ExamStatus.DECLARED

  const totalSchedules = schedules?.length ?? 0
  const submittedSchedules = schedules?.filter(
    (s) => s.marksStatus !== MarksStatus.PENDING
  ).length ?? 0

  // Group schedules by class
  const schedulesByClass = (schedules ?? []).reduce<Record<string, typeof schedules>>(
    (acc, s) => {
      if (!acc[s.classId]) acc[s.classId] = []
      acc[s.classId]!.push(s)
      return acc
    }, {}
  )

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
                <Clock className="size-3" />
                {new Date(exam.startDate).toLocaleDateString()} —{' '}
                {new Date(exam.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className={`
            text-xs font-medium px-2.5 py-1 rounded-md
            ${EXAM_STATUS_COLORS[exam.status]}
          `}>
            {EXAM_STATUS_LABELS[exam.status]}
          </span>

          {isDraft && (
            <ConfirmDialog
              trigger={
                <Button size="sm">Publish exam</Button>
              }
              title="Publish exam"
              description="This will generate exam schedules for all configured grades and sections. The timetable cannot be edited after publishing."
              confirmLabel="Publish"
              onConfirm={() => publishMutation.mutate()}
              isPending={publishMutation.isPending}
            />
          )}

          {(isPending || isOngoing) && (
            <ConfirmDialog
              trigger={
                <Button size="sm">Declare results</Button>
              }
              title="Declare results"
              description={
                submittedSchedules < totalSchedules
                  ? `Warning: ${totalSchedules - submittedSchedules} schedules still have pending marks. Declare anyway?`
                  : 'Declare results for all students. Marks will be locked.'
              }
              confirmLabel="Declare"
              onConfirm={() => declareMutation.mutate()}
              isPending={declareMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Grades', value: exam.gradeConfigs.length },
          { label: 'Schedules', value: totalSchedules },
          { label: 'Submitted', value: submittedSchedules },
          { label: 'Pending', value: totalSchedules - submittedSchedules },
        ].map(({ label, value }) => (
          <div key={label} className="bg-secondary rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-medium mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Grade config panels ── */}
      {exam.gradeConfigs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No grades configured.
          </CardContent>
        </Card>
      ) : (
        exam.gradeConfigs
          .slice()
          .sort((a, b) => Number(a.grade) - Number(b.grade))
          .map((gradeConfig) => (
            <GradeConfigPanel
              key={gradeConfig.grade}
              exam={exam}
              examId={exam.id}
              gradeConfig={gradeConfig}
              isDraft={isDraft}
              resolveSubject={resolveSubject}
              resolveClass={resolveClass}
            />
          ))
      )}

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
              {Object.entries(schedulesByClass).map(([classId, classSchedules]) => (
                <div key={classId} className="px-6 py-4">
                  <p className="text-sm font-medium mb-3">
                    {resolveClass(classId)}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {classSchedules!.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {resolveSubject(schedule.subjectId)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {resolveTeacher(schedule.teacherId)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(schedule.examDate).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'short',
                            })} · {schedule.startTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-xs ${MARKS_STATUS_COLORS[schedule.marksStatus]}`}>
                            {MARKS_STATUS_LABELS[schedule.marksStatus]}
                          </span>
                          {schedule.marksStatus !== MarksStatus.PENDING
                            ? <CheckCircle2 className="size-4 text-green-600" />
                            : <XCircle className="size-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}