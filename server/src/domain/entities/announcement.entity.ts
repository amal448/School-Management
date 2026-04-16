export type AnnouncementCategory = 'event' | 'notice' | 'result' | 'news'

export interface AnnouncementProps {
  id?:          string
  title:        string
  content:      string
  category:     AnnouncementCategory
  eventDate?:   Date
  isPublished:  boolean
  isPinned:     boolean
  createdBy:    string
  createdAt?:   Date
  updatedAt?:   Date
}

export class AnnouncementEntity {
  private _id?:         string
  private _title:       string
  private _content:     string
  private _category:    AnnouncementCategory
  private _eventDate?:  Date
  private _isPublished: boolean
  private _isPinned:    boolean
  private _createdBy:   string
  private _createdAt:   Date
  private _updatedAt:   Date

  private constructor(props: AnnouncementProps) {
    this._id          = props.id
    this._title       = props.title.trim()
    this._content     = props.content.trim()
    this._category    = props.category
    this._eventDate   = props.eventDate
    this._isPublished = props.isPublished ?? false
    this._isPinned    = props.isPinned    ?? false
    this._createdBy   = props.createdBy
    this._createdAt   = props.createdAt   ?? new Date()
    this._updatedAt   = props.updatedAt   ?? new Date()
  }

  static create(props: AnnouncementProps): AnnouncementEntity {
    return new AnnouncementEntity(props)
  }

  update(updates: Partial<Pick<AnnouncementProps,
    'title' | 'content' | 'category' | 'eventDate'
  >>): void {
    if (updates.title)     this._title     = updates.title.trim()
    if (updates.content)   this._content   = updates.content.trim()
    if (updates.category)  this._category  = updates.category
    if (updates.eventDate !== undefined) this._eventDate = updates.eventDate
    this._updatedAt = new Date()
  }

  publish(): void {
    this._isPublished = true
    this._updatedAt   = new Date()
  }

  unpublish(): void {
    this._isPublished = false
    this._updatedAt   = new Date()
  }

  togglePin(): void {
    this._isPinned  = !this._isPinned
    this._updatedAt = new Date()
  }

  get id():          string | undefined        { return this._id }
  get title():       string                    { return this._title }
  get content():     string                    { return this._content }
  get category():    AnnouncementCategory      { return this._category }
  get eventDate():   Date | undefined          { return this._eventDate }
  get isPublished(): boolean                   { return this._isPublished }
  get isPinned():    boolean                   { return this._isPinned }
  get createdBy():   string                    { return this._createdBy }
  get createdAt():   Date                      { return this._createdAt }
  get updatedAt():   Date                      { return this._updatedAt }
}