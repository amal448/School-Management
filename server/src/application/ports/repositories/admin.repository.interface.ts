import { AdminEntity } from 'src/domain/entities/admin.entity';

export interface IAdminRepository {
  save(admin: AdminEntity): Promise<AdminEntity>;
  update(id: string, admin: AdminEntity): Promise<AdminEntity | null>;
  findById(id: string): Promise<AdminEntity | null>;
  findByEmail(email: string): Promise<AdminEntity | null>;
  findByGoogleId(googleId: string): Promise<AdminEntity | null>;
  isEmailWhitelisted(email: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
}