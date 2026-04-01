import { MarksStatus } from 'src/domain/enums'

export interface ExamScheduleProps {
  id?:          string
  examId:       string
  classId:      string
  subjectId:    string
  teacherId:    string
  examDate:     Date
  startTime:    string
  endTime:      string
  totalMarks:   number
  passingMarks: number
  marksStatus:  MarksStatus
  submittedAt?: Date
  createdAt?:   Date
  updatedAt?:   Date
}

export class ExamScheduleEntity {
  private readonly _id?:         string
  private readonly _examId:      string
  private readonly _classId:     string
  private readonly _subjectId:   string
  private readonly _teacherId:   string
  private readonly _examDate:    Date
  private readonly _startTime:   string
  private readonly _endTime:     string
  private readonly _totalMarks:  number
  private readonly _passingMarks: number
  private _marksStatus:          MarksStatus
  private _submittedAt?:         Date
  private readonly _createdAt:   Date
  private _updatedAt:            Date

  private constructor(props: ExamScheduleProps) {
    this._id           = props.id
    this._examId       = props.examId
    this._classId      = props.classId
    this._subjectId    = props.subjectId
    this._teacherId    = props.teacherId
    this._examDate     = props.examDate
    this._startTime    = props.startTime
    this._endTime      = props.endTime
    this._totalMarks   = props.totalMarks
    this._passingMarks = props.passingMarks
    this._marksStatus  = props.marksStatus ?? MarksStatus.PENDING
    this._submittedAt  = props.submittedAt
    this._createdAt    = props.createdAt ?? new Date()
    this._updatedAt    = props.updatedAt ?? new Date()
  }

  static create(props: ExamScheduleProps): ExamScheduleEntity {
    return new ExamScheduleEntity(props)
  }

  submitMarks(): void {
    if (this._marksStatus !== MarksStatus.PENDING) {
      throw new Error('Marks already submitted')
    }
    this._marksStatus = MarksStatus.SUBMITTED
    this._submittedAt = new Date()
    this._updatedAt   = new Date()
  }

  lock(): void {
    if (this._marksStatus !== MarksStatus.SUBMITTED) {
      throw new Error('Only submitted schedules can be locked')
    }
    this._marksStatus = MarksStatus.LOCKED
    this._updatedAt   = new Date()
  }

  get id():           string | undefined { return this._id }
  get examId():       string             { return this._examId }
  get classId():      string             { return this._classId }
  get subjectId():    string             { return this._subjectId }
  get teacherId():    string             { return this._teacherId }
  get examDate():     Date               { return this._examDate }
  get startTime():    string             { return this._startTime }
  get endTime():      string             { return this._endTime }
  get totalMarks():   number             { return this._totalMarks }
  get passingMarks(): number             { return this._passingMarks }
  get marksStatus():  MarksStatus        { return this._marksStatus }
  get submittedAt():  Date | undefined   { return this._submittedAt }
  get createdAt():    Date               { return this._createdAt }
  get updatedAt():    Date               { return this._updatedAt }
}