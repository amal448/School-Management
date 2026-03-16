import { Gender } from "../enums";

export interface RegisterTeacherDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  hireDate?: string;
  qualification?: string;
  designation?: string;
  deptId?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  qualification?: string;
  designation?: string;
}

export interface TeacherResponseDto {
  id: string;
  email: string;
  role: 'TEACHER';
  firstName: string;
  lastName: string;
  fullName: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  address?: string;
  hireDate?: string;
  qualification?: string;
  designation?: string;
  deptId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaginatedTeachersDto {
  data: TeacherResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TeacherQueryDto {
  deptId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
