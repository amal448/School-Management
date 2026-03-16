
export interface RegisterManagerDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateManagerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ManagerResponseDto {
  id: string;
  email: string;
  role: 'MANAGER';
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}