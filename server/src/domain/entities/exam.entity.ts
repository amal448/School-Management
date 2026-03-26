import { ExamType, ExamStatus } from 'src/domain/enums'

export interface ExamProps {
    id?: string
    examName: string
    examType: ExamType
    academicYear: string
    startDate: Date
    endDate: Date
    applicableClasses: string[]
    status: ExamStatus
    createdBy: string
    createdAt?: Date
    updatedAt?: Date
}

export class ExamEntity {
    private readonly _id?: string
    private _examName: string
    private _examType: ExamType
    private _academicYear: string
    private _startDate: Date
    private _endDate: Date
    private _applicableClasses: string[]
    private _status: ExamStatus
    private readonly _createdBy: string
    private readonly _createdAt: Date
    private _updatedAt: Date

    private constructor(props: ExamProps) {
        this._id = props.id
        this._examName = this.requireNonEmpty(props.examName, 'examName')
        this._examType = props.examType
        this._academicYear = this.requireNonEmpty(props.academicYear, 'academicYear')
        this._startDate = props.startDate
        this._endDate = props.endDate
        this._applicableClasses = props.applicableClasses
        this._status = props.status ?? ExamStatus.DRAFT
        this._createdBy = props.createdBy
        this._createdAt = props.createdAt ?? new Date()
        this._updatedAt = props.updatedAt ?? new Date()
    }

    private requireNonEmpty(value: string, field: string): string {
        if (!value?.trim()) throw new Error(`${field} is required`)
        return value.trim()
    }

    static create(props: ExamProps): ExamEntity {
        return new ExamEntity(props)
    }

    // ── Domain behaviours ──────────────────────────────

    publish(): void {
        if (this._status !== ExamStatus.DRAFT) {
            throw new Error('Only draft exams can be published')
        }
        this._status = ExamStatus.SCHEDULED
        this._updatedAt = new Date()
    }

    startExam(): void {
        if (this._status !== ExamStatus.SCHEDULED) {
            throw new Error('Exam must be scheduled before starting')
        }
        this._status = ExamStatus.ONGOING
        this._updatedAt = new Date()
    }

    markPending(): void {
        this._status = ExamStatus.MARKS_PENDING
        this._updatedAt = new Date()
    }

    declare(): void {
        if (this._status !== ExamStatus.MARKS_PENDING &&
            this._status !== ExamStatus.ONGOING) {
            throw new Error('Exam cannot be declared in current status')
        }
        this._status = ExamStatus.DECLARED
        this._updatedAt = new Date()
    }

    updateDetails(updates: Partial<Pick<ExamProps,
        'examName' | 'startDate' | 'endDate' | 'applicableClasses'
    >>): void {
        if (this._status !== ExamStatus.DRAFT) {
            throw new Error('Only draft exams can be edited')
        }
        if (updates.examName) this._examName = updates.examName.trim()
        if (updates.startDate) this._startDate = updates.startDate
        if (updates.endDate) this._endDate = updates.endDate
        if (updates.applicableClasses) this._applicableClasses = updates.applicableClasses
        this._updatedAt = new Date()
    }

   // ── Getters ──────────────────────────────────────────
  get id():                 string | undefined { return this._id }
  get examName():           string             { return this._examName }
  get examType():           ExamType           { return this._examType }
  get academicYear():       string             { return this._academicYear }
  get startDate():          Date               { return this._startDate }
  get endDate():            Date               { return this._endDate }
  get applicableClasses():  string[]           { return this._applicableClasses }
  get status():             ExamStatus         { return this._status }
  get createdBy():          string             { return this._createdBy }
  get createdAt():          Date               { return this._createdAt }
  get updatedAt():          Date               { return this._updatedAt }

}