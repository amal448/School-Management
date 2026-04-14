import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from 'src/domain/dtos/department.dto'

import {
  CreateSubjectDto,
  UpdateSubjectDto,
} from 'src/domain/dtos/subject.dto'

import {
  CreateClassDto,
  UpdateClassDto,
} from 'src/domain/dtos/class.dto'

// ── Department ─────────────────────────────────────────
export interface CreateDepartmentInput {
  dto: CreateDepartmentDto
}

export interface UpdateDepartmentInput {
  id:  string
  dto: UpdateDepartmentDto
}

export interface DeleteDepartmentInput {
  id: string
}

export interface AssignDeptHeadInput {
  deptId:    string
  teacherId: string
}

// ── Subject ────────────────────────────────────────────
export interface CreateSubjectInput {
  dto: CreateSubjectDto
}

export interface UpdateSubjectInput {
  id:  string
  dto: UpdateSubjectDto
}

export interface DeleteSubjectInput {
  id: string
}

// ── Class ──────────────────────────────────────────────
export interface CreateClassInput {
  dto: CreateClassDto
}

export interface UpdateClassInput {
  id:  string
  dto: UpdateClassDto
}

export interface DeleteClassInput {
  id: string
}

export interface AllocateSubjectInput {
  classId:   string
  subjectId: string
}

export interface RemoveSubjectInput {
  classId:   string
  subjectId: string
}

export interface AssignSubjectTeacherInput {
  classId:   string
  subjectId: string
  teacherId: string
}

export interface AssignClassTeacherInput {
  classId:   string
  teacherId: string
}