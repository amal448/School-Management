import { motion }           from 'framer-motion'
import { BookOpen, FileCheck, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge }            from '@/components/ui/badge'
import { DEPARTMENTS, EXAM_STRUCTURE, SUBJECTS_OFFERED } from '@/constants/mockdata'
import { usePublicToppers } from '@/hooks/topper/useToppers'
import { TopperResponse }   from '@/types/topper.types'

// ── Achiever card ──────────────────────────────────────
const AchieverCard = ({ topper }: { topper: TopperResponse }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
    {topper.photoUrl ? (
      <img
        src={topper.photoUrl}
        alt={topper.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-200"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center text-xl font-bold text-yellow-600">
        {topper.name.charAt(0)}
      </div>
    )}

    <div>
      <p className="text-sm font-semibold text-slate-900 leading-tight">
        {topper.name}
      </p>
      {topper.department && (
        <p className="text-xs text-slate-400 mt-0.5">{topper.department}</p>
      )}
    </div>

    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <Badge variant="secondary" className="text-xs">
        {topper.marks}/{topper.totalMarks}
      </Badge>
      <Badge className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
        {Math.round((topper.marks / topper.totalMarks) * 100)}%
      </Badge>
    </div>

    <span className="text-xs text-slate-400">
      {topper.rank === 1 ? '🥇' : topper.rank === 2 ? '🥈' : topper.rank === 3 ? '🥉' : `#${topper.rank}`}
      {' '}Rank {topper.rank}
    </span>
  </div>
)

// ── Achievers section ──────────────────────────────────
const AchieversSection = () => {
  const { data: byGrade, isLoading } = usePublicToppers()

  if (isLoading) return (
    <div className="py-16 text-center text-slate-400">Loading achievers...</div>
  )

  if (!byGrade || !Object.keys(byGrade).length) return null

  const grades = Object.keys(byGrade).sort((a, b) => Number(a) - Number(b))

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
              Top Achievers
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Grade-wise star performers
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Recognising outstanding results across all grades for the academic year{' '}
            {byGrade[grades[0]]?.[0]?.academicYear ?? ''}.
          </p>
        </div>

        {/* Grade sections */}
        <div className="flex flex-col gap-16">
          {grades.map((grade) => {
            const toppers: TopperResponse[] = byGrade[grade]!
            return (
              <motion.div
                key={grade}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                {/* Grade header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                    {grade}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      Grade {grade}
                    </p>
                    <p className="text-xs text-slate-400">
                      {toppers.length} achiever{toppers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {/* Separator line */}
                  <div className="flex-1 h-px bg-slate-200 ml-2" />
                </div>

                {/* Achiever cards — horizontal wrap */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {toppers
                    // .sort((a, b) => a.rank - b.rank)
                    .map((topper) => (
                      <motion.div
                        key={topper.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                      >
                        <AchieverCard topper={topper} />
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────
export default function AcademicsPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">

      {/* ── Achievers — real data at top ── */}
      <AchieversSection />

      {/* ── Departments ── */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Departments
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Discover the broad spectrum of disciplines supported by our specialized faculty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dept.bg} ${dept.color} group-hover:scale-110 transition-transform`}>
                      {dept.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 text-base">
                      {dept.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects Offered ── */}
      

      {/* ── Examination Structure ── */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Examination Structure
            </h2>
            <p className="text-slate-500">
              Our assessment system is designed to provide continuous feedback and comprehensive evaluation.
            </p>
          </div>
          <div className="space-y-6">
            {EXAM_STRUCTURE.map((exam, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-6 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900">{exam.term}</h3>
                  <p className="text-primary font-medium mt-1">{exam.duration}</p>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <p className="text-slate-600 leading-relaxed mb-4">{exam.details}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <FileCheck className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      Weightage: {exam.weightage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}