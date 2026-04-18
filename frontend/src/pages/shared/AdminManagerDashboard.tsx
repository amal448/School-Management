import { useState } from 'react'
import { PageRoot, PageHeader } from '@/components/ui/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, Building2, TrendingUp } from 'lucide-react'
import { useOverviewStats, useGradePerformance } from '@/hooks/stats/useStats'
import { useSubjects } from '@/hooks/subject/useSubjects'
import { useAuthStore } from '@/store/auth.store'
import { EXAM_TYPE_LABELS } from '@/constants/exam.constants'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const GRADE_COLORS: Record<string, string> = {
    '10': '#4C9AC9',
    '12': '#C9A84C',
}

const StatBox = ({
    label, value, icon: Icon, sub,
}: {
    label: string
    value: number | string
    icon: React.ElementType
    sub?: string
}) => (
    <div className="bg-secondary rounded-xl p-5 flex items-start gap-4">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="size-5 text-primary" />
        </div>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-medium mt-0.5">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
    </div>
)

// ── Grade performance chart ────────────────────────────
const GradePerformanceChart = () => {
    const [grade, setGrade] = useState('10')
    const [examType, setExamType] = useState('')

    const { data: subjects } = useSubjects({ limit: 100 })
    const { data: performance, isLoading } = useGradePerformance(
        grade, examType || undefined
    )

    const resolveSubject = (id: string) =>
        subjects?.data.find((s) => s.id === id)?.subjectName ?? id.slice(-6)

    const chartData = (performance?.subjectAverages ?? []).map((s) => ({
        subject: resolveSubject(s.subjectId),
        average: s.average,
    }))

    return (
        <Card>
            <CardHeader className="pb-0 pt-5 px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-sm font-medium">
                            Grade performance
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Subject-wise average across all sections
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-8 rounded-md border border-input bg-background px-3 text-xs"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        >
                            <option value="10">Grade 10</option>
                            <option value="12">Grade 12</option>
                        </select>
                        <select
                            className="h-8 rounded-md border border-input bg-background px-3 text-xs"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="">All exam types</option>
                            {Object.entries(EXAM_TYPE_LABELS).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 mt-6">
                {isLoading ? (
                    <div className="h-64 bg-muted animate-pulse rounded-lg" />
                ) : !chartData.length ? (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <TrendingUp className="size-8" />
                        <p className="text-sm">No declared exams found for this selection.</p>
                        <p className="text-xs">Declare exam results to see performance data.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <div
                                className="size-3 rounded-sm"
                                style={{ background: GRADE_COLORS[grade] ?? '#4C9AC9' }}
                            />
                            <span className="text-xs text-muted-foreground">
                                Average % — Grade {grade}
                                {performance?.examCount
                                    ? ` (${performance.examCount} exam${performance.examCount !== 1 ? 's' : ''})`
                                    : ''
                                }
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="subject"
                                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${v}%`}
                                />
                                <Tooltip
                                    formatter={(val: any) => [`${val}%`, 'Average']}
                                    contentStyle={{
                                        fontSize: 12,
                                        borderRadius: 8,
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                    }}
                                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                />
                                <Bar
                                    dataKey="average"
                                    radius={[4, 4, 0, 0]}
                                >
                                    {chartData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={GRADE_COLORS[grade] ?? '#4C9AC9'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

// ── Dashboard ─────────────────────────────────────────
export default function AdminManagerDashboard() {
    const { data: stats, isLoading } = useOverviewStats()
    const { user } = useAuthStore()

    return (
        <PageRoot>
            <PageHeader
                title="Dashboard"
                description={`Welcome back, ${user?.role || 'Admin'}. Here's an overview.`}
            />

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatBox
                    label="Total teachers"
                    value={isLoading ? '...' : (stats?.totalTeachers ?? 0)}
                    icon={Users}
                    sub="Active faculty"
                />
                <StatBox
                    label="Total students"
                    value={isLoading ? '...' : (stats?.totalStudents ?? 0)}
                    icon={GraduationCap}
                    sub="Currently enrolled"
                />
                <StatBox
                    label="Departments"
                    value={isLoading ? '...' : (stats?.totalDepartments ?? 0)}
                    icon={Building2}
                    sub="Academic departments"
                />
            </div>

            {/* ── Performance chart ── */}
            <GradePerformanceChart />
        </PageRoot>
    )
}