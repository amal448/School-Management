export interface MarksProps {
  id?:          string
  examId:       string
  scheduleId:   string
  studentId:    string
  subjectId:    string
  classId:      string
  marksScored:  number
  totalMarks:   number
  grade:        string
  isAbsent:     boolean
  gradedBy:     string
  gradedAt:     Date
  createdAt?:   Date
  updatedAt?:   Date
}

export class MarksEntity {
  private readonly _id?:        string
  private readonly _examId:     string
  private readonly _scheduleId: string
  private readonly _studentId:  string
  private readonly _subjectId:  string
  private readonly _classId:    string
  private _marksScored:         number
  private readonly _totalMarks: number
  private _grade:               string
  private _isAbsent:            boolean
  private readonly _gradedBy:   string
  private readonly _gradedAt:   Date
  private readonly _createdAt:  Date
  private _updatedAt:           Date

  private constructor(props: MarksProps) {
    this._id          = props.id
    this._examId      = props.examId
    this._scheduleId  = props.scheduleId
    this._studentId   = props.studentId
    this._subjectId   = props.subjectId
    this._classId     = props.classId
    this._marksScored = props.marksScored
    this._totalMarks  = props.totalMarks
    this._grade       = props.grade
    this._isAbsent    = props.isAbsent
    this._gradedBy    = props.gradedBy
    this._gradedAt    = props.gradedAt
    this._createdAt   = props.createdAt ?? new Date()
    this._updatedAt   = props.updatedAt ?? new Date()
  }

  static create(props: Omit<MarksProps, 'grade'>): MarksEntity {
    const grade = props.isAbsent
      ? 'AB'
      : MarksEntity.computeGrade(props.marksScored, props.totalMarks)

    return new MarksEntity({ ...props, grade })
  }

  // Grade computation — standard Kerala board style
  static computeGrade(scored: number, total: number): string {
    const pct = (scored / total) * 100
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B+'
    if (pct >= 60) return 'B'
    if (pct >= 50) return 'C'
    if (pct >= 35) return 'D'
    return 'F'
  }

  get id():          string | undefined { return this._id }
  get examId():      string             { return this._examId }
  get scheduleId():  string             { return this._scheduleId }
  get studentId():   string             { return this._studentId }
  get subjectId():   string             { return this._subjectId }
  get classId():     string             { return this._classId }
  get marksScored(): number             { return this._marksScored }
  get totalMarks():  number             { return this._totalMarks }
  get grade():       string             { return this._grade }
  get isAbsent():    boolean            { return this._isAbsent }
  get gradedBy():    string             { return this._gradedBy }
  get gradedAt():    Date               { return this._gradedAt }
  get createdAt():   Date               { return this._createdAt }
  get updatedAt():   Date               { return this._updatedAt }
}