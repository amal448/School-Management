import { Gender } from "../enums";

export interface RegisterStudentDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianContact?: string;
  classId?: string;
  createdBy: string
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  guardianName?: string;
  guardianContact?: string;
}

export interface StudentResponseDto {
  id: string;
  email: string;
  role: 'STUDENT';
  firstName: string;
  lastName: string;
  fullName: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianContact?: string;
  classId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaginatedStudentsDto {
  data: StudentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentQueryDto {
  classId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
