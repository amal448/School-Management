import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CalendarDays, Bell, Trophy, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALL_ANNOUNCEMENTS, CATEGORIES, ITEMS_PER_PAGE } from '@/constants/mockdata';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredItems = ALL_ANNOUNCEMENTS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle Page Change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' }); // scroll to list top smoothly
    }
  };

  // Reset pagination on filter change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* 1. Subtle Page Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            News & <span className="text-primary">Events</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Stay updated with the latest happenings, academic results, and important notices from EduCore.
          </motion.p>
        </div>
      </section>

      {/* 2. Controls Area (Search & Filters) */}
      <section className="py-8 sticky top-[72px] z-40 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search announcements..." 
                className="pl-9 pr-9 h-11 bg-white border-slate-200 focus-visible:ring-primary rounded-full shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange({ target: { value: '' } } as any)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Expected Feed List */}
      <section className="py-12 bg-slate-50 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <AnimatePresence mode="popLayout">
            {currentItems.length > 0 ? (
              <div className="space-y-6">
                {currentItems.map((item, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                  >
                    <Card className="border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row">
                        {/* Date Tag */}
                        <div className="sm:w-48 bg-slate-100/50 p-6 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-slate-100">
                          <Badge variant="outline" className={`mb-0 sm:mb-3 flex items-center gap-1 text-xs border-transparent shadow-sm ${
                            item.category === 'Event' ? 'bg-blue-100 text-blue-700' :
                            item.category === 'Results' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.icon} {item.category}
                          </Badge>
                          <span className="text-slate-600 text-sm font-medium">{item.date}</span>
                        </div>
                        
                        {/* Content Body */}
                        <div className="flex-1">
                          <CardHeader className="pb-3 pt-6 sm:pt-6 px-6">
                            <CardTitle className="text-xl text-slate-900 leading-tight">
                              {item.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-6 pb-6">
                            <p className="text-slate-600 leading-relaxed text-base">
                              {item.content}
                            </p>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500">We couldn't find anything matching your current filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 font-medium">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}