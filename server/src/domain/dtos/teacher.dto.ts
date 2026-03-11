export interface CreateTeacherDto {
  name: string;
  email: string;
  password: string;
  assignedClassId?: string;
}