import { motion } from 'framer-motion';
import { BookOpen, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEPARTMENTS, EXAM_STRUCTURE, SUBJECTS_OFFERED } from '@/constants/mockdata';

export default function AcademicsPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">

      {/* 2. Departments Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Departments</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Discover the broad spectrum of disciplines supported by our specialized faculty and state-of-the-art facilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={dept.id}
              >
                <Card className="h-full border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dept.bg} ${dept.color} group-hover:scale-110 transition-transform`}>
                      {dept.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 text-base">{dept.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Subjects Offered Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Subjects Offered</h2>
              <p className="text-slate-500">Core and elective subjects available across different grade levels.</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hidden md:block">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SUBJECTS_OFFERED.map((level, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">{level.level}</h3>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {level.subjects.map((sub, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm py-1 font-medium">
                      {sub}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Examination Structure */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Examination Structure</h2>
            <p className="text-slate-500">Our assessment system is designed to provide continuous feedback and comprehensive evaluation.</p>
          </div>

          <div className="space-y-6">
            {EXAM_STRUCTURE.map((exam, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="flex flex-col md:flex-row gap-6 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900">{exam.term}</h3>
                  <p className="text-primary font-medium mt-1">{exam.duration}</p>
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <p className="text-slate-600 leading-relaxed mb-4">{exam.details}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <FileCheck className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">Weightage: {exam.weightage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}