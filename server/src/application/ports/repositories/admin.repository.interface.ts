// src/application/ports/repositories/admin.repository.interface.ts
import { AdminEntity } from 'src/domain/entities/admin.entity'

export interface IAdminRepository {
  save(admin: AdminEntity): Promise<AdminEntity>
  update(id: string, admin: AdminEntity): Promise<AdminEntity | null>
  findById(id: string): Promise<AdminEntity | null>
  findByEmail(email: string): Promise<AdminEntity | null>
  findByGoogleId(googleId: string): Promise<AdminEntity | null>
  findAll(): Promise<AdminEntity[]>
  softDelete(id: string): Promise<boolean>

  // Whitelist
  isEmailWhitelisted(email: string, role: 'admin' | 'manager'): Promise<boolean>
  addToWhitelist(email: string, role: 'admin' | 'manager', addedBy: string): Promise<void>
  removeFromWhitelist(email: string): Promise<void>
}