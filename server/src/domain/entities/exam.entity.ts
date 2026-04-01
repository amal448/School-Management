import { ExamType, ExamStatus } from 'src/domain/enums'

export interface SubjectSchedule {
    subjectId: string
    examDate: Date
    startTime: string
    endTime: string
    totalMarks: number
    passingMarks: number
}

export interface SectionLanguage extends SubjectSchedule {
    classId: string
}

export interface GradeConfig {
    grade: string
    commonSubjects: SubjectSchedule[]
    sectionLanguages: SectionLanguage[]
}

export interface ExamProps {
    id?: string
    examName: string
    examType: ExamType
    academicYear: string
    startDate: Date
    endDate: Date
    status: ExamStatus
    gradeConfigs: GradeConfig[]
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
    private _status: ExamStatus
    private _gradeConfigs: GradeConfig[]
    private readonly _createdBy: string
    private readonly _createdAt: Date
    private _updatedAt: Date

    private constructor(props: ExamProps) {
        this._id = props.id
        this._examName = props.examName.trim()
        this._examType = props.examType
        this._academicYear = props.academicYear
        this._startDate = props.startDate
        this._endDate = props.endDate
        this._status = props.status ?? ExamStatus.DRAFT
        this._gradeConfigs = props.gradeConfigs ?? []
        this._createdBy = props.createdBy
        this._createdAt = props.createdAt ?? new Date()
        this._updatedAt = props.updatedAt ?? new Date()
    }

    static create(props: ExamProps): ExamEntity {
        return new ExamEntity(props)
    }

    // ── Grade management ──────────────────────────────────

    addGrade(grade: string): void {
        const exists = this._gradeConfigs.some((g) => g.grade === grade)
        if (exists) throw new Error(`Grade ${grade} already added to this exam`)
        this._gradeConfigs.push({ grade, commonSubjects: [], sectionLanguages: [] })
        this._updatedAt = new Date()
    }

    removeGrade(grade: string): void {
        this._gradeConfigs = this._gradeConfigs.filter((g) => g.grade !== grade)
        this._updatedAt = new Date()
    }

    // ── Common subject management ──────────────────────────

    addCommonSubject(grade: string, subject: SubjectSchedule): void {
        const config = this.getGradeConfig(grade)

        // No duplicate subjects per grade
        const duplicate = config.commonSubjects.some(
            (s) => s.subjectId === subject.subjectId
        )
        if (duplicate) {
            throw new Error(`Subject already scheduled for grade ${grade}`)
        }

        // No time overlap with existing subjects on same date
        this.validateNoOverlap(config.commonSubjects, subject)

        config.commonSubjects.push(subject)
        this._updatedAt = new Date()
    }

    updateCommonSubject(
        grade: string,
        subjectId: string,
        updates: Partial<Omit<SubjectSchedule, 'subjectId'>>,
    ): void {
        const config = this.getGradeConfig(grade)
        const subject = config.commonSubjects.find((s) => s.subjectId === subjectId)
        if (!subject) throw new Error('Subject not found in grade')
        Object.assign(subject, updates)
        this._updatedAt = new Date()
    }

    removeCommonSubject(grade: string, subjectId: string): void {
        const config = this.getGradeConfig(grade)
        config.commonSubjects = config.commonSubjects.filter(
            (s) => s.subjectId !== subjectId
        )
        this._updatedAt = new Date()
    }

    // ── Section language management ────────────────────────
    addSectionLanguage(grade: string, language: SectionLanguage): void {
        const config = this.getGradeConfig(grade)   // ← use grade param

        const alreadyHasLanguage = config.sectionLanguages.some(
            (l) => l.classId === language.classId
        )
        if (alreadyHasLanguage) {
            throw new Error('Section already has a language subject. Remove it first.')
        }

        const isCommonSubject = config.commonSubjects.some(
            (s) => s.subjectId === language.subjectId
        )
        if (isCommonSubject) {
            throw new Error(
                `This subject is already a common subject for grade ${grade}`
            )
        }

        config.sectionLanguages.push(language)
        this._updatedAt = new Date()
    }

    // Fix removeSectionLanguage — same pattern
    removeSectionLanguage(grade: string, classId: string): void {
        const config = this.getGradeConfig(grade)   // ← use grade param
        config.sectionLanguages = config.sectionLanguages.filter(
            (l) => l.classId !== classId
        )
        this._updatedAt = new Date()
    }

    // ── Resolve final subjects for a class ────────────────
    // Returns: common subjects + section language (if any)
    // NO replace logic — purely additive
    getSubjectsForClass(grade: string, classId: string): SubjectSchedule[] {
        const config = this._gradeConfigs.find((g) => g.grade === grade)
        if (!config) return []

        const subjects: SubjectSchedule[] = [...config.commonSubjects]

        const language = config.sectionLanguages.find((l) => l.classId === classId)
        if (language) {
            const { classId: _removed, ...rest } = language   // strip classId
            subjects.push(rest)
        }

        return subjects
    }
    // ── Lifecycle ──────────────────────────────────────────

    publish(): void {
        if (this._status !== ExamStatus.DRAFT) {
            throw new Error('Only draft exams can be published')
        }
        this._status = ExamStatus.SCHEDULED
        this._updatedAt = new Date()
    }

    markPending(): void {
        this._status = ExamStatus.MARKS_PENDING
        this._updatedAt = new Date()
    }

    declare(): void {
        this._status = ExamStatus.DECLARED
        this._updatedAt = new Date()
    }

    updateDetails(
        updates: Partial<Pick<ExamProps, 'examName' | 'startDate' | 'endDate'>>,
    ): void {
        if (this._status !== ExamStatus.DRAFT) {
            throw new Error('Only draft exams can be edited')
        }
        if (updates.examName) this._examName = updates.examName.trim()
        if (updates.startDate) this._startDate = updates.startDate
        if (updates.endDate) this._endDate = updates.endDate
        this._updatedAt = new Date()
    }

    // ── Private helpers ────────────────────────────────────

    private getGradeConfig(grade: string): GradeConfig {
        const config = this._gradeConfigs.find((g) => g.grade === grade)
        if (!config) throw new Error(`Grade ${grade} not added to this exam`)
        return config
    }

    private validateNoOverlap(
        existing: SubjectSchedule[],
        incoming: SubjectSchedule,
    ): void {
        const incomingDateStr = new Date(incoming.examDate).toDateString()

        const sameDay = existing.filter(
            (s) => new Date(s.examDate).toDateString() === incomingDateStr
        )

        for (const s of sameDay) {
            const existStart = this.timeToMinutes(s.startTime)
            const existEnd = this.timeToMinutes(s.endTime)
            const newStart = this.timeToMinutes(incoming.startTime)
            const newEnd = this.timeToMinutes(incoming.endTime)

            if (newStart < existEnd && newEnd > existStart) {
                throw new Error(
                    `Time overlap on ${new Date(incoming.examDate).toLocaleDateString()}: ` +
                    `${incoming.startTime}–${incoming.endTime} conflicts with existing exam`
                )
            }
        }
    }

    private timeToMinutes(time: string): number {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    // ── Getters ────────────────────────────────────────────
    get id(): string | undefined { return this._id }
    get examName(): string { return this._examName }
    get examType(): ExamType { return this._examType }
    get academicYear(): string { return this._academicYear }
    get startDate(): Date { return this._startDate }
    get endDate(): Date { return this._endDate }
    get status(): ExamStatus { return this._status }
    get gradeConfigs(): GradeConfig[] { return this._gradeConfigs }
    get createdBy(): string { return this._createdBy }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }
}