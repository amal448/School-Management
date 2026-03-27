import { useState }              from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button }                from '@/components/ui/button'
import { Input }                 from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useEnterMarks }         from '@/hooks/exam/useExams'
import { useStudentsByClass }    from '@/hooks/student/useStudents'
import { StudentMarkEntry }      from '@/types/exam.types'
import { MarksStatus }           from '@/types/enums'

interface MarksEntryState {
  examId:      string
  classId:     string
  subjectId:   string
  examName:    string
  subjectName: string
  className:   string
  section:     string
  totalMarks:  number
  marksStatus: MarksStatus
  scheduleId:  string
}

export default function MarksEntryPage() {
  const { scheduleId }  = useParams<{ scheduleId: string }>()
  const navigate        = useNavigate()
  const location        = useLocation()

  // ── Fix: use useLocation instead of history.state ──
  const state = location.state as MarksEntryState | null

  const {
    examId,
    classId,
    examName,
    subjectName,
    className,
    section,
    totalMarks,
    marksStatus,
  } = state ?? {}

  const { data: students }  = useStudentsByClass(classId ?? '')
  const enterMarksMutation  = useEnterMarks()

  const [marks, setMarks] = useState<Record<string, {
    marksScored: number
    isAbsent:    boolean
  }>>({})

  const isAlreadySubmitted = marksStatus === MarksStatus.SUBMITTED
    || marksStatus === MarksStatus.LOCKED

  const handleMarkChange = (studentId: string, value: number) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { marksScored: value, isAbsent: false },
    }))
  }

  const handleAbsentToggle = (studentId: string, absent: boolean) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { marksScored: 0, isAbsent: absent },
    }))
  }

  const handleSubmit = () => {
    if (!scheduleId || !students) return

    const entries: StudentMarkEntry[] = students.map((student) => ({
      studentId:   student.id,
      marksScored: marks[student.id]?.isAbsent
        ? 0
        : (marks[student.id]?.marksScored ?? 0),
      isAbsent: marks[student.id]?.isAbsent ?? false,
    }))

    enterMarksMutation.mutate(
      { scheduleId, entries },
      { onSuccess: () => navigate(-1) },
    )
  }

  const allEntered = students?.every((s) => marks[s.id] !== undefined)

  if (!classId) return (
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
            {examName} · {subjectName} · Class {className}-{section}
          </p>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Subject',     value: subjectName              },
          { label: 'Class',       value: `${className}-${section}` },
          { label: 'Total marks', value: totalMarks                },
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
            <CardTitle className="text-sm font-medium">
              Student marks
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {Object.keys(marks).length}/{students?.length ?? 0} entered
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
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
              {(students ?? []).map((student) => {
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
                        placeholder={isAbsent ? 'AB' : '0'}
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
        </CardContent>
      </Card>

      {/* ── Submit footer ── */}
      {!isAlreadySubmitted && (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background sticky bottom-4">
          <p className="text-sm text-muted-foreground">
            {allEntered
              ? 'All marks entered — ready to submit'
              : `${(students?.length ?? 0) - Object.keys(marks).length} students remaining`
            }
          </p>
          <Button
            disabled={!allEntered || enterMarksMutation.isPending}
            onClick={handleSubmit}
          >
            {enterMarksMutation.isPending ? 'Submitting...' : 'Submit marks'}
          </Button>
        </div>
      )}

    </div>
  )
}