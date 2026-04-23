// components/achievers/AchieversSection.tsx

import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { usePublicToppers } from '@/hooks/topper/useToppers'
import AchieverCard from './AchieverCard'

const AchieversSection = () => {
  const { data: byGrade, isLoading } = usePublicToppers()

  if (isLoading) {
    return <div className="py-16 text-center">Loading achievers...</div>
  }

  if (!byGrade || !Object.keys(byGrade).length) return null

  const grades = Object.keys(byGrade).sort((a, b) => Number(a) - Number(b))

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">
              Top Achievers
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            Grade-wise star performers
          </h2>
        </div>

        {/* Grades */}
        <div className="flex flex-col gap-16">
          {grades.map((grade) => {
            const toppers = byGrade[grade]

            return (
              <motion.div key={grade}>
                <h3 className="text-xl font-bold mb-4">
                  Grade {grade}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {toppers.map((topper) => (
                    <AchieverCard key={topper.id} topper={topper} />
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

export default AchieversSection