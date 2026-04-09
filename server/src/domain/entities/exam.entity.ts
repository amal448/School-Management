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


    addGrade(grade: string): void {
        const exists = this._gradeConfigs.some(
            (g) => String(g.grade) === String(grade)
        )
        if (exists) throw new Error(`Grade ${grade} already added to this exam`)
        this._gradeConfigs.push({
            grade: String(grade),   // ← force string
            commonSubjects: [],
            sectionLanguages: [],
        })
        this._updatedAt = new Date()
    }

    removeGrade(grade: string): void {
        this._gradeConfigs = this._gradeConfigs.filter((g) => g.grade !== grade)
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
        const config = this._gradeConfigs.find(
            (g) => String(g.grade) === String(grade)   // ← force string comparison
        )
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

    // src/domain/entities/exam.entity.ts

    private validateDateInRange(date: Date | string): void {
        const d = new Date(date); d.setHours(0, 0, 0, 0)
        const s = new Date(this._startDate); s.setHours(0, 0, 0, 0)
        const e = new Date(this._endDate); e.setHours(0, 0, 0, 0)

        if (d < s || d > e) {
            throw new Error(
                `Exam date must be within the exam period ` +
                `(${s.toLocaleDateString()} – ${e.toLocaleDateString()})`
            )
        }
    }

    // Call it in both methods:
    // addCommonSubject(grade: string, subject: SubjectSchedule): void {
    //     const config = this.getGradeConfig(grade)
    //     this.validateDateInRange(subject.examDate)   // ← add
    //     // ... rest unchanged
    // }
    addCommonSubject(grade: string, subject: SubjectSchedule): void {
        const idx = this._gradeConfigs.findIndex(
            (g) => String(g.grade) === String(grade)
        )
        if (idx === -1) throw new Error(`Grade ${grade} not added to this exam`)

        const config = this._gradeConfigs[idx]!

        const duplicate = config.commonSubjects.some(
            (s) => s.subjectId === subject.subjectId
        )
        if (duplicate) throw new Error(`Subject already scheduled for grade ${grade}`)

        this.validateNoOverlap(config.commonSubjects, subject)

        // Replace the whole gradeConfigs array with a new one
        // This avoids any frozen/sealed object issues
        this._gradeConfigs = this._gradeConfigs.map((g, i) =>
            i === idx
                ? {
                    grade: g.grade,
                    commonSubjects: [...g.commonSubjects, subject],  // ← new array
                    sectionLanguages: [...g.sectionLanguages],
                }
                : { ...g }
        )

        this._updatedAt = new Date()
    }
    addSectionLanguage(grade: string, language: SectionLanguage): void {
        const idx = this._gradeConfigs.findIndex(
            (g) => String(g.grade) === String(grade)
        )
        if (idx === -1) throw new Error(`Grade ${grade} not added to this exam`)

        const config = this._gradeConfigs[idx]!

        const alreadyHas = config.sectionLanguages.some(
            (l) => l.classId === language.classId
        )
        if (alreadyHas) {
            throw new Error('Section already has a language subject. Remove it first.')
        }

        const isCommon = config.commonSubjects.some(
            (s) => s.subjectId === language.subjectId
        )
        if (isCommon) {
            throw new Error(`This subject is already a common subject for grade ${grade}`)
        }

        this._gradeConfigs = this._gradeConfigs.map((g, i) =>
            i === idx
                ? {
                    grade: g.grade,
                    commonSubjects: [...g.commonSubjects],
                    sectionLanguages: [...g.sectionLanguages, language],  // ← new array
                }
                : { ...g }
        )

        this._updatedAt = new Date()
    }

    removeCommonSubject(grade: string, subjectId: string): void {
        const idx = this._gradeConfigs.findIndex(
            (g) => String(g.grade) === String(grade)
        )
        if (idx === -1) throw new Error(`Grade ${grade} not found`)

        this._gradeConfigs = this._gradeConfigs.map((g, i) =>
            i === idx
                ? {
                    grade: g.grade,
                    commonSubjects: g.commonSubjects.filter(
                        (s) => s.subjectId !== subjectId
                    ),
                    sectionLanguages: [...g.sectionLanguages],
                }
                : { ...g }
        )

        this._updatedAt = new Date()
    }

    removeSectionLanguage(grade: string, classId: string): void {
        const idx = this._gradeConfigs.findIndex(
            (g) => String(g.grade) === String(grade)
        )
        if (idx === -1) throw new Error(`Grade ${grade} not found`)

        this._gradeConfigs = this._gradeConfigs.map((g, i) =>
            i === idx
                ? {
                    grade: g.grade,
                    commonSubjects: [...g.commonSubjects],
                    sectionLanguages: g.sectionLanguages.filter(
                        (l) => l.classId !== classId
                    ),
                }
                : { ...g }
        )

        this._updatedAt = new Date()
    }


    // ── Getters ────────────────────────────────────────────
    get id(): string | undefined { return this._id }
    get examName(): string { return this._examName }
    get examType(): ExamType { return this._examType }
    get academicYear(): string { return this._academicYear }
    get startDate(): Date { return this._startDate }
    get endDate(): Date { return this._endDate }
    get status(): ExamStatus { return this._status }
    get gradeConfigs(): GradeConfig[] {
        return this._gradeConfigs   // ← return direct reference
    }
    get createdBy(): string { return this._createdBy }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date { return this._updatedAt }
}