import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { usePublicToppers } from '@/hooks/topper/useToppers'
import { TopperResponse } from '@/types/topper.types'
import { AchieverCard } from '@/components/academics/AchieverCard'

export const AchieversSection = () => {
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
