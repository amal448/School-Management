import { useState }               from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button }                 from '@/components/ui/button'
import { Input }                  from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { SectionLoader }          from '@/components/shared/Loaders'
import { useStudentsByClass }     from '@/hooks/student/useStudents'
import { useEnterMarks }          from '@/hooks/exam/useExams'
import { StudentMarkEntry }       from '@/types/exam.types'
import { MarksStatus }            from '@/types/enums'

interface PageState {
  examId:       string
  classId:      string
  subjectId:    string
  examName:     string
  subjectName:  string
  className:    string
  section:      string
  totalMarks:   number
  passingMarks: number
  marksStatus:  MarksStatus
  scheduleId:   string
}

export default function MarksEntryPage() {
  const { scheduleId }   = useParams<{ scheduleId: string }>()
  const navigate         = useNavigate()
  const { state }        = useLocation()
  const pageState        = state as PageState | null

  // Per-student marks state: { studentId → { marksScored, isAbsent } }
  const [marks, setMarks] = useState<Record<string, {
    marksScored: number
    isAbsent:    boolean
  }>>({})

  const { data: students, isLoading: studentsLoading } =
    useStudentsByClass(pageState?.classId ?? '')

  const enterMarksMutation = useEnterMarks()

  if (!pageState || !pageState.classId) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="size-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Invalid access. Open from pending marks list.
      </p>
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  )

  const {
    examName, subjectName, className,
    section, totalMarks, marksStatus,
  } = pageState

  const isAlreadySubmitted = marksStatus === MarksStatus.SUBMITTED
    || marksStatus === MarksStatus.LOCKED

  const handleMarkChange = (studentId: string, value: number) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        marksScored: Math.min(value, totalMarks),
        isAbsent:    false,
      },
    }))
  }

  const handleAbsentToggle = (studentId: string, absent: boolean) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { marksScored: 0, isAbsent: absent },
    }))
  }

  const allEntered = (students?.length ?? 0) > 0 &&
    students?.every((s) => marks[s.id] !== undefined)

  const enteredCount = Object.keys(marks).length
  const totalCount   = students?.length ?? 0

  const handleSubmit = () => {
    if (!scheduleId || !students) return

    const entries: StudentMarkEntry[] = students.map((student) => ({
      studentId:   student.id,
      marksScored: marks[student.id]?.isAbsent
        ? 0
        : (marks[student.id]?.marksScored ?? 0),
      isAbsent:    marks[student.id]?.isAbsent ?? false,
    }))

    enterMarksMutation.mutate(
      { scheduleId, entries },
      { onSuccess: () => navigate(-1) },
    )
  }

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
          <h1 className="text-lg font-medium">Enter marks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {examName} · {subjectName} · Grade {className}-{section}
          </p>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Subject',      value: subjectName          },
          { label: 'Class',        value: `${className}-${section}` },
          { label: 'Total marks',  value: totalMarks            },
        ].map(({ label, value }) => (
          <div key={label} className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {isAlreadySubmitted && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 text-sm text-green-700 dark:text-green-400">
          Marks already submitted. Contact admin to make changes.
        </div>
      )}

      {/* ── Marks table ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Student marks</CardTitle>
            <span className="text-xs text-muted-foreground">
              {enteredCount}/{totalCount} entered
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {studentsLoading ? (
            <div className="p-6"><SectionLoader text="Loading students..." /></div>
          ) : !students?.length ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No students in this class.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  {['Student', 'Marks', 'Absent'].map((h, i) => (
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
                {students.map((student) => {
                  const entry    = marks[student.id]
                  const isAbsent = entry?.isAbsent ?? false

                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <Input
                          type="number"
                          min={0}
                          max={totalMarks}
                          disabled={isAbsent || isAlreadySubmitted}
                          value={isAbsent ? '' : (entry?.marksScored ?? '')}
                          onChange={(e) =>
                            handleMarkChange(student.id, Number(e.target.value))
                          }
                          className="w-24 mx-auto text-center h-8 text-sm"
                          placeholder={isAbsent ? 'AB' : `0–${totalMarks}`}
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isAbsent}
                          disabled={isAlreadySubmitted}
                          onChange={(e) =>
                            handleAbsentToggle(student.id, e.target.checked)
                          }
                          className="size-4 cursor-pointer"
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

      {/* ── Sticky submit footer ── */}
      {!isAlreadySubmitted && (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background sticky bottom-4">
          <p className="text-sm text-muted-foreground">
            {allEntered
              ? 'All marks entered — ready to submit'
              : `${totalCount - enteredCount} student${totalCount - enteredCount !== 1 ? 's' : ''} remaining`
            }
          </p>
          <Button
            disabled={!allEntered || enterMarksMutation.isPending}
            onClick={handleSubmit}
          >
            {enterMarksMutation.isPending
              ? 'Submitting...'
              : 'Submit marks'
            }
          </Button>
        </div>
      )}

    </div>
  )
}