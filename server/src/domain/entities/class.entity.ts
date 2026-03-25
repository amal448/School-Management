export interface SubjectAllocation {
  subjectId: string
  teacherId?: string
}

export interface ClassProps {
  id?: string
  grade: string
  section: string

  classTeacherId?: string
  subjectAllocations?: SubjectAllocation[]
  createdAt?: Date
  updatedAt?: Date
}

export class ClassEntity {
  private readonly _id?: string
  private _grade: string
  private _section: string

  private _classTeacherId?: string
  private _subjectAllocations: SubjectAllocation[]
  private readonly _createdAt: Date
  private _updatedAt: Date

  private constructor(props: ClassProps) {
    this._id = props.id
    this._grade = this.requireNonEmpty(props.grade, 'grade')
    this._section = this.requireNonEmpty(props.section, 'section')

    this._classTeacherId = props.classTeacherId
    this._subjectAllocations = props.subjectAllocations ?? []
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: ClassProps): ClassEntity {
    return new ClassEntity(props)
  }

  updateDetails(updates: Partial<Pick<ClassProps,
    'grade' | 'section' | 'classTeacherId'
  >>): void {
    if (updates.grade !== undefined) this._grade = updates.grade.trim()
    if (updates.section !== undefined) this._section = updates.section.trim()
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

  get id(): string | undefined { return this._id }
  get grade(): string { return this._grade }
  get section(): string { return this._section }
  get classTeacherId(): string | undefined { return this._classTeacherId }
  get subjectAllocations(): SubjectAllocation[] { return this._subjectAllocations }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
}