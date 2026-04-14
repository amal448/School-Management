import { RegisterStudentDto, UpdateStudentDto } from 'src/domain/dtos/student.dto'
import { Role } from 'src/domain/enums'

export interface CreateStudentInput {
  dto:       RegisterStudentDto
  createdBy: string
}

export interface UpdateStudentInput {
  id:  string
  dto: UpdateStudentDto
}

export interface AssignStudentToClassInput {
  studentId: string
  classId:   string
}

export interface DeactivateStudentInput {
  studentId:    string
  requesterId:  string
}

export interface StudentResetPasswordInput {
  studentId:   string
  requesterId: string
  requesterRole: Role.MANAGER | Role.TEACHER
}

export interface StudentResetPasswordResult {
  firstTimeToken: string  // returned to manager/teacher to send to student
}
