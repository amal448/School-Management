import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Medal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePublicToppers } from '@/hooks/topper/useToppers'
import { TopperResponse } from '@/types/topper.types'  // ← import for explicit typing

const AcademicSection = () => {
  const { data: byGrade, isLoading } = usePublicToppers()

  if (isLoading) {
    return <div className="text-center py-20">Loading toppers...</div>
  }

  if (!byGrade) return null

  // ← Fix: explicitly type as TopperResponse[]
  const toppers12: TopperResponse[] = byGrade['12'] ?? []
  const toppers10: TopperResponse[] = byGrade['10'] ?? []

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 relative overflow-hidden">

      <motion.img
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.4, scale: 1 }}
        viewport={{ once: true }}
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png"
        className="absolute -top-10 -left-10 w-48 h-48 opacity-40"
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-16 gap-6">
          <div>
            <Badge className="mb-4">Hall of Fame</Badge>
            <h2 className="text-3xl font-bold mb-4">Our Academic Excellence</h2>
            <p className="text-slate-600">
              Celebrating our top performers in board exams.
            </p>
          </div>
          <Button asChild>
            <Link to="/academics">
              View All Achievers <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* ── Grade 12 ── */}
        {toppers12.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Medal className="text-yellow-500" /> Class 12th Toppers
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {toppers12.slice(0, 3).map((student: TopperResponse, idx: number) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow text-center"
                >
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-yellow-100 flex items-center justify-center text-2xl font-bold text-yellow-600">
                      {student.name.charAt(0)}
                    </div>
                  )}
                  <h4 className="font-bold text-lg">{student.name}</h4>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    {student.department && <Badge>{student.department}</Badge>}
                    <Badge>
                      {student.marks} /  {student.totalMarks}
                    </Badge>
                  </div>
                  <div className="mt-2 text-yellow-500 font-bold">
                    Rank #{student.rank}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Grade 10 ── */}
        {toppers10.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-blue-500" /> Class 10th Toppers
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {toppers10.slice(0, 3).map((student: TopperResponse, idx: number) => (
                <motion.div
                  key={student.id}   // ← Fix: was student._id (doesn't exist on TopperResponse)
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow text-center"
                >
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                      {student.name.charAt(0)}
                    </div>
                  )}
                  <h4 className="font-bold text-lg">{student.name}</h4>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    {student.department && <Badge>{student.department}</Badge>}
                    <Badge>
                      {student.marks} /  {student.totalMarks}
                    </Badge>
                  </div>
                  <div className="mt-2 text-blue-500 font-bold">
                    Rank #{student.rank}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}


        <div className="mt-16 flex justify-center">
          <Button
            asChild
            size="lg"
            className="gap-2 rounded-full px-8 shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
          >
            <Link to="/academics">
              <Medal className="w-4 h-4 text-yellow-400" />
              View All Achievers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default AcademicSection