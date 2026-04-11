import { motion } from 'framer-motion';
import { Target, Eye, Award, History, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <History className="w-4 h-4" />
                <span>Our Heritage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Built on a foundation of excellence & innovation.</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Founded in 1995, EduCore began as a small suburban school with a vision to provide
                  quality education accessible to all. Over the decades, we have expanded our campus,
                  integrated modern technologies, and adopted globally recognized curricula.
                </p>
                <p>
                  Today, we stand as one of the region's top educational institutions, celebrated for
                  our holistic approach that balances academic rigor with creative and physical development.
                  Our alumni span across the globe, leading in diverse fields from technology to the arts.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-200 relative group shadow-2xl">
                {/* Placeholder for real campus image */}
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-500 font-medium tracking-widest uppercase">Campus Photo Placeholder</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-xl font-bold">Main Campus Building</div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_2px,transparent_2px)] bg-[size:12px_12px] -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-10 rounded-3xl bg-blue-50 border border-blue-100 relative overflow-hidden group"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To be a globally recognized center of learning that fosters intellectual curiosity,
                ethical leadership, and a lifelong passion for learning, preparing students to thrive
                in a rapidly evolving world.
              </p>
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl rounded-br-3xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-10 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To provide a nurturing, inclusive environment that challenges students to achieve academic
                excellence, develop strong character, and engage meaningfully within their communities.
              </p>
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl rounded-bl-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-slate-950 rounded-[40px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">

              <div className="lg:col-span-5 relative bg-slate-800 hidden md:block">
                {/* Placeholder for Principal Photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-48 h-48 bg-slate-700/50 rounded-full border-4 border-slate-600/50 shadow-2xl mb-6"></div>
                  <span className="text-slate-400 font-medium tracking-widest uppercase text-sm border border-slate-600 rounded-full px-4 py-2">Portrait Placeholder</span>
                </div>
              </div>

              <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <svg className="w-12 h-12 text-primary/40 -translate-x-2" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6.1c.5-2.2 2.5-4 4.9-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-7.9c.5-2.2 2.5-4 4.9-4V8z"></path>
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Education is not the filling of a pail, but the lighting of a fire.
                </h3>
                <div className="space-y-4 text-slate-300 mb-10 text-lg">
                  <p>
                    Welcome to EduCore. Since our inception, our focus has always been on nurturing the individual talents of each student. We believe that every child is unique and possesses immense potential.
                  </p>
                  <p>
                    Our dedicated faculty, comprehensive curriculum, and supportive community work in harmony to ignite that spark of curiosity, empowering our students to become confident, responsible, and forward-thinking individuals.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Dr. Sarah Jenkins</h4>
                  <p className="text-primary mt-1">Principal, EduCore Institutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
            <Award className="w-4 h-4" />
            <span>Hall of Fame</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Key Achievements</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { year: '2025', count: '100%', title: 'Board Exam Pass Rate' },
              { year: '2024', count: 'National', title: 'Science Innovation Award' },
              { year: '2023', count: 'Top 10', title: 'Schools in the State Region' },
              { year: 'All Time', count: '15k+', title: 'Successful Alumni Worldwide' },
            ].map((ach, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
              >
                <div className="text-sm font-bold text-slate-400 mb-2">{ach.year}</div>
                <div className="text-4xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{ach.count}</div>
                <div className="text-slate-600 font-medium">{ach.title}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button size="lg" asChild>
              <Link to="/academics">
                Explore our Academic Programs <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}