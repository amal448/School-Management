import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {  ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  SPORTS, } from '@/constants/mockdata';
import { useState } from 'react';

const SportsSection = () => {
  const [activeSport, setActiveSport] = useState(SPORTS[0]);

  return (
       <section className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/10 hover:bg-primary/20 text-white">Athletics & Sports</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Beyond the Classroom</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We believe in building character through sports. Our world-class athletic facilities help students discover their true physical potential.</p>
          </div>

          <div className="flex flex-col gap-8 mb-12">
            {/* Horizontal Tabs */}
            <div className="flex flex-row flex-nowrap sm:flex-wrap justify-start sm:justify-center overflow-x-auto gap-4 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setActiveSport(sport)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-full cursor-pointer transition-all shrink-0 snap-center outline-none ${activeSport.id === sport.id
                    ? 'bg-primary text-white shadow-lg ring-2 ring-primary/50 ring-offset-2 ring-offset-slate-950'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <div className={`flex items-center justify-center transition-colors ${activeSport.id === sport.id ? 'text-white' : 'text-slate-400'
                    }`}>
                    {sport.icon}
                  </div>
                  <span className="text-base font-bold whitespace-nowrap">{sport.title}</span>
                </button>
              ))}
            </div>

            {/* Display Area Carousel */}
            <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[21/9] bg-slate-900 border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSport.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeSport.image}
                    alt={activeSport.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Gradient Overlay & Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-6 md:p-12">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="max-w-3xl"
                    >
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-4 border-none">{activeSport.title}</Badge>
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{activeSport.title}</h3>
                      <p className="text-slate-300 text-lg md:text-xl leading-relaxed">{activeSport.desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center">
            <Button variant="secondary" className="group px-8 hover:scale-105 transition-transform" asChild>
              <Link to="/about">View All Sports Programs <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></Link>
            </Button>
          </div>
        </div>
      </section>
  )
}

export default SportsSection