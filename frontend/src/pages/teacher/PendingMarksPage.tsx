import { useNavigate }        from 'react-router-dom'
import { Card, CardContent }  from '@/components/ui/card'
import { Badge }              from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen, CheckCircle2, Clock,
  AlertCircle, ChevronRight,
} from 'lucide-react'
import { useMyPendingMarks, useMySubmittedMarks } from '@/hooks/exam/useExams'
import { useExams }          from '@/hooks/exam/useExams'
import { useSubjects }       from '@/hooks/subject/useSubjects'
import { useMyClasses }      from '@/hooks/teacher/useTeachers'
import { ExamScheduleResponse } from '@/types/exam.types'
import { ListSkeleton } from '@/components/shared/Skeletons'

const ScheduleRow = ({
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



export default function PendingMarksPage() {
  const { data: pending,   isLoading: pendingLoading }   = useMyPendingMarks()
  const { data: submitted, isLoading: submittedLoading } = useMySubmittedMarks()
  const { data: exams }    = useExams()
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: classes }  = useMyClasses()

  const resolveExamName    = (id: string) =>
    exams?.data.find((e) => e.id === id)?.examName ?? 'Exam'

  const resolveSubjectName = (id: string) =>
    subjects?.data.find((s) => s.id === id)?.subjectName ?? '—'

  const resolveClass = (classId: string) =>
    classes?.find((c) => c.id === classId)

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-medium">Marks</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          All mark entries across your classes
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1 gap-2">
            Pending
            {(pending?.length ?? 0) > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700"
              >
                {pending!.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex-1 gap-2">
            Submitted
            {(submitted?.length ?? 0) > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {submitted!.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Pending ── */}
        <TabsContent value="pending" className="mt-4">
          {pendingLoading ? (
            <ListSkeleton count={3} />
          ) : !pending?.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <CheckCircle2 className="size-8 text-green-600" />
              <div className="text-center">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  All marks submitted
                </p>
                <p className="text-xs mt-0.5">
                  No pending marks across all your classes.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pending
                .sort((a, b) =>
                  new Date(a.examDate).getTime() -
                  new Date(b.examDate).getTime()
                )
                .map((schedule) => {
                  const cls = resolveClass(schedule.classId)
                  return (
                    <ScheduleRow
                      key={schedule.id}
                      schedule={schedule}
                      examName={resolveExamName(schedule.examId)}
                      subjectName={resolveSubjectName(schedule.subjectId)}
                      className={cls?.grade   ?? '—'}
                      section={cls?.section   ?? '—'}
                      isSubmitted={false}
                    />
                  )
                })}
            </div>
          )}
        </TabsContent>

        {/* ── Submitted ── */}
        <TabsContent value="submitted" className="mt-4">
          {submittedLoading ? (
            <ListSkeleton count={3} />
          ) : !submitted?.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <BookOpen className="size-8" />
              <div className="text-center">
                <p className="text-sm font-medium">No submitted marks</p>
                <p className="text-xs mt-0.5">
                  Submitted marks will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {submitted
                .sort((a, b) =>
                  new Date(b.examDate).getTime() -
                  new Date(a.examDate).getTime()
                )
                .map((schedule) => {
                  const cls = resolveClass(schedule.classId)
                  return (
                    <ScheduleRow
                      key={schedule.id}
                      schedule={schedule}
                      examName={resolveExamName(schedule.examId)}
                      subjectName={resolveSubjectName(schedule.subjectId)}
                      className={cls?.grade   ?? '—'}
                      section={cls?.section   ?? '—'}
                      isSubmitted={true}
                    />
                  )
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}