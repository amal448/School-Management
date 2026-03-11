export interface CreateManagerDto {
  name: string;
  email: string;
  password: string;
}

export interface ManagerResponseDto {
  id: string;
  name: string;
  email: string;
}