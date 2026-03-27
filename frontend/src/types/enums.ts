export enum ExamType {
    UNIT_TEST = 'unit_test',
    MIDTERM = 'midterm',
    QUARTERLY = 'quarterly',
    FINAL = 'final',
    MOCK = 'mock'
}
export enum ExamStatus {
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    ONGOING = 'ongoing',
    MARKS_PENDING = 'marks_pending',
    DECLARED = 'declared',
}
export enum MarksStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    LOCKED = 'locked',
}