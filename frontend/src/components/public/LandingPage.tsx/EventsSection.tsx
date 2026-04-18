import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ANNOUNCEMENTS, UPCOMING_EVENTS } from '@/constants/mockdata';
import {  usePublicAnnouncements } from '@/hooks/announcement/useAnnouncements';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)

  return {
    month: date.toLocaleString('en-US', { month: 'short' }), // Apr
    day: date.getDate(), // 15
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // 12:00 AM
  }
}

const EventsSection = () => {
 const { data, isLoading } = usePublicAnnouncements()

const allAnnouncements = Array.isArray(data) ? data : []

const published = allAnnouncements.filter(a => a.isPublished)

const announcements = published.filter(a => a.category !== 'event')
const events = published.filter(a => a.category === 'event')

const sortedAnnouncements = [...announcements].sort((a, b) =>
  Number(b.isPinned) - Number(a.isPinned) ||
  new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
).slice(0,3)

const sortedEvents = [...events].sort((a, b) =>
  new Date(a.eventDate ?? 0).getTime() - new Date(b.eventDate ?? 0).getTime()
).slice(0,3)


  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Announcements Column */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Bell className="w-8 h-8 text-primary" />
                  Notice Board
                </h2>
                <p className="text-slate-500 mt-2">Latest updates and featured announcements.</p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/events">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {sortedAnnouncements.map((ann, i) => {
                console.log(ann) // ✅ debug

                return (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-none bg-slate-50 relative overflow-hidden group">

                      {/* Left Border Animation */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

                      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">

                            {/* Category */}
                            <Badge variant="outline" className="bg-white text-xs">
                              {ann.category}
                            </Badge>

                            {/* Date */}
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(ann.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Title */}
                          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                            {ann.title}
                          </CardTitle>
                        </div>

                        {/* Pinned / New */}
                        {ann.isPinned && (
                          <Badge className="bg-primary text-[10px] uppercase font-bold shrink-0">
                            Pinned
                          </Badge>
                        )}
                      </CardHeader>

                      <CardContent>
                        <CardDescription className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {ann.content}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
            <Button variant="outline" asChild className="mt-8 w-full md:hidden">
              <Link to="/events">View All Announcements <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {/* Upcoming Events Column */}
          <div className="lg:col-span-4 rounded-3xl bg-slate-950 p-8 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>

            <div className="relative z-10 flex-grow">
              <h3 className="text-2xl font-bold text-white mb-8">Upcoming Events</h3>
              <div className="space-y-6">
                {sortedEvents.map((evt, i) => {
                 const { month, day, time } = formatDate(evt.eventDate ?? '')

                  console.log(evt) // ✅ debugging

                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      {/* Date Block */}
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                        <span className="text-white text-xs font-semibold uppercase">
                          {month}
                        </span>
                        <span className="text-white text-xl font-bold leading-none mt-0.5">
                          {day}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-white font-medium mb-1">
                          {evt.title}
                        </h4>

                        <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                          {evt.content}
                        </p>

                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {time}
                          </span>

                          {/* Optional fallback */}
                          <span className="text-slate-400 text-xs flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> School Campus
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="relative z-10 mt-10 pt-6 border-t border-white/10">
              <Button variant="link" className="w-full text-primary hover:text-primary/80 px-0 flex justify-between group">
                See full events calendar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

        </div>
      </div>
      
    </section>
  )
}

export default EventsSection