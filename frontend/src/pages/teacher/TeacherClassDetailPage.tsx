import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, BookOpen, Users, UserX,
  Clock, Star, Lock, CheckCircle2,
} from 'lucide-react'
import { useClass } from '@/hooks/class/useClasses'
import { useStudentsByClass } from '@/hooks/student/useStudents'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { useMyPendingMarks } from '@/hooks/exam/useExams'
import { useExams } from '@/hooks/exam/useExams'
import { useAuthStore } from '@/store/auth.store'
import { DataTable } from '@/components/ui/data-table'
import { studentColumns } from '@/components/shared/columns/student.columns'
import { StatCard } from '@/components/shared/class/StatCard'
import { AddStudentDialog } from '@/components/shared/student/AddStudentDialog'
import { MarksStatus } from '@/types/enums'
import { Skeleton } from '@/components/ui/skeleton'

// ── Subject row ────────────────────────────────────────
const SubjectRow = ({
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

// ── No exam row ────────────────────────────────────────
const NoExamRow = ({ subjectName }: { subjectName: string }) => (
  <div className="flex items-center gap-3 px-6 py-3.5 border-b last:border-b-0 border-border">
    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <BookOpen className="size-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium">{subjectName}</p>
      <p className="text-xs text-muted-foreground">No active exam</p>
    </div>
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function TeacherClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const teacherId = user?.userId ?? ''

  const { data: cls, isLoading, isError } = useClass(id ?? '')
  const { data: students, isLoading: studentsLoading } =
    useStudentsByClass(id ?? '')
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: pendingMarks } = useMyPendingMarks()
  const { data: exams } = useExams()

  if (isLoading) return <Skeleton />

  if (isError || !cls) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <UserX className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Class not found</p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  const isClassTeacher = cls.classTeacherId === teacherId

  // All subjects this teacher handles in this class
  const myAllocations = cls.subjectAllocations.filter(
    (a) => a.teacherId === teacherId
  )
  const mySubjectIds = new Set(myAllocations.map((a) => a.subjectId))

  const resolveSubjectName = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)?.subjectName ?? '—'

  // Pending marks for this class and this teacher's subjects
  const myPendingHere = (pendingMarks ?? []).filter(
    (s) => s.classId === id && mySubjectIds.has(s.subjectId)
  )

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-medium">
                Grade {cls.grade} — {cls.section}
              </h1>
              {isClassTeacher && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Star className="size-3" />
                  Class teacher
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {myAllocations.length} subject{myAllocations.length !== 1 ? 's' : ''} ·{' '}
              {students?.length ?? 0} students
            </p>
          </div>
        </div>

             <div className="flex gap-2 flex-wrap">

        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            navigate(`/teacher/classes/${cls.id}/marks`, {
              state: { grade: cls.grade, section: cls.section },
            })
          }
        >
          <BookOpen className="size-4" />
          Mark management
          {myPendingHere.length > 0 && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700"
            >
              {myPendingHere.length}
            </Badge>
          )}
        </Button>

        {/* Only class teacher can add students */}
        {isClassTeacher && (
          <AddStudentDialog classId={cls.id} />
        )}
             </div>

      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Students"
          value={students?.length ?? 0}
          icon={Users}
        />
        <StatCard
          label="My subjects"
          value={myAllocations.length}
          icon={BookOpen}
        />
      </div>

    

      {/* ── Students ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {isClassTeacher ? 'Students' : 'Students in class'}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {students?.length ?? 0} enrolled
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {studentsLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Loading students...
            </div>
          ) : !students?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No students enrolled yet.
            </div>
          ) : (
            <DataTable
              columns={studentColumns}
              data={students}
              searchKey="fullName"
              searchPlaceholder="Search students..."
            />
          )}
        </CardContent>
      </Card>

    </div>
  )
}