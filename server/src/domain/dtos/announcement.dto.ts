import { AnnouncementCategory } from "../entities/announcement.entity"

export interface CreateAnnouncementDto {
  title:       string
  content:     string
  category:    AnnouncementCategory
  eventDate?:  string
  isPublished?: boolean
  isPinned?:   boolean
}

export interface UpdateAnnouncementDto {
  title?:      string
  content?:    string
  category?:   AnnouncementCategory
  eventDate?:  string
}

export interface AnnouncementQueryDto {
  category?:    AnnouncementCategory
  isPublished?: boolean
  isPinned?:    boolean
  search?:      string
  page?:        number
  limit?:       number
}

export interface AnnouncementResponseDto {
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