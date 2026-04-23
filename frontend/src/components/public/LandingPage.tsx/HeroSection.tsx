import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://media.gettyimages.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=gi&k=20&c=8to_zwGxxcI1iYcix7DhmWahoDTlaqxEMzumDwJtxeg=')`,
        }}
      />

      {/* Dark overlay layers */}
      <div className="absolute inset-0 z-10 bg-[#060606]/20" />
      <div className="absolute inset-0 z-10 bg-linear-to-r from-[#060606]/90 via-[#060606]/60 to-[#060606]/30" />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-[#060606]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 max-w-7xl py-32 md:py-40">
        <div className="max-w-3xl">

          {/* Admission pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Admissions for 2026-2027 are now open!
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
          >
            Empowering the{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-primary">
              Leaders
            </span>{' '}
            of Tomorrow
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed"
          >
            EduCore provides world-class education, a vibrant community, and modern
            facilities to help students discover and achieve their full potential.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="h-14 px-8 text-base shadow-xl shadow-primary/20 w-full sm:w-auto"
            >
              <Link to="/admissions">
                Start Application <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md w-full sm:w-auto"
            >
              <Link to="/about">Discover EduCore</Link>
            </Button>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-24 z-20 bg-gradient-to-t from-slate-50 to-transparent" /> */}

    </section>
  );
};

export default HeroSection;