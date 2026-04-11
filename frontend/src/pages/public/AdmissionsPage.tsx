import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, CalendarDays, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APPLICATON_STEPS, FEE_STRUCTURE, IMPORTANT_DATES } from '@/constants/mockdata';

export default function AdmissionsPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">

      {/* 2. Main Content Grid (Process & Dates) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Col: How to Apply Process */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <FileText className="w-4 h-4" />
                <span>Admission Process</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">How to Apply</h2>

              <div className="relative border-l-2 border-slate-100 ml-6 space-y-12 pb-8">
                {APPLICATON_STEPS.map((step, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    key={step.id}
                    className="relative pl-10"
                  >
                    {/* Circle Node */}
                    <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-primary font-bold shadow-sm">
                      {step.id}
                    </div>

                    <Card className="border border-slate-100 hover:border-primary/30 transition-colors shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-slate-900">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-600 text-base">{step.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Right Col: Important Dates */}
            <div className="lg:col-span-4">
              <div className="bg-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>

                <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  Key Deadlines
                </h3>

                <div className="space-y-6 relative z-10">
                  {IMPORTANT_DATES.map((item, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      key={idx}
                      className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    >
                      <h4 className="font-semibold text-slate-200 mb-1">{item.event}</h4>
                      <p className="text-primary text-sm font-medium">{item.date}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Fee Structure Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <CreditCard className="w-4 h-4" />
              <span>Investment in Education</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fee Structure</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Transparent and inclusive tuition fees. We also offer financial aid programs for strictly eligible candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {FEE_STRUCTURE.map((fee, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={idx}
                className={`rounded-3xl p-8 border border-slate-100 ${fee.color} hover:-translate-y-2 transition-transform duration-300`}
              >
                <h3 className="text-lg font-semibold text-slate-700 mb-6">{fee.grade}</h3>
                <div className="flex items-baseline gap-2 mb-6 text-slate-900">
                  <span className="text-5xl font-black">{fee.tuition}</span>
                  <span className="text-sm font-medium text-slate-500 uppercase">{fee.term}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    Includes core academic supplies
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    Access to digital learning platforms
                  </li>
                  <li className="flex items-start gap-2 text-slate-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    Standard extracurricular activities
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 max-w-xl mx-auto">
            * Note: Transportation, meal plans, and specific specialized extracurriculars may incur additional charges.
            Detailed fee schedule is provided upon admission offer.
          </p>
        </div>
      </section>

      {/* 4. Action Banner (Download Prospectus) */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Want to know more?</h2>
            <p className="text-primary-foreground/90 text-lg">Download our comprehensive 2026 Admissions Prospectus.</p>
          </div>
          <Button size="lg" variant="secondary" className="h-14 px-8 text-base shadow-lg shrink-0 gap-2">
            <Download className="w-5 h-5" /> Download PDF (4.2 MB)
          </Button>
        </div>
      </section>

    </div>
  );
}