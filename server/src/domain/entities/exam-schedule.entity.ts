import { MarksStatus } from 'src/domain/enums'

export interface ExamScheduleProps {
  id?:          string
  examId:       string
  timetableId:  string
  classId:      string
  subjectId:    string
  teacherId:    string    // snapshot from class.subjectAllocations at publish time
  marksStatus:  MarksStatus
  submittedAt?: Date
  createdAt?:   Date
  updatedAt?:   Date
}

export class ExamScheduleEntity {
  private readonly _id?:        string
  private readonly _examId:     string
  private readonly _timetableId: string
  private readonly _classId:    string
  private readonly _subjectId:  string
  private readonly _teacherId:  string
  private _marksStatus:         MarksStatus
  private _submittedAt?:        Date
  private readonly _createdAt:  Date
  private _updatedAt:           Date

  private constructor(props: ExamScheduleProps) {
    this._id           = props.id
    this._examId       = props.examId
    this._timetableId  = props.timetableId
    this._classId      = props.classId
    this._subjectId    = props.subjectId
    this._teacherId    = props.teacherId
    this._marksStatus  = props.marksStatus ?? MarksStatus.PENDING
    this._submittedAt  = props.submittedAt
    this._createdAt    = props.createdAt ?? new Date()
    this._updatedAt    = props.updatedAt ?? new Date()
  }

  static create(props: ExamScheduleProps): ExamScheduleEntity {
    return new ExamScheduleEntity(props)
  }

  // Teacher submits marks for this class-subject
  submitMarks(): void {
    if (this._marksStatus !== MarksStatus.PENDING) {
      throw new Error('Marks already submitted for this schedule')
    }
    this._marksStatus = MarksStatus.SUBMITTED
    this._submittedAt = new Date()
    this._updatedAt   = new Date()
  }

  // Admin/Manager locks after declaration
  lock(): void {
    if (this._marksStatus !== MarksStatus.SUBMITTED) {
      throw new Error('Only submitted marks can be locked')
    }
    this._marksStatus = MarksStatus.LOCKED
    this._updatedAt   = new Date()
  }

  get id():          string | undefined { return this._id }
  get examId():      string             { return this._examId }
  get timetableId(): string             { return this._timetableId }
  get classId():     string             { return this._classId }
  get subjectId():   string             { return this._subjectId }
  get teacherId():   string             { return this._teacherId }
  get marksStatus(): MarksStatus        { return this._marksStatus }
  get submittedAt(): Date | undefined   { return this._submittedAt }
  get createdAt():   Date               { return this._createdAt }
  get updatedAt():   Date               { return this._updatedAt }
}