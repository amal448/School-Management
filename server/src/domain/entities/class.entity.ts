export interface SubjectAllocation {
  subjectId: string
  teacherId: string
}

export interface ClassProps {
  id?:                 string
  className:           string
  section:             string
  academicYear:        string
  classTeacherId?:     string
  subjectAllocations?: SubjectAllocation[]
  createdAt?:          Date
  updatedAt?:          Date
}

export class ClassEntity {
  private readonly _id?:    string
  private _className:       string
  private _section:         string
  private _academicYear:    string
  private _classTeacherId?: string
  private _subjectAllocations: SubjectAllocation[]
  private readonly _createdAt: Date
  private _updatedAt:       Date

  private constructor(props: ClassProps) {
    this._id                  = props.id
    this._className           = this.requireNonEmpty(props.className,    'className')
    this._section             = this.requireNonEmpty(props.section,      'section')
    this._academicYear        = this.requireNonEmpty(props.academicYear, 'academicYear')
    this._classTeacherId      = props.classTeacherId
    this._subjectAllocations  = props.subjectAllocations ?? []
    this._createdAt           = props.createdAt ?? new Date()
    this._updatedAt           = props.updatedAt ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: ClassProps): ClassEntity {
    return new ClassEntity(props)
  }

  updateDetails(updates: Partial<Pick<ClassProps,
    'className' | 'section' | 'academicYear' | 'classTeacherId'
  >>): void {
    if (updates.className    !== undefined) this._className    = updates.className.trim()
    if (updates.section      !== undefined) this._section      = updates.section.trim()
    if (updates.academicYear !== undefined) this._academicYear = updates.academicYear.trim()
    if (updates.classTeacherId !== undefined) this._classTeacherId = updates.classTeacherId
    this._updatedAt = new Date()
  }

  allocateSubject(allocation: SubjectAllocation): void {
    const exists = this._subjectAllocations.some(
      (a) => a.subjectId === allocation.subjectId
    )
    if (exists) throw new Error('Subject already allocated to this class')
    this._subjectAllocations.push(allocation)
    this._updatedAt = new Date()
  }

  removeSubjectAllocation(subjectId: string): void {
    this._subjectAllocations = this._subjectAllocations.filter(
      (a) => a.subjectId !== subjectId
    )
    this._updatedAt = new Date()
  }

  assignClassTeacher(teacherId: string): void {
    this._classTeacherId = teacherId
    this._updatedAt = new Date()
  }

  get id():                 string | undefined      { return this._id }
  get className():          string                  { return this._className }
  get section():            string                  { return this._section }
  get academicYear():       string                  { return this._academicYear }
  get classTeacherId():     string | undefined      { return this._classTeacherId }
  get subjectAllocations(): SubjectAllocation[]     { return this._subjectAllocations }
  get createdAt():          Date                    { return this._createdAt }
  get updatedAt():          Date                    { return this._updatedAt }
}