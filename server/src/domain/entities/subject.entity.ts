export interface SubjectProps {
  id?:         string
  subjectName: string
  deptId:      string
  createdAt?:  Date
  updatedAt?:  Date
}

export class SubjectEntity {
  private readonly _id?: string
  private _subjectName:  string
  private _deptId:       string
  private readonly _createdAt: Date
  private _updatedAt:    Date

  private constructor(props: SubjectProps) {
    this._id          = props.id
    this._subjectName = this.requireNonEmpty(props.subjectName, 'subjectName')
    this._deptId      = this.requireNonEmpty(props.deptId,      'deptId')
    this._createdAt   = props.createdAt ?? new Date()
    this._updatedAt   = props.updatedAt ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: SubjectProps): SubjectEntity {
    return new SubjectEntity(props)
  }

  updateDetails(updates: Partial<Pick<SubjectProps,
    'subjectName' | 'deptId'
  >>): void {
    if (updates.subjectName) this._subjectName = updates.subjectName.trim()
    if (updates.deptId)      this._deptId      = updates.deptId
    this._updatedAt = new Date()
  }

  get id():          string | undefined { return this._id }
  get subjectName(): string             { return this._subjectName }
  get deptId():      string             { return this._deptId }
  get createdAt():   Date               { return this._createdAt }
  get updatedAt():   Date               { return this._updatedAt }
}