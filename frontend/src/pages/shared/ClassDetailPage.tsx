import { useParams, useNavigate } from 'react-router-dom'
import { useClass } from '@/hooks/class/useClasses'
import { useTeachers } from '@/hooks/teacher/useTeachers'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, BookOpen, GraduationCap, UserCheck, UserX } from 'lucide-react'
import { getGroupLabel } from '@/constants/class.constants'

// ── Shared components ──────────────────────────────────
import { StatCard } from '@/components/shared/class/StatCard'
import { Avatar } from '@/components/shared/Avatar'
import { AssignSubjectTeacherDialog } from '@/components/shared/class/AssignSubjectTeacherDialog'
import { AssignClassTeacherDialog } from '@/components/shared/class/AssignClassTeacherDialog'
import { EditClassDialog } from '@/components/shared/class/EditClassDialog'
import { DataTable } from '@/components/ui/data-table'
import { studentColumns } from '@/components/shared/columns/student.columns'
import { useStudentsByClass } from '@/hooks/student/useStudents'
import { AddStudentDialog } from '@/components/shared/student/AddStudentDialog'

// ── Skeleton ───────────────────────────────────────────
const Skeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse p-6">
    <div className="h-8 w-48 bg-muted rounded" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-lg" />)}
    </div>
    <div className="h-64 bg-muted rounded-xl" />
    <div className="h-48 bg-muted rounded-xl" />
  </div>
)

// ── Page ──────────────────────────────────────────────
export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: studentsData ,isLoading:studentsLoading } = useStudentsByClass(id ?? '')

  // Update studentCount
  const studentCount = studentsData?.length ?? 0

  const { data: cls, isLoading, isError } = useClass(id ?? '')
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: teachers } = useTeachers()

  const resolveTeacher = (teacherId?: string) =>
    teacherId ? teachers?.data.find((t) => t.id === teacherId) : null

  const resolveSubject = (subjectId: string) =>
    subjects?.data.find((s) => s.id === subjectId)

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

  const classTeacher = resolveTeacher(cls.classTeacherId)

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
            <h1 className="text-lg font-medium">
              Class {cls.className} — {cls.section}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {getGroupLabel(cls.className)} school ·{' '}
              {cls.subjectAllocations.length} subjects
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <EditClassDialog cls={cls} />
      
          <AddStudentDialog
            classId={cls.id} 
          />
          <AssignClassTeacherDialog cls={cls} />
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Students"
          value={studentCount}
          icon={Users}
        />
        <StatCard
          label="Class teacher"
          value={classTeacher?.firstName ?? 'Not assigned'}
          icon={UserCheck}
        />
        <StatCard
          label="Subjects"
          value={cls.subjectAllocations.length}
          icon={BookOpen}
        />
        <StatCard
          label="Avg attendance"
          value="—"
          icon={GraduationCap}
        />
      </div>

      {/* ── Curriculum ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Core curriculum</CardTitle>
            <span className="text-xs text-muted-foreground">
              {cls.subjectAllocations.length} subjects
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {cls.subjectAllocations.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No subjects allocated yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {['Subject', 'Teacher', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`
                        text-xs font-medium text-muted-foreground
                        uppercase tracking-wide px-6 py-3
                        ${i === 2 ? 'text-right' : 'text-left'}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cls.subjectAllocations.map((allocation) => {
                  const subject = resolveSubject(allocation.subjectId)
                  const teacher = resolveTeacher(allocation.teacherId)

                  return (
                    <tr key={allocation.subjectId}>
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium">
                          {subject?.subjectName ?? '—'}
                        </p>
                      </td>
                      <td className="px-6 py-3">
                        {teacher ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={teacher.fullName} size="sm" />
                            <span className="text-sm">{teacher.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <AssignSubjectTeacherDialog
                          classId={cls.id}
                          subjectId={allocation.subjectId}
                          subjectName={subject?.subjectName ?? 'this subject'}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ── Students ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <span className="text-xs text-muted-foreground">
              {studentCount} enrolled
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {studentsLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Loading students...
            </div>
          ) : !studentsData?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No students enrolled yet.
            </div>
          ) : (
            <DataTable
              columns={studentColumns}
              data={studentsData}
              searchKey="fullName"
              searchPlaceholder="Search students..."
            />
          )}
        </CardContent>
      </Card>

    </div>
  )
}
