import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button }              from '@/components/ui/button'
import { Badge }               from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft }           from 'lucide-react'
import { useMarksBySchedule }  from '@/hooks/exam/useExams'
import { useStudentsByClass }  from '@/hooks/student/useStudents'

interface PageState {
  examName:    string
  subjectName: string
  className:   string
  section:     string
  totalMarks:  number
  classId:     string
}

const gradeColor = (grade: string) => {
  if (['A+', 'A'].includes(grade))  return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
  if (['B+', 'B'].includes(grade))  return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
  if (grade === 'C')                return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
  if (grade === 'D')                return 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
  if (grade === 'AB')               return 'bg-muted text-muted-foreground'
  return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
}

export default function TeacherMarksViewPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const navigate       = useNavigate()
  const { state }      = useLocation()
  const pageState      = state as PageState | null

  const { data: marks,    isLoading: marksLoading }    =
    useMarksBySchedule(scheduleId ?? '')
  const { data: students, isLoading: studentsLoading } =
    useStudentsByClass(pageState?.classId ?? '')

  const resolveStudent = (studentId: string) =>
    students?.find((s) => s.id === studentId)

  const isLoading = marksLoading || studentsLoading

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
          <h1 className="text-lg font-medium">Submitted marks</h1>
          {pageState && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {pageState.examName} · {pageState.subjectName} ·
              Grade {pageState.className}-{pageState.section}
            </p>
          )}
        </div>
      </div>

      {/* ── Summary ── */}
      {marks && marks.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total',   value: marks.length },
            { label: 'Passed',  value: marks.filter((m) => !['F','AB'].includes(m.grade)).length },
            { label: 'Failed',  value: marks.filter((m) => m.grade === 'F').length },
            { label: 'Absent',  value: marks.filter((m) => m.isAbsent).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Marks table ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Submitted — read only
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : !marks?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No marks found for this schedule.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {['Student', 'Marks', 'Grade', 'Status'].map((h, i) => (
                    <th
                      key={i}
                      className={`
                        text-xs font-medium text-muted-foreground
                        uppercase tracking-wide px-6 py-3
                        ${i === 0 ? 'text-left' : 'text-center'}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {marks
                  .slice()
                  .sort((a, b) => b.marksScored - a.marksScored)
                  .map((mark, index) => {
                    const student = resolveStudent(mark.studentId)
                    return (
                      <tr key={mark.id}>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-5">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium">
                                {student?.fullName ?? mark.studentId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {student?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          {mark.isAbsent ? (
                            <span className="text-sm text-muted-foreground">AB</span>
                          ) : (
                            <span className="text-sm">
                              {mark.marksScored}/{mark.totalMarks}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`
                            text-xs font-medium px-2 py-0.5 rounded-md
                            ${gradeColor(mark.grade)}
                          `}>
                            {mark.grade}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-xs text-muted-foreground">
                            {mark.isAbsent ? 'Absent' : mark.marksScored >= mark.totalMarks * 0.35 ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}