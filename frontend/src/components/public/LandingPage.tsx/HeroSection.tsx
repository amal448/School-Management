import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// 
const HeroSection = () => {
  return (
    <>
      <section className="relative min-h-screen  flex items-center justify-center overflow-hidden bg-slate-950 " >

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-600/10 mix-blend-multiply opacity-50"></div>
            {/* Decorative abstract elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side content */}
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                Admissions for 2026-2027 are now open!
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-2xl leading-tight md:leading-tight"
              >
                Empowering the <br className="hidden lg:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary">Leaders</span> of Tomorrow
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed"
              >
                EduCore provides world-class education, a vibrant community, and modern facilities to help students discover and achieve their full potential.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Button size="lg" asChild className="h-14 px-8 text-base shadow-xl shadow-primary/20">
                  <Link to="/admissions">
                    Start Application <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md">
                  <Link to="/about">
                    Discover EduCore
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right side image */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl z-20"
              >
                {/* Glowing background effect for emphasis */}
                <div className="absolute inset-0 bg-primary/40 blur-[100px] rounded-full scale-75 transform -translate-y-10"></div>

                {/* Main Transparent Subject */}
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Student.png"
                  alt="Student Hero Graphic"
                  className="relative z-10 w-3/4 max-w-[400px] h-auto object-contain mx-auto drop-shadow-2xl  transition-transform duration-500"
                />

                {/* Floating Decorative Elements (Also transparent) */}
                <motion.img
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png"
                  className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 z-20 drop-shadow-xl opacity-90"
                  alt="Books"
                />
                <motion.img
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png"
                  className="absolute bottom-10 left-0 w-24 h-24 md:w-32 md:h-32 z-20 drop-shadow-xl opacity-90"
                  alt="Graduation Cap"
                />
              </motion.div>
            </div>
          </div>

          {/* Custom shape divider */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div> */}
        </div>
      </section>

    </>
  )
}

export default HeroSection