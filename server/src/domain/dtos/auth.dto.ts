import { AdminResponseDto } from "./admin.dto";
import { ManagerResponseDto } from "./manager.dto";
import { StudentResponseDto } from "./student.dto";
import { TeacherResponseDto } from "./teacher.dto";

export interface LoginDto {
  email: string;
  password: string;
  role: 'MANAGER' | 'TEACHER' | 'STUDENT';
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user:AdminResponseDto | ManagerResponseDto | TeacherResponseDto | StudentResponseDto;
}
