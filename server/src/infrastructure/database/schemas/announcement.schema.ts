import { Schema, model, Document } from 'mongoose'

export interface IAnnouncementDocument extends Document {
  title:       string
  content:     string
  category:    string
  eventDate?:  Date
  isPublished: boolean
  isPinned:    boolean
  createdBy:   string
  createdAt:   Date
  updatedAt:   Date
}

const AnnouncementSchema = new Schema<IAnnouncementDocument>(
  {
    title:       { type: String, required: true, trim: true },
    content:     { type: String, required: true, trim: true },
    category:    {
      type:    String,
      required: true,
      enum:    ['event', 'notice', 'result', 'news'],
    },
    eventDate:   { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
    isPinned:    { type: Boolean, default: false },
    createdBy:   { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
)

AnnouncementSchema.index({ isPublished: 1, isPinned: -1, createdAt: -1 })
AnnouncementSchema.index({ category: 1, isPublished: 1 })

export const AnnouncementModel = model<IAnnouncementDocument>(
  'Announcement',
  AnnouncementSchema,
)