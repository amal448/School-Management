import { AdminEntity } from 'src/domain/entities/admin.entity';

export interface IAdminRepository {
  save(admin: AdminEntity): Promise<AdminEntity>;
  update(id: string, admin: AdminEntity): Promise<AdminEntity | null>;
  findById(id: string): Promise<AdminEntity | null>;
  findByEmail(email: string): Promise<AdminEntity | null>;
  findByGoogleId(googleId: string): Promise<AdminEntity | null>;
  findAll(): Promise<AdminEntity[]>;                              // ← add
  isEmailWhitelisted(email: string): Promise<boolean>;
  addToWhitelist(email: string, addedBy: string): Promise<void>; // ← add
  softDelete(id: string): Promise<boolean>;
}