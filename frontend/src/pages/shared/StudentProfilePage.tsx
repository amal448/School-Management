import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft, Mail, Phone, MapPin,
  Calendar, Users, UserX, GraduationCap,
  ShieldAlert, UserCheck,
} from 'lucide-react'
import { useStudent, useUpdateStudent, useDeactivateStudent } from '@/hooks/student/useStudents'
import { useStudentResults } from '@/hooks/exam/useExams'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { useExams } from '@/hooks/exam/useExams'
import { useClass } from '@/hooks/class/useClasses'
import { useAuthStore } from '@/store/auth.store'
import { Avatar } from '@/components/shared/Avatar'
import { EditStudentDialog } from '@/components/shared/student/EditStudentDialog'
import { ResetStudentPasswordDialog } from '@/components/shared/student/ResetStudentPasswordDialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProfileSkeleton } from '@/components/shared/Skeletons'
import { InfoRow } from '@/components/shared/InfoRow'
import { gradeColor } from '@/constants/grade.color'



export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: student, isLoading, isError } = useStudent(id ?? '')
  const { data: marks } = useStudentResults(id ?? '')
  const { data: subjects } = useSubjects({ limit: 100 })
  const { data: exams } = useExams()
  const { data: studentClass } = useClass(student?.classId ?? '')

  // Mutations — defined in page, passed to dialogs
  const updateMutation = useUpdateStudent(id ?? '')
  const deactivateMutation = useDeactivateStudent()

  const isAdmin = user?.role === 'ADMIN'
  const isManager = user?.role === 'MANAGER'
  const canEdit = isAdmin || isManager

  const resolveSubject = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)?.subjectName ?? '—'

  const resolveExamName = (eid: string) =>
    exams?.data.find((e) => e.id === eid)?.examName ?? '—'

  const resolveExamType = (eid: string) =>
    exams?.data.find((e) => e.id === eid)?.examType ?? ''

  if (isLoading) return <ProfileSkeleton />

  if (isError || !student) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <UserX className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Student not found</p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  // Group marks by exam
  const marksByExam = (marks ?? []).reduce<Record<string, typeof marks>>(
    (acc, m) => {
      if (!acc[m!.examId]) acc[m!.examId] = []
      acc[m!.examId]!.push(m!)
      return acc
    }, {}
  )

  const handleDeactivate = () => {
    deactivateMutation.mutate(student.id, {
      onSuccess: () => navigate(-1),
    })
  }

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

      {/* ── Header card ── */}
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
              {studentClass && (
                <p className="text-xs text-muted-foreground">
                  Grade {studentClass.grade} — {studentClass.section}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap shrink-0">
              {canEdit && (
                <EditStudentDialog
                  student={student}
                  mutation={updateMutation}
                />
              )}
              <ResetStudentPasswordDialog
                studentId={student.id}
                studentName={student.fullName}
              />
              {isAdmin && student.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                  onClick={handleDeactivate}
                  disabled={deactivateMutation.isPending}
                >
                  <ShieldAlert className="size-4" />
                  {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Info grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow icon={Mail} label="Email" value={student.email} />
            <InfoRow icon={Phone} label="Phone" value={student.guardianContact} />
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
            <InfoRow icon={Users} label="Name" value={student.guardianName} />
            <InfoRow icon={Phone} label="Contact" value={student.guardianContact} />
            <InfoRow icon={Calendar} label="Admission" value={
              student.admissionDate
                ? new Date(student.admissionDate).toLocaleDateString('en-US', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
                : undefined
            } />
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4 divide-y divide-border">
            <InfoRow
              icon={UserCheck}
              label="Verification"
              value={student.isVerified ? 'Verified' : 'Not verified'}
            />
            <InfoRow
              icon={GraduationCap}
              label="Class"
              value={
                studentClass
                  ? `Grade ${studentClass.grade} — ${studentClass.section}`
                  : 'Not assigned'
              }
            />
            <InfoRow
              icon={Calendar}
              label="Created"
              value={new Date(student.createdAt).toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
          </CardContent>
        </Card> */}

      </div>

      {/* ── Academic performance ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Academic performance
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {Object.keys(marksByExam).length} exam{Object.keys(marksByExam).length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {!marks?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No exam results yet.
            </div>
          ) : (
            <Accordion type="single" collapsible className="divide-y divide-border">
              {Object.entries(marksByExam).map(([examId, examMarks]) => {
                const totalScored = examMarks!.reduce(
                  (s, m) => s + (m.isAbsent ? 0 : m.marksScored), 0
                )
                const totalMax = examMarks!.reduce((s, m) => s + m.totalMarks, 0)
                const passCount = examMarks!.filter(
                  (m) => !['F', 'AB'].includes(m.grade)
                ).length
                const pct = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0

                return (
                  <AccordionItem
                    key={examId}
                    value={examId}
                    className="border-none px-6"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-3">
                        {/* Left — exam name + type */}
                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {resolveExamName(examId)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {resolveExamType(examId).replace('_', ' ')}
                          </p>
                        </div>

                        {/* Right — score summary + pass badge */}
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{totalScored}/{totalMax}</p>
                            <p className="text-xs text-muted-foreground">
                              {passCount}/{examMarks!.length} passed
                            </p>
                          </div>
                          <span className={`
                    text-xs font-medium px-2.5 py-0.5 rounded-md
                    ${pct >= 35 ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}
                  `}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-center">Marks</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examMarks!
                            .slice()
                            .sort((a, b) => b.marksScored - a.marksScored)
                            .map((mark) => (
                              <TableRow key={mark.id}>
                                <TableCell className="font-medium">
                                  {resolveSubject(mark.subjectId)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {mark.isAbsent ? '—' : mark.marksScored}
                                </TableCell>
                                <TableCell className="text-center">
                                  {mark.totalMarks}
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className={`
                            text-xs font-medium px-2.5 py-0.5 rounded-md
                            ${gradeColor(mark.grade)}
                          `}>
                                    {mark.grade}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  {mark.isAbsent ? (
                                    <span className="text-xs text-muted-foreground">Absent</span>
                                  ) : ['F'].includes(mark.grade) ? (
                                    <span className="text-xs text-red-600 dark:text-red-400">Fail</span>
                                  ) : (
                                    <span className="text-xs text-green-600 dark:text-green-400">Pass</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>

                      {/* Percentage bar inside accordion */}
                      {totalMax > 0 && (
                        <div className="mt-4 px-1">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                            <span>Overall score</span>
                            <span>{totalScored}/{totalMax} — {pct}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 35 ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

    </div>
  )
}