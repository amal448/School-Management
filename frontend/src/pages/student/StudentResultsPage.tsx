import { useAuthStore }       from '@/store/auth.store'
import { useStudentResults }  from '@/hooks/exam/useExams'
import { useSubjects }        from '@/hooks/subject/useSubjects'
import { useExams }           from '@/hooks/exam/useExams'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge }              from '@/components/ui/badge'
import {
  Accordion, AccordionContent,
  AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { GraduationCap }      from 'lucide-react'
import { ExamStatus }         from '@/types/enums'
import { gradeColor } from '@/constants/grade.color'

const EXAM_TYPE_LABELS: Record<string, string> = {
  unit_test:  'Unit Test',
  midterm:    'Mid Term',
  quarterly:  'Quarterly',
  final:      'Final Exam',
  mock:       'Mock Exam',
}

export default function StudentResultsPage() {
  const { user }       = useAuthStore()
  const studentId      = user?.userId ?? ''

  const { data: marks,    isLoading: marksLoading }   = useStudentResults(studentId)
  const { data: subjects, isLoading: subjectsLoading } = useSubjects({ limit: 100 })
  const { data: exams,    isLoading: examsLoading }    = useExams()

  const isLoading = marksLoading || subjectsLoading || examsLoading

  const resolveSubject = (sid: string) =>
    subjects?.data.find((s) => s.id === sid)?.subjectName ?? '—'

  const resolveExam = (eid: string) =>
    exams?.data.find((e) => e.id === eid)

  // Only show results for declared exams
  const declaredExamIds = new Set(
    (exams?.data ?? [])
      .filter((e) => e.status === ExamStatus.DECLARED)
      .map((e) => e.id)
  )

  // Group marks by examId — only declared
  const marksByExam = (marks ?? []).reduce<Record<string, typeof marks>>(
    (acc, m) => {
      if (!declaredExamIds.has(m!.examId)) return acc
      if (!acc[m!.examId]) acc[m!.examId] = []
      acc[m!.examId]!.push(m!)
      return acc
    }, {}
  )

  const examEntries = Object.entries(marksByExam)
    .sort(([a], [b]) => {
      const examA = resolveExam(a)
      const examB = resolveExam(b)
      return new Date(examB?.startDate ?? 0).getTime() -
             new Date(examA?.startDate ?? 0).getTime()
    })

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-lg font-medium">My results</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Academic performance across all declared exams
        </p>
      </div>

      {/* ── Summary stats ── */}
      {!isLoading && examEntries.length > 0 && (() => {
        const allDeclaredMarks = examEntries.flatMap(([, m]) => m ?? [])
        const totalScored      = allDeclaredMarks
          .filter((m) => !m.isAbsent)
          .reduce((s, m) => s + m.marksScored, 0)
        const totalMax         = allDeclaredMarks
          .filter((m) => !m.isAbsent)
          .reduce((s, m) => s + m.totalMarks, 0)
        const overall          = totalMax > 0
          ? Math.round((totalScored / totalMax) * 100)
          : 0
        const passCount        = allDeclaredMarks.filter(
          (m) => !['F', 'AB'].includes(m.grade)
        ).length

        return (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Overall %',     value: `${overall}%` },
              { label: 'Exams taken',   value: examEntries.length },
              { label: 'Subjects passed', value: `${passCount}/${allDeclaredMarks.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary rounded-xl p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        )
      })()}

      {/* ── Results accordion ── */}
      <Card>
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Exam results</CardTitle>
            <span className="text-xs text-muted-foreground">
              {examEntries.length} exam{examEntries.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-6 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg" />
              ))}
            </div>
          ) : !examEntries.length ? (
            <div className="px-6 py-12 text-center flex flex-col items-center gap-3">
              <GraduationCap className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No declared results yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Results appear here once your teacher submits marks and admin declares the exam.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="divide-y divide-border">
              {examEntries.map(([examId, examMarks]) => {
                const exam        = resolveExam(examId)
                const totalScored = (examMarks ?? []).reduce(
                  (s, m) => s + (m.isAbsent ? 0 : m.marksScored), 0
                )
                const totalMax    = (examMarks ?? []).reduce(
                  (s, m) => s + m.totalMarks, 0
                )
                const passCount   = (examMarks ?? []).filter(
                  (m) => !['F', 'AB'].includes(m.grade)
                ).length
                const pct         = totalMax > 0
                  ? Math.round((totalScored / totalMax) * 100)
                  : 0

                return (
                  <AccordionItem
                    key={examId}
                    value={examId}
                    className="border-none px-6"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-3">

                        {/* Left — name + type badge */}
                        <div className="text-left flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium">
                              {exam?.examName ?? '—'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                              {EXAM_TYPE_LABELS[exam?.examType ?? ''] ?? exam?.examType ?? ''}
                              {exam?.academicYear && ` · ${exam.academicYear}`}
                            </p>
                          </div>
                        </div>

                        {/* Right — score + % badge */}
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium tabular-nums">
                              {totalScored}/{totalMax}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {passCount}/{(examMarks ?? []).length} passed
                            </p>
                          </div>
                          <span className={`
                            text-xs font-medium px-2.5 py-1 rounded-md
                            ${pct >= 80 ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                            : pct >= 60 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                            : pct >= 35 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}
                          `}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-5">

                      {/* Subject table */}
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
                          {(examMarks ?? [])
                            .slice()
                            .sort((a, b) =>
                              b.marksScored - a.marksScored
                            )
                            .map((mark) => (
                              <TableRow key={mark.id}>
                                <TableCell className="font-medium">
                                  {resolveSubject(mark.subjectId)}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {mark.isAbsent ? '—' : mark.marksScored}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
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
                                    <span className="text-xs text-muted-foreground">
                                      Absent
                                    </span>
                                  ) : mark.grade === 'F' ? (
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                      Fail
                                    </span>
                                  ) : (
                                    <span className="text-xs text-green-600 dark:text-green-400">
                                      Pass
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>

                      {/* Progress bar */}
                      {totalMax > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                            <span>Overall score</span>
                            <span className="tabular-nums">
                              {totalScored}/{totalMax} — {pct}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width:      `${pct}%`,
                                background: pct >= 80 ? '#4CC97A'
                                  : pct >= 60 ? '#4C9AC9'
                                  : pct >= 35 ? '#C9A84C'
                                  : '#C94C4C',
                              }}
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