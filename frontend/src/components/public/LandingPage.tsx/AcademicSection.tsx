import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {ArrowRight, Medal, Star} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TOPPERS_10TH, TOPPERS_12TH } from '@/constants/mockdata';


const AcademicSection = () => {
    return (
        <>
            <section className="py-24 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                {/* Background Celebration Decorations */}
                <motion.img
                    initial={{ opacity: 0, scale: 0.5, rotate: -20, x: -50, y: -50 }}
                    whileInView={{ opacity: 0.4, scale: 1, rotate: -10, x: 0, y: 0 }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true }}
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png"
                    className="absolute -top-10 -left-10 md:top-4 md:left-4 lg:top-10 lg:left-10 w-48 h-48 md:w-80 md:h-80 z-0 pointer-events-none drop-shadow-2xl"
                    alt="Celebration"
                />
                <motion.img
                    initial={{ opacity: 0, scale: 0.5, rotate: 20, x: 50, y: 50 }}
                    whileInView={{ opacity: 0.4, scale: 1, rotate: 10, x: 0, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true }}
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png"
                    className="absolute -bottom-10 -right-10 md:bottom-4 md:right-4 lg:bottom-10 lg:right-10 w-48 h-48 md:w-80 md:h-80 z-0 pointer-events-none drop-shadow-2xl"
                    alt="Trophy"
                />

                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                        <div className="text-left">
                            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">Hall of Fame</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Our Academic Excellence</h2>
                            <p className="text-slate-600 max-w-2xl text-lg">Celebrating our top performers who have shown remarkable dedication in board examinations.</p>
                        </div>
                        <Button variant="outline" className="group shrink-0" asChild>
                            <Link to="/academics">View All Achievers <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
                        </Button>
                    </div>

                    {/* 12th Grade Toppers */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mt-8 mb-8 pb-4 border-b border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Medal className="w-6 h-6 text-yellow-500" /> Class 12th Toppers
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {TOPPERS_12TH.map((student, idx) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative mb-4">
                                        <img src={student.image} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 group-hover:border-yellow-100 transition-colors shadow-sm" />
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                            #{student.rank}
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">{student.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">{student.stream}</Badge>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{student.percentage}</Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 10th Grade Toppers */}
                    <div>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Star className="w-6 h-6 text-blue-500" /> Class 10th Toppers
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {TOPPERS_10TH.map((student, idx) => (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 w-full h-1 from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative mb-4">
                                        <img src={student.image} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 group-hover:border-blue-100 transition-colors shadow-sm" />
                                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                                            #{student.rank}
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">{student.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{student.percentage}</Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AcademicSection