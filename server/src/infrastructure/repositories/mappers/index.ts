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

// ── Manager ────────────────────────────────────────────
export class ManagerDocumentMapper {
  static toDomain(doc: IManagerDocument): ManagerEntity {
    return ManagerEntity.create({
      id:        doc._id.toString(),
      email:     doc.email,
      passwordHash: doc.passwordHash,
      firstName: doc.firstName,
      lastName:  doc.lastName,
      phone:     doc.phone ?? undefined,
      isActive:  doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: ManagerEntity): Partial<IManagerDocument> {
    return {
      email:        entity.email,
      passwordHash: entity.passwordHash,
      firstName:    entity.firstName,
      lastName:     entity.lastName,
      phone:        entity.phone,
      isActive:     entity.isActive,
    };
  }
}

// ── Teacher ────────────────────────────────────────────
export class TeacherDocumentMapper {
  static toDomain(doc: ITeacherDocument): TeacherEntity {
    return TeacherEntity.create({
      id:            doc._id.toString(),
      email:         doc.email,
      passwordHash:  doc.passwordHash,
      firstName:     doc.firstName,
      lastName:      doc.lastName,
      dob:           doc.dob ?? undefined,
      gender:        doc.gender ?? undefined,
      phone:         doc.phone ?? undefined,
      address:       doc.address ?? undefined,
      hireDate:      doc.hireDate ?? undefined,
      qualification: doc.qualification ?? undefined,
      designation:   doc.designation ?? undefined,
      deptId:        doc.deptId ?? undefined,
      isActive:      doc.isActive,
      createdAt:     doc.createdAt,
      updatedAt:     doc.updatedAt,
    });
  }

  static toPersistence(entity: TeacherEntity): Partial<ITeacherDocument> {
    return {
      email:         entity.email,
      passwordHash:  entity.passwordHash,
      firstName:     entity.firstName,
      lastName:      entity.lastName,
      dob:           entity.dob,
      gender:        entity.gender,
      phone:         entity.phone,
      address:       entity.address,
      hireDate:      entity.hireDate,
      qualification: entity.qualification,
      designation:   entity.designation,
      deptId:        entity.deptId,
      isActive:      entity.isActive,
    };
  }
}

// ── Student ────────────────────────────────────────────
export class StudentDocumentMapper {
  static toDomain(doc: IStudentDocument): StudentEntity {
    return StudentEntity.create({
      id:              doc._id.toString(),
      email:           doc.email,
      passwordHash:    doc.passwordHash,
      firstName:       doc.firstName,
      lastName:        doc.lastName,
      dob:             doc.dob ?? undefined,
      gender:          doc.gender ?? undefined,
      phone:           doc.phone ?? undefined,
      address:         doc.address ?? undefined,
      admissionDate:   doc.admissionDate ?? undefined,
      guardianName:    doc.guardianName ?? undefined,
      guardianContact: doc.guardianContact ?? undefined,
      classId:         doc.classId ?? undefined,
      isActive:        doc.isActive,
      createdAt:       doc.createdAt,
      updatedAt:       doc.updatedAt,
    });
  }

  static toPersistence(entity: StudentEntity): Partial<IStudentDocument> {
    return {
      email:           entity.email,
      passwordHash:    entity.passwordHash,
      firstName:       entity.firstName,
      lastName:        entity.lastName,
      dob:             entity.dob,
      gender:          entity.gender,
      phone:           entity.phone,
      address:         entity.address,
      admissionDate:   entity.admissionDate,
      guardianName:    entity.guardianName,
      guardianContact: entity.guardianContact,
      classId:         entity.classId,
      isActive:        entity.isActive,
    };
  }
}
// ── Admin ────────────────────────────────────────────
export class AdminDocumentMapper {
 static toDomain(doc: IAdminDocument): AdminEntity {
    return AdminEntity.create({
      id:        doc._id.toString(),
      googleId:  doc.googleId,
      email:     doc.email,
      firstName: doc.firstName,
      lastName:  doc.lastName,
      avatar:    doc.avatar ?? undefined,
      isActive:  doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  static toPersistence(entity: AdminEntity): Partial<IAdminDocument> {
    return {
      email:           entity.email,
      firstName:       entity.firstName,
      lastName:        entity.lastName,
      isActive:        entity.isActive,
    };
  }
}

