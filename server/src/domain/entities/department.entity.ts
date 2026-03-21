export interface DepartmentProps {
  id?:          string
  deptName:     string
  deptHeadId?:  string
  description?: string
  createdAt?:   Date
  updatedAt?:   Date
}

export class DepartmentEntity {
  private readonly _id?:   string
  private _deptName:       string
  private _deptHeadId?:    string
  private _description?:   string
  private readonly _createdAt: Date
  private _updatedAt:      Date

  private constructor(props: DepartmentProps) {
    this._id          = props.id
    this._deptName    = this.requireNonEmpty(props.deptName, 'deptName')
    this._deptHeadId  = props.deptHeadId
    this._description = props.description
    this._createdAt   = props.createdAt ?? new Date()
    this._updatedAt   = props.updatedAt ?? new Date()
  }

  private requireNonEmpty(value: string, field: string): string {
    if (!value?.trim()) throw new Error(`${field} is required`)
    return value.trim()
  }

  static create(props: DepartmentProps): DepartmentEntity {
    return new DepartmentEntity(props)
  }

  updateDetails(updates: Partial<Pick<DepartmentProps,
    'deptName' | 'description' | 'deptHeadId'
  >>): void {
    if (updates.deptName)              this._deptName    = updates.deptName.trim()
    if (updates.description !== undefined) this._description = updates.description
    if (updates.deptHeadId  !== undefined) this._deptHeadId  = updates.deptHeadId
    this._updatedAt = new Date()
  }

  get id():          string | undefined { return this._id }
  get deptName():    string             { return this._deptName }
  get deptHeadId():  string | undefined { return this._deptHeadId }
  get description(): string | undefined { return this._description }
  get createdAt():   Date               { return this._createdAt }
  get updatedAt():   Date               { return this._updatedAt }
}