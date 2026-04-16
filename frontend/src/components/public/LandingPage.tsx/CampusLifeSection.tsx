import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  CAMPUS_LIFE,  } from '@/constants/mockdata';

const CampusLifeSection = () => {
  return (
     <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">Life at Campus</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Vibrant Campus Life</h2>
              <p className="text-slate-600 mt-4 text-lg">Experience a nurturing environment equipped with world-class facilities designed for holistic development.</p>
            </div>
            <Button variant="outline" className="shrink-0 group" asChild>
              <Link to="/about">Explore Facilities <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAMPUS_LIFE.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg h-80"
              >
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 h-0 group-hover:h-[48px] overflow-hidden">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  )
}

export default CampusLifeSection