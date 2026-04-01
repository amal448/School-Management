// src/infrastructure/repositories/mappers/index.ts
// Translates MongoDB documents ↔ pure domain entities.
// Domain entities never import Mongoose types — this mapper is the bridge.

import { IManagerDocument } from '../../database/schemas/manager.schema';
import { ITeacherDocument } from '../../database/schemas/teacher.schema';
import { IStudentDocument } from '../../database/schemas/student.schema';
import { ManagerEntity } from '../../../domain/entities/manager.entity';
import { TeacherEntity } from '../../../domain/entities/teacher.entity';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { IAdminDocument } from 'src/infrastructure/database/schemas/admin.schema';
import { AdminEntity } from 'src/domain/entities/admin.entity';
import { IDepartmentDocument } from 'src/infrastructure/database/schemas/department.schema';
import { DepartmentEntity } from 'src/domain/entities/department.entity';
import { ISubjectDocument } from 'src/infrastructure/database/schemas/subject.schema';
import { SubjectEntity } from 'src/domain/entities/subject.entity';
import { IClassDocument } from 'src/infrastructure/database/schemas/class.schema';
import { ClassEntity } from 'src/domain/entities/class.entity';
import { IExamDocument } from 'src/infrastructure/database/schemas/exam.schema';
import { ExamEntity } from 'src/domain/entities/exam.entity';
import { ExamStatus, ExamType, MarksStatus } from 'src/domain/enums';
import { ExamTimetableEntity } from 'src/domain/entities/exam-timetable.entity';
import { IExamScheduleDocument } from 'src/infrastructure/database/schemas/exam-schedule.schema';
import { ExamScheduleEntity } from 'src/domain/entities/exam-schedule.entity';
import { IMarksDocument } from 'src/infrastructure/database/schemas/marks.schema';
import { MarksEntity } from 'src/domain/entities/marks.entity';

// ── Manager ────────────────────────────────────────────
export class ManagerDocumentMapper {

  static toDomain(doc: IManagerDocument): ManagerEntity {
    return ManagerEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash ?? undefined,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone ?? undefined,
      isActive: doc.isActive,
      isVerified: doc.isVerified,
      isFirstTime: doc.isFirstTime,
      isBlocked: doc.isBlocked,
      blockedBy: doc.blockedBy ?? undefined,
      blockedAt: doc.blockedAt ?? undefined,
      lastLogin: doc.lastLogin ?? undefined,
      createdByAdmin: doc.createdByAdmin,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: ManagerEntity): Partial<IManagerDocument> {
    return {
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      isFirstTime: entity.isFirstTime,
      isBlocked: entity.isBlocked,
      blockedBy: entity.blockedBy,
      blockedAt: entity.blockedAt,
      lastLogin: entity.lastLogin,
      createdByAdmin: entity.createdByAdmin,
    }
  }
}
// ── Teacher ────────────────────────────────────────────
export class TeacherDocumentMapper {
  static toDomain(doc: ITeacherDocument): TeacherEntity {
    return TeacherEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash ?? undefined,
      firstName: doc.firstName,
      lastName: doc.lastName,
      dob: doc.dob ?? undefined,
      gender: doc.gender ?? undefined,
      phone: doc.phone ?? undefined,
      address: doc.address ?? undefined,
      hireDate: doc.hireDate ?? undefined,
      qualification: doc.qualification ?? undefined,
      designation: doc.designation ?? undefined,
      deptId: doc.deptId ?? undefined,
      isActive: doc.isActive,
      isVerified: doc.isVerified,
      isFirstTime: doc.isFirstTime,
      lastLogin: doc.lastLogin ?? undefined,
      createdBy: doc.createdBy,                  // ← must be here
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: TeacherEntity): Partial<ITeacherDocument> {
    return {
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dob: entity.dob,
      gender: entity.gender,
      phone: entity.phone,
      address: entity.address,
      hireDate: entity.hireDate,
      qualification: entity.qualification,
      designation: entity.designation,
      deptId: entity.deptId,
      isActive: entity.isActive,
      isVerified: entity.isVerified,
      isFirstTime: entity.isFirstTime,
      lastLogin: entity.lastLogin,
      createdBy: entity.createdBy,               // ← must be here
    }
  }
}

// ── Student ────────────────────────────────────────────
export class StudentDocumentMapper {
  static toDomain(doc: IStudentDocument): StudentEntity {
    return StudentEntity.create({
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      firstName: doc.firstName,
      lastName: doc.lastName,
      dob: doc.dob ?? undefined,
      gender: doc.gender ?? undefined,
      phone: doc.phone ?? undefined,
      address: doc.address ?? undefined,
      admissionDate: doc.admissionDate ?? undefined,
      guardianName: doc.guardianName ?? undefined,
      guardianContact: doc.guardianContact ?? undefined,
      classId: doc.classId ?? undefined,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: StudentEntity): Partial<IStudentDocument> {
    return {
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dob: entity.dob,
      gender: entity.gender,
      phone: entity.phone,
      address: entity.address,
      admissionDate: entity.admissionDate,
      guardianName: entity.guardianName,
      guardianContact: entity.guardianContact,
      classId: entity.classId,
      isActive: entity.isActive,
    };
  }
}
// ── Admin ────────────────────────────────────────────
export class AdminDocumentMapper {
  static toDomain(doc: IAdminDocument): AdminEntity {
    return AdminEntity.create({
      id: doc._id.toString(),
      googleId: doc.googleId,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      avatar: doc.avatar ?? undefined,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  static toPersistence(entity: AdminEntity): Partial<IAdminDocument> {
    return {
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      isActive: entity.isActive,
    };
  }
}

export class DepartmentDocumentMapper {
  static toDomain(doc: IDepartmentDocument): DepartmentEntity {
    return DepartmentEntity.create({
      id: doc._id.toString(),
      deptName: doc.deptName,
      deptHeadId: doc.deptHeadId ?? undefined,
      description: doc.description ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: DepartmentEntity): Partial<IDepartmentDocument> {
    return {
      deptName: entity.deptName,
      deptHeadId: entity.deptHeadId,
      description: entity.description,
    }
  }
}

export class SubjectDocumentMapper {
  static toDomain(doc: ISubjectDocument): SubjectEntity {
    return SubjectEntity.create({
      id: doc._id.toString(),
      subjectName: doc.subjectName,
      deptId: doc.deptId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: SubjectEntity): Partial<ISubjectDocument> {
    return {
      subjectName: entity.subjectName,
      deptId: entity.deptId,
    }
  }
}

export class ClassDocumentMapper {
  static toDomain(doc: IClassDocument): ClassEntity {
    return ClassEntity.create({
      id: doc._id.toString(),
      grade: doc.grade,
      section: doc.section,
      classTeacherId: doc.classTeacherId ?? undefined,
      subjectAllocations: doc.subjectAllocations.map((a) => ({
        subjectId: a.subjectId,
        teacherId: a.teacherId,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: ClassEntity): Partial<IClassDocument> {
    return {
      grade: entity.grade,
      section: entity.section,
      classTeacherId: entity.classTeacherId,
      subjectAllocations: entity.subjectAllocations,
    }
  }
}

export class ExamDocumentMapper {
  static toDomain(doc: IExamDocument): ExamEntity {
    return ExamEntity.create({
      id: doc._id.toString(),
      examName: doc.examName,
      examType: doc.examType as ExamType,
      academicYear: doc.academicYear,
      startDate: doc.startDate,
      endDate: doc.endDate,
      status: doc.status as ExamStatus,
      // gradeConfigs are plain sub-documents — map directly
      gradeConfigs: (doc.gradeConfigs ?? []).map((g) => ({
        grade: g.grade,
        commonSubjects: (g.commonSubjects ?? []).map((s) => ({
          subjectId: s.subjectId,
          examDate: s.examDate,
          startTime: s.startTime,
          endTime: s.endTime,
          totalMarks: s.totalMarks,
          passingMarks: s.passingMarks,
        })),
        sectionLanguages: (g.sectionLanguages ?? []).map((l) => ({
          classId: l.classId,
          subjectId: l.subjectId,
          examDate: l.examDate,
          startTime: l.startTime,
          endTime: l.endTime,
          totalMarks: l.totalMarks,
          passingMarks: l.passingMarks,
        })),
      })),
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(entity: ExamEntity): Partial<IExamDocument> {
    return {
      examName: entity.examName,
      examType: entity.examType,
      academicYear: entity.academicYear,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      gradeConfigs: entity.gradeConfigs as any,
      createdBy: entity.createdBy,
    }
  }
}

export class ExamScheduleDocumentMapper {
  static toDomain(doc: IExamScheduleDocument): ExamScheduleEntity {
    return ExamScheduleEntity.create({
      id: doc._id.toString(),
      examId: doc.examId,
      classId: doc.classId,
      subjectId: doc.subjectId,
      teacherId: doc.teacherId,
      examDate: doc.examDate,
      startTime: doc.startTime,
      endTime: doc.endTime,
      totalMarks: doc.totalMarks,
      passingMarks: doc.passingMarks,
      marksStatus: doc.marksStatus as MarksStatus,
      submittedAt: doc.submittedAt ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  static toPersistence(
    entity: ExamScheduleEntity,
  ): Partial<IExamScheduleDocument> {
    return {
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
}

export class MarksDocumentMapper {
  static toDomain(doc: IMarksDocument): MarksEntity {
    return MarksEntity.create({
      id: doc._id.toString(),
      examId: doc.examId,
      scheduleId: doc.scheduleId,
      studentId: doc.studentId,
      subjectId: doc.subjectId,
      classId: doc.classId,
      marksScored: doc.marksScored,
      totalMarks: doc.totalMarks,
      isAbsent: doc.isAbsent,
      gradedBy: doc.gradedBy,
      gradedAt: doc.gradedAt,
    })
  }

  static toPersistence(entity: MarksEntity): Partial<IMarksDocument> {
    return {
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