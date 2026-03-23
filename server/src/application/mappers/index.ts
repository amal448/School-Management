import { ManagerEntity } from "../../domain/entities/manager.entity";
import { TeacherEntity } from "../../domain/entities/teacher.entity";
import { StudentEntity } from "../../domain/entities/student.entity";
import { ManagerResponseDto, } from "../../domain/dtos/manager.dto";
import { TeacherResponseDto } from "../../domain/dtos/teacher.dto";
import { StudentResponseDto } from "../../domain/dtos/student.dto";
import { AdminEntity } from "src/domain/entities/admin.entity";
import { AdminResponseDto } from "src/domain/dtos/admin.dto";
import { DepartmentEntity } from "src/domain/entities/department.entity";
import { DepartmentResponseDto } from "src/domain/dtos/department.dto";
import { SubjectEntity } from "src/domain/entities/subject.entity";
import { SubjectResponseDto } from "src/domain/dtos/subject.dto";
import { ClassEntity } from "src/domain/entities/class.entity";
import { ClassResponseDto } from "src/domain/dtos/class.dto";




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
      deptId: e.deptId,
      isActive: e.isActive,
      createdAt: e.createdAt,
    };
  }

  static toDtoList(entities: TeacherEntity[]): TeacherResponseDto[] {
    return entities.map(this.toDto);
  }
}

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
    };
  }

  static toDtoList(entities: StudentEntity[]): StudentResponseDto[] {
    return entities.map(this.toDto);
  }
}

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

export class ClassMapper {
  static toDto(entity: ClassEntity): ClassResponseDto {
    return {
      id:                 entity.id!,
      className:          entity.className,
      section:            entity.section,
      classTeacherId:     entity.classTeacherId,
      subjectAllocations: entity.subjectAllocations,
      createdAt:          entity.createdAt,
      updatedAt:          entity.updatedAt,
    }
  }
}