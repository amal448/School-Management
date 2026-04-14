import { RegisterTeacherDto, UpdateTeacherDto } from 'src/domain/dtos/teacher.dto'
import { Role }                                  from 'src/domain/enums'

export interface CreateTeacherInput {
  dto:       RegisterTeacherDto
  createdBy: string
}

export interface UpdateTeacherInput {
  id:            string
  dto:           UpdateTeacherDto
  requesterId:   string
  requesterRole: Role
}

export interface AssignDeptInput {
  teacherId: string
  deptId:    string
}

export interface GetTeachersBySubjectInput {
  subjectId: string
  deptId:    string
}

export interface GetTeachersByLevelInput {
  level: string
}

export interface DeactivateTeacherInput {
  teacherId:   string
  requesterId: string
}

export interface ReactivateTeacherInput {
  teacherId: string
}