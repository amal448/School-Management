export interface TopperProps {
  id?: string
  name: string
  grade: string        // "10" | "12"
  department?: string        // "Science" | "Commerce" etc (for grade 12)
  marks: number
  totalMarks: number
  photoUrl?: string
  academicYear: string        // "2025-2026"
  rank?: number        // 1, 2, 3
  isPublished: boolean
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

export class TopperEntity {
  private _id?: string
  private _name: string
  private _grade: string
  private _department?: string
  private _marks: number
  private _totalMarks: number
  private _photoUrl?: string
  private _academicYear: string
  private _rank?: number
  private _isPublished: boolean
  private _createdBy: string
  private _createdAt: Date
  private _updatedAt: Date

  private constructor(props: TopperProps) {
    this._id = props.id
    this._name = props.name.trim()
    this._grade = props.grade
    this._department = props.department
    this._marks = props.marks
    this._totalMarks = props.totalMarks
    this._photoUrl = props.photoUrl
    this._academicYear = props.academicYear
    this._rank = props.rank
    this._isPublished = props.isPublished ?? false
    this._createdBy = props.createdBy
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? new Date()
  }

  static create(props: TopperProps): TopperEntity {
    return new TopperEntity(props)
  }

  update(updates: Partial<Pick<TopperProps,
    'name' | 'grade' | 'department' | 'marks' | 'photoUrl' | 'rank' | 'academicYear' | 'totalMarks'
  >>): void {
    if (updates.name !== undefined) this._name = updates.name.trim()
    if (updates.grade !== undefined) this._grade = updates.grade
    if (updates.department !== undefined) this._department = updates.department
    if (updates.marks !== undefined) this._marks = updates.marks
    if (updates.totalMarks !== undefined) this._totalMarks = updates.totalMarks
    if (updates.photoUrl !== undefined) this._photoUrl = updates.photoUrl
    if (updates.rank !== undefined) this._rank = updates.rank
    if (updates.academicYear !== undefined) this._academicYear = updates.academicYear
    this._updatedAt = new Date()
  }

  publish(): void { this._isPublished = true; this._updatedAt = new Date() }
  unpublish(): void { this._isPublished = false; this._updatedAt = new Date() }

  get id(): string | undefined { return this._id }
  get name(): string { return this._name }
  get grade(): string { return this._grade }
  get department(): string | undefined { return this._department }
  get marks(): number { return this._marks }
  get totalMarks(): number { return this._totalMarks }
  get photoUrl(): string | undefined { return this._photoUrl }
  get academicYear(): string { return this._academicYear }
  get rank(): number|undefined { return this._rank }
  get isPublished(): boolean { return this._isPublished }
  get createdBy(): string { return this._createdBy }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
}