import { useParams, useNavigate } from 'react-router-dom'
import { Button }                 from '@/components/ui/button'
import { Badge }                  from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Mail, Phone, MapPin,
  Calendar, Users, UserX,
} from 'lucide-react'
import { useStudent }              from '@/hooks/student/useStudents'
import { useStudentResults }       from '@/hooks/exam/useExams'
import { useSubjects }             from '@/hooks/subject/useSubjects'
import { useExams }                from '@/hooks/exam/useExams'
import { useClass }                from '@/hooks/class/useClasses'
import { useAuthStore }            from '@/store/auth.store'
import { Avatar }                  from '@/components/shared/Avatar'
import { ResetStudentPasswordDialog } from '@/components/shared/student/ResetStudentPasswordDialog'

const InfoRow = ({
  icon: Icon, label, value,
}: {
  icon:   React.ElementType
  label:  string
  value?: string | null
}) => (
  <div className="flex items-start gap-3 py-3">
    <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="size-4 text-muted-foreground" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value ?? '—'}</p>
    </div>
  </div>
)

const gradeColor = (grade: string) => {
  if (['A+', 'A'].includes(grade))
    return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
  if (['B+', 'B'].includes(grade))
    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
  if (grade === 'C')
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
  if (grade === 'D')
    return 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
  if (grade === 'AB')
    return 'bg-muted text-muted-foreground'
  return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
}

const Skeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse p-6">
    <div className="h-8 w-32 bg-muted rounded" />
    <div className="h-36 bg-muted rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-xl" />
      ))}
    </div>
    <div className="h-48 bg-muted rounded-xl" />
  </div>
)

export default function TeacherStudentProfilePage() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const { user }  = useAuthStore()

  const teacherId = user?.userId ?? ''

  const { data: student,  isLoading, isError } = useStudent(id ?? '')
  const { data: marks }                        = useStudentResults(id ?? '')
  const { data: subjects }                     = useSubjects({ limit: 100 })
  const { data: exams }                        = useExams()

  // Check if this teacher is class teacher for student's class
  const { data: studentClass } = useClass(student?.classId ?? '')
  const isClassTeacher = studentClass?.classTeacherId === teacherId

  if (isLoading) return <Skeleton />

  if (isError || !student) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <UserX className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Student not found</p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  const resolveSubject = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)?.subjectName ?? '—'

  const resolveExam = (eid: string) =>
    exams?.data.find((e) => e.id === eid)?.examName ?? '—'

  // Group marks by exam
  const marksByExam = (marks ?? []).reduce<Record<string, typeof marks>>(
    (acc, m) => {
      if (!acc[m.examId]) acc[m.examId] = []
      acc[m.examId]!.push(m)
      return acc
    }, {}
  )

  return (
    <div className="p-6 flex flex-col gap-6">

      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      {/* ── Header ── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar name={student.fullName} size="lg" />

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-medium">{student.fullName}</h1>
                {!student.isActive ? (
                  <Badge variant="secondary">Inactive</Badge>
                ) : student.isFirstTime ? (
                  <Badge variant="outline">Pending setup</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Student</p>
              {!isClassTeacher && (
                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-md w-fit">
                  You are viewing as subject teacher — limited access
                </p>
              )}
            </div>

            {/* Password reset — only class teacher or admin/manager */}
            {isClassTeacher && (
              <ResetStudentPasswordDialog
                studentId={student.id}
                studentName={student.fullName}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Contact (class teacher only) ── */}
      {isClassTeacher && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-0 pt-5 px-6">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4 divide-y divide-border">
              <InfoRow icon={Mail}   label="Email"   value={student.email} />
              {/* <InfoRow icon={Phone}  label="Phone"   value={student.phone} /> */}
              <InfoRow icon={MapPin} label="Address" value={student.address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-5 px-6">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4 divide-y divide-border">
              <InfoRow icon={Users}    label="Name"    value={student.guardianName} />
              <InfoRow icon={Phone}    label="Contact" value={student.guardianContact} />
              <InfoRow icon={Calendar} label="Admission" value={
                student.admissionDate
                  ? new Date(student.admissionDate).toLocaleDateString()
                  : undefined
              } />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Academic performance ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-medium">
            Academic performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {!marks?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No exam results yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(marksByExam).map(([examId, examMarks]) => (
                <div key={examId} className="px-6 py-4">
                  <p className="text-sm font-medium mb-3">
                    {resolveExam(examId)}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examMarks!.map((mark) => (
                      <div
                        key={mark.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {resolveSubject(mark.subjectId)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {mark.isAbsent
                              ? 'Absent'
                              : `${mark.marksScored}/${mark.totalMarks}`
                            }
                          </span>
                        </div>
                        <span className={`
                          text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ml-2
                          ${gradeColor(mark.grade)}
                        `}>
                          {mark.grade}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Exam summary */}
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>
                      Total: {examMarks!.reduce((s, m) => s + m.marksScored, 0)}/
                      {examMarks!.reduce((s, m) => s + m.totalMarks, 0)}
                    </span>
                    <span>
                      Passed: {examMarks!.filter((m) => !['F', 'AB'].includes(m.grade)).length}/
                      {examMarks!.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}