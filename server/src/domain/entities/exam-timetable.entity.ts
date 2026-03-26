export interface ExamTimetableProps {
    id?: string
    examId: string //id of exam
    subjectId: string
    examDate: Date
    startTime: string    // "09:00"
    endTime: string    // "12:00"
    totalMarks: number
    passingMarks: number
    createdAt?: Date
    updatedAt?: Date
}

export class ExamTimetableEntity {
    private readonly _id?: string
    private readonly _examId: string
    private _subjectId: string
    private _examDate: Date
    private _startTime: string
    private _endTime: string
    private _totalMarks: number
    private _passingMarks: number
    private readonly _createdAt: Date
    private _updatedAt: Date

    private constructor(props: ExamTimetableProps) {
        this._id = props.id
        this._examId = props.examId
        this._subjectId = props.subjectId
        this._examDate = props.examDate
        this._startTime = props.startTime
        this._endTime = props.endTime
        this._totalMarks = props.totalMarks
        this._passingMarks = props.passingMarks
        this._createdAt = props.createdAt ?? new Date()
        this._updatedAt = props.updatedAt ?? new Date()
    }

    static create(props: ExamTimetableProps): ExamTimetableEntity {
        if (props.passingMarks > props.totalMarks) {
            throw new Error('Passing marks cannot exceed total marks')
        }
        return new ExamTimetableEntity(props)
    }

    updateDetails(updates: Partial<Pick<ExamTimetableProps,
        'examDate' | 'startTime' | 'endTime' | 'totalMarks' | 'passingMarks'
    >>): void {
        if (updates.examDate) this._examDate = updates.examDate
        if (updates.startTime) this._startTime = updates.startTime
        if (updates.endTime) this._endTime = updates.endTime
        if (updates.totalMarks) this._totalMarks = updates.totalMarks
        if (updates.passingMarks) this._passingMarks = updates.passingMarks
        this._updatedAt = new Date()
    }
    get id():           string | undefined { return this._id }
  get examId():       string             { return this._examId }
  get subjectId():    string             { return this._subjectId }
  get examDate():     Date               { return this._examDate }
  get startTime():    string             { return this._startTime }
  get endTime():      string             { return this._endTime }
  get totalMarks():   number             { return this._totalMarks }
  get passingMarks(): number             { return this._passingMarks }
  get createdAt():    Date               { return this._createdAt }
  get updatedAt():    Date               { return this._updatedAt }
}