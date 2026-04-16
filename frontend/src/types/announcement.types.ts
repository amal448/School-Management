export type AnnouncementCategory = 'event' | 'notice' | 'result' | 'news'

export interface AnnouncementResponse {
  id:          string
  title:       string
  content:     string
  category:    AnnouncementCategory
  eventDate?:  string
  isPublished: boolean
  isPinned:    boolean
  createdBy:   string
  createdAt:   string
  updatedAt:   string
}

export interface CreateAnnouncementInput {
  title:       string
  content:     string
  category:    AnnouncementCategory
  eventDate?:  string
  isPublished?: boolean
  isPinned?:   boolean
}

export interface UpdateAnnouncementInput {
  title?:     string
  content?:   string
  category?:  AnnouncementCategory
  eventDate?: string
}

export interface AnnouncementQueryParams {
  category?:    AnnouncementCategory
  isPublished?: boolean
  search?:      string
  page?:        number
  limit?:       number
}

export interface PaginatedAnnouncements {
  data:       AnnouncementResponse[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export const CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
  event:   'Event',
  notice:  'Notice',
  result:  'Result',
  news:    'News',
}

export const CATEGORY_COLORS: Record<AnnouncementCategory, string> = {
  event:   '#C9A84C',
  notice:  '#4C9AC9',
  result:  '#4CC97A',
  news:    '#C94C7A',
}