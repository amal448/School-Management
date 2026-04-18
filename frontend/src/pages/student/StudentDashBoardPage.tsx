import { useAuthStore }       from '@/store/auth.store'
import { useStudentStats }    from '@/hooks/stats/useStats'
import { useStudentResults }  from '@/hooks/exam/useExams'
import { useSubjects }        from '@/hooks/subject/useSubjects'
import { useExams }           from '@/hooks/exam/useExams'
import { useNavigate }        from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button }             from '@/components/ui/button'
import { Avatar }             from '@/components/shared/Avatar'
import { TrendingUp, BookOpen, Award, AlertCircle, ChevronRight } from 'lucide-react'
import { ExamStatus, ExamType } from '@/types/enums'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts'

const GRADE_COLORS: Record<string, string> = {
  'A+': '#4CC97A',
  'A':  '#4C9AC9',
  'B+': '#9AC94C',
  'B':  '#C9C94C',
  'C':  '#C9A84C',
  'D':  '#C97A4C',
  'F':  '#C94C4C',
  'AB': '#888888',
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function StudentDashboard() {
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const studentId   = user?.userId ?? ''

  const { data: stats,   isLoading: statsLoading }   = useStudentStats(studentId)
  const { data: marks }                               = useStudentResults(studentId)
  const { data: subjects }                            = useSubjects({ limit: 100 })
  const { data: exams }                               = useExams()

  const resolveSubject = (id: string) =>
    subjects?.data.find((s) => s.id === id)?.subjectName ?? '—'

  const resolveExam = (id: string) =>
    exams?.data.find((e) => e.id === id)

  // ── Find latest declared final exam ─────────────────
  const latestFinalExam = (exams?.data ?? [])
    .filter((e) =>
      e.status === ExamStatus.DECLARED &&
      e.examType === ExamType.FINAL
    )
    .sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0]

  // Marks for that exam
  const finalExamMarks = (marks ?? []).filter(
    (m) => m.examId === latestFinalExam?.id
  )

  // Grade distribution for pie chart
  const gradeMap = finalExamMarks.reduce<Record<string, number>>(
    (acc, m) => {
      acc[m.grade] = (acc[m.grade] ?? 0) + 1
      return acc
    }, {}
  )

  const pieData = Object.entries(gradeMap)
    .sort(([a], [b]) => {
      const order = ['A+','A','B+','B','C','D','F','AB']
      return order.indexOf(a) - order.indexOf(b)
    })
    .map(([grade, count]) => ({
      name:  grade,
      value: count,
      color: GRADE_COLORS[grade] ?? '#888',
    }))

  // Overall % for latest final exam
  const finalScored = finalExamMarks
    .filter((m) => !m.isAbsent)
    .reduce((s, m) => s + m.marksScored, 0)
  const finalMax    = finalExamMarks
    .filter((m) => !m.isAbsent)
    .reduce((s, m) => s + m.totalMarks, 0)
  const finalPct    = finalMax > 0
    ? Math.round((finalScored / finalMax) * 100)
    : 0

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── Welcome ── */}
      <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-4">
          <Avatar name={user?.email ?? 'S'} size="lg" />
          <div>
            <p className="text-xs text-muted-foreground">{getGreeting()}</p>
            <h1 className="text-lg font-medium">{user?.email}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Student portal</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 shrink-0"
          onClick={() => navigate('/student/results')}
        >
          My results
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Overall %',
            value: statsLoading ? '...' : `${stats?.overall ?? 0}%`,
            icon:  TrendingUp,
          },
          {
            label: 'Exams taken',
            value: statsLoading ? '...' : (stats?.byExam.length ?? 0),
            icon:  BookOpen,
          },
          {
            label: 'Subjects',
            value: statsLoading ? '...' : (stats?.bySubject.length ?? 0),
            icon:  Award,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-secondary rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="size-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className="text-xl font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* ── No results ── */}
      {!statsLoading && !stats?.byExam.length && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border border-border">
          <AlertCircle className="size-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            No exam results yet. Results appear once marks are submitted and declared.
          </p>
        </div>
      )}

      {/* ── Final exam pie chart ── */}
      {latestFinalExam && pieData.length > 0 && (
        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">
                  {latestFinalExam.examName}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Grade distribution · {latestFinalExam.academicYear}
                </p>
              </div>
              <div className={`
                text-sm font-medium px-3 py-1 rounded-lg
                ${finalPct >= 80 ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                : finalPct >= 60 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                : finalPct >= 35 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}
              `}>
                {finalPct}%
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 mt-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* Pie chart */}
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [
                      `${val} subject${val !== 1 ? 's' : ''}`,
                      `Grade ${name}`,
                    ]}
                    contentStyle={{
                      fontSize:     12,
                      borderRadius: 8,
                      border:       '1px solid var(--border)',
                      background:   'var(--background)',
                      color:        'var(--foreground)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend + subject list */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-sm shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-sm font-medium">Grade {name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {value} subject{value !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}

                {/* Subject details */}
                <div className="mt-2 border-t border-border pt-2 flex flex-col gap-1">
                  {finalExamMarks
                    .slice()
                    .sort((a, b) => b.marksScored - a.marksScored)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground truncate flex-1">
                          {resolveSubject(m.subjectId)}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="tabular-nums text-muted-foreground">
                            {m.isAbsent ? '—' : `${m.marksScored}/${m.totalMarks}`}
                          </span>
                          <span className={`
                            px-1.5 py-0.5 rounded text-xs font-medium
                            ${GRADE_COLORS[m.grade]
                              ? ''
                              : 'bg-muted text-muted-foreground'
                            }
                          `}
                            style={{
                              background: `${GRADE_COLORS[m.grade] ?? '#888'}20`,
                              color:      GRADE_COLORS[m.grade] ?? '#888',
                            }}
                          >
                            {m.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Exam history ── */}
      {(stats?.byExam.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-0 pt-5 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Exam history</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1 text-muted-foreground h-7"
                onClick={() => navigate('/student/results')}
              >
                View all <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="divide-y divide-border">
              {stats!.byExam
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 5)
                .map((exam) => {
                  const examData = resolveExam(exam.examId)
                  return (
                    <div
                      key={exam.examId}
                      className="flex items-center justify-between px-6 py-3.5"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {examData?.examName ?? '—'}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {examData?.examType?.replace('_', ' ') ?? ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width:      `${exam.percentage}%`,
                              background: exam.percentage >= 80 ? '#4CC97A'
                                : exam.percentage >= 60 ? '#4C9AC9'
                                : exam.percentage >= 35 ? '#C9A84C'
                                : '#C94C4C',
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium tabular-nums w-10 text-right">
                          {exam.percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}