import { ManagerEntity } from 'src/domain/entities/manager.entity'
import { TeacherEntity } from 'src/domain/entities/teacher.entity'
import { StudentEntity } from 'src/domain/entities/student.entity'
import { AdminEntity } from 'src/domain/entities/admin.entity'
import { DepartmentEntity } from 'src/domain/entities/department.entity'
import { SubjectEntity } from 'src/domain/entities/subject.entity'
import { ClassEntity } from 'src/domain/entities/class.entity'
import { ExamEntity } from 'src/domain/entities/exam.entity'
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity'
import { MarksEntity } from 'src/domain/entities/marks.entity'

import { ManagerResponseDto } from 'src/domain/dtos/manager.dto'
import { TeacherResponseDto } from 'src/domain/dtos/teacher.dto'
import { StudentResponseDto } from 'src/domain/dtos/student.dto'
import { AdminResponseDto } from 'src/domain/dtos/admin.dto'
import { DepartmentResponseDto } from 'src/domain/dtos/department.dto'
import { SubjectResponseDto } from 'src/domain/dtos/subject.dto'
import { ClassResponseDto } from 'src/domain/dtos/class.dto'
import {
  ExamResponseDto,
  ExamScheduleResponseDto,
  MarksResponseDto,
} from 'src/domain/dtos/exam.dto'
import { AnnouncementEntity } from 'src/domain/entities/announcement.entity'
import { AnnouncementResponseDto } from 'src/domain/dtos/announcement.dto'
import { TopperEntity } from 'src/domain/entities/topper.entity'
import { TopperResponseDto } from 'src/domain/dtos/topper.dto'

export class TopperMapper {
  static toDto(entity: TopperEntity): TopperResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      grade: entity.grade,
      department: entity.department,
      marks: entity.marks,        // ← was percentage
      totalMarks: entity.totalMarks,   // ← add
      rank: entity.rank,   // ← add
      photoUrl: entity.photoUrl,
      academicYear: entity.academicYear,
      isPublished: entity.isPublished,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }
  }
}


export class AnnouncementMapper {
  static toDto(entity: AnnouncementEntity): AnnouncementResponseDto {
    return {
      id: entity.id!,
      title: entity.title,
      content: entity.content,
      category: entity.category,
      eventDate: entity.eventDate?.toISOString(),
      isPublished: entity.isPublished,
      isPinned: entity.isPinned,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    }
  }

  static toDtoList(entities: AnnouncementEntity[]): AnnouncementResponseDto[] {
    return entities.map(this.toDto)
  }
}


// ── Manager ───────────────────────────────────────────
export class ManagerMapper {
  static toDto(entity: ManagerEntity): ManagerResponseDto {
    return {
      id: entity.id!,
      email: entity.email,
      role: 'MANAGER',
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      phone: entity.phone,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      isFirstTime: entity.isFirstTime,
      isBlocked: entity.isBlocked,
      blockedBy: entity.blockedBy,
      blockedAt: entity.blockedAt,
      lastLogin: entity.lastLogin,
      createdByAdmin: entity.createdByAdmin,
      createdAt: entity.createdAt,
    }
  }

  static toDtoList(entities: ManagerEntity[]): ManagerResponseDto[] {
    return entities.map(this.toDto)
  }
}

// ── Teacher ───────────────────────────────────────────
export class TeacherMapper {
  static toDto(e: TeacherEntity): TeacherResponseDto {
    return {
      id: e.id!,
      email: e.email,
      role: 'TEACHER',
      firstName: e.firstName,
      lastName: e.lastName,
      fullName: e.fullName,
      dob: e.dob,
      gender: e.gender,
      phone: e.phone,
      address: e.address,
      hireDate: e.hireDate,
      qualification: e.qualification,
      designation: e.designation,
      level: e.level,         // ← add
      deptId: e.deptId,
      subjectIds: e.subjectIds,    // ← add
      isActive: e.isActive,
      isVerified: e.isVerified,
      isFirstTime: e.isFirstTime,
      lastLogin: e.lastLogin,
      createdAt: e.createdAt,
    }
  }

  static toDtoList(entities: TeacherEntity[]): TeacherResponseDto[] {
    return entities.map(this.toDto)
  }
}

// ── Student ───────────────────────────────────────────
export class StudentMapper {
  static toDto(e: StudentEntity): StudentResponseDto {
    return {
      id: e.id!,
      email: e.email,
      role: 'STUDENT',
      firstName: e.firstName,
      lastName: e.lastName,
      fullName: e.fullName,
      dob: e.dob,
      gender: e.gender,
      phone: e.phone,
      address: e.address,
      admissionDate: e.admissionDate,
      guardianName: e.guardianName,
      guardianContact: e.guardianContact,
      classId: e.classId,
      isActive: e.isActive,
      createdAt: e.createdAt,
    }
  }

  static toDtoList(entities: StudentEntity[]): StudentResponseDto[] {
    return entities.map(this.toDto)
  }
}

// ── Admin ─────────────────────────────────────────────
export class AdminMapper {
  static toDto(entity: AdminEntity): AdminResponseDto {
    return {
      id: entity.id!,
      email: entity.email,
      role: 'ADMIN',
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      avatar: entity.avatar,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      lastLogin: entity.lastLogin,
      createdAt: entity.createdAt,
    }
  }
}

// ── Department ────────────────────────────────────────
export class DepartmentMapper {
  static toDto(entity: DepartmentEntity): DepartmentResponseDto {
    return {
      id: entity.id!,
      deptName: entity.deptName,
      deptHeadId: entity.deptHeadId,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}

// ── Subject ───────────────────────────────────────────
export class SubjectMapper {
  static toDto(entity: SubjectEntity): SubjectResponseDto {
    return {
      id: entity.id!,
      subjectName: entity.subjectName,
      deptId: entity.deptId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}

// ── Class ─────────────────────────────────────────────
export class ClassMapper {
  static toDto(entity: ClassEntity): ClassResponseDto {
    return {
      id: entity.id!,
      grade: entity.grade,
      section: entity.section,
      classTeacherId: entity.classTeacherId,
      classTeacher: entity.classTeacher ? TeacherMapper.toDto(entity.classTeacher) : undefined,
      // Fix 1: teacherId is optional in entity — map to string | undefined
      subjectAllocations: entity.subjectAllocations.map((a) => ({
        subjectId: a.subjectId,
        subject: a.subject ? SubjectMapper.toDto(a.subject) : undefined,
        teacherId: a.teacherId ?? undefined,
        teacher: a.teacher ? TeacherMapper.toDto(a.teacher) : undefined,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}

// ── Exam ──────────────────────────────────────────────
export class ExamMapper {
  static toDto(entity: ExamEntity): ExamResponseDto {
    return {
      id: entity.id!,
      examName: entity.examName,
      examType: entity.examType,
      academicYear: entity.academicYear,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      // gradeConfigs are plain objects — pass through directly
      gradeConfigs: entity.gradeConfigs,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  // Fix 2: timetableToDto removed — exam_timetable collection no longer exists
  // Fix 3: scheduleToDto no longer references timetableId

  static scheduleToDto(entity: ExamScheduleEntity): ExamScheduleResponseDto {
    return {
      id: entity.id!,
      examId: entity.examId,
      classId: entity.classId,
      subjectId: entity.subjectId,
      teacherId: entity.teacherId,
      examDate: entity.examDate,
      startTime: entity.startTime,
      endTime: entity.endTime,
      totalMarks: entity.totalMarks,
      passingMarks: entity.passingMarks,
      marksStatus: entity.marksStatus,
      submittedAt: entity.submittedAt,
    }
  }

  static marksToDto(entity: MarksEntity): MarksResponseDto {
    return {
      id: entity.id!,
      examId: entity.examId,
      scheduleId: entity.scheduleId,
      studentId: entity.studentId,
      subjectId: entity.subjectId,
      classId: entity.classId,
      marksScored: entity.marksScored,
      totalMarks: entity.totalMarks,
      grade: entity.grade,
      isAbsent: entity.isAbsent,
      gradedBy: entity.gradedBy,
      gradedAt: entity.gradedAt,
    }
  }
}