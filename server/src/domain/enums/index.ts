//Role enum
export enum Role {
  MANAGER = 'MANAGER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

// Gender enum
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// attendence enum
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

// Assignment Status enum
export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

// submissionStatus enum
export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  RESUBMISSION_REQUESTED = 'resubmission_requested',
}

// error type  enum
export enum ErrorType {
  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  UPDATE_FAILED = 'UPDATE_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
}

export enum ExamType {
  UNIT_TEST = 'unit_test',
  MIDTERM = 'midterm',
  QUARTERLY = 'quarterly',
  FINAL = 'final',
  MOCK = 'mock'
}

export enum ExamStatus {
  DRAFT='draft',
  SCHEDULED='scheduled',
  ONGOING='ongoing',
  MARKS_PENDING ='marks_pending',
  DECLARED='declared'
}

export enum MarksStatus {
  PENDING='pending',
  SUBMITTED='submitted',
  LOCKED ='locked'
}

export enum TeacherLevel {
  PRIMARY = 'primary',
  MIDDLE = 'middle',
  SECONDARY = 'secondary',
  HIGHER_SECONDARY = 'higher_secondary'
}