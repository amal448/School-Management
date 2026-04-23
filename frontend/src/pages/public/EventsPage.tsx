import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnnouncements, usePublicAnnouncements } from '@/hooks/announcement/useAnnouncements'

const ITEMS_PER_PAGE = 5

// 🔥 Normalize backend category → UI
const normalizeCategory = (cat: string) => {
  if (cat === 'event') return 'Event'
  if (cat === 'result') return 'Results'
  return 'Announcement'
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = usePublicAnnouncements()
 const allAnnouncements = Array.isArray(data) ? data : []


  // 🔥 Dynamic categories (optional but better)
  const categories = [
    'All',
    ...Array.from(
      new Set(allAnnouncements.map((item) => normalizeCategory(item.category)))
    )
  ]

  // 🔥 Filter Logic
  const filteredItems = allAnnouncements.filter((item) => {
    const category = normalizeCategory(item.category)

    const matchesCategory =
      activeCategory === 'All' || category === activeCategory

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // 🔥 Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // 🔥 Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // 🔥 Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        Loading announcements...
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            News & <span className="text-primary">Events</span>
          </motion.h1>
          <p className="text-lg text-slate-500">
            Stay updated with the latest happenings and announcements.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 sticky top-[72px] z-40 bg-slate-50/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row gap-4 justify-between">

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="pl-9 pr-9 rounded-full"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4 max-w-4xl">

          <AnimatePresence mode="popLayout">
            {currentItems.length > 0 ? (
              <div className="space-y-6">
                {currentItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row">

                        {/* Left */}
                        <div className="sm:w-48 p-6 bg-slate-100 flex flex-col justify-center">
                          <Badge
                            className={
                              item.category === 'event'
                                ? 'bg-blue-100 text-blue-700'
                                : item.category === 'result'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }
                          >
                            {normalizeCategory(item.category)}
                          </Badge>

                          <span className="text-sm mt-2">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Right */}
                        <div className="flex-1">
                          <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-600">
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
              <div className="text-center py-20">
                <p>No results found</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-between">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft /> Prev
              </Button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}