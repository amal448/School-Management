import { ManagerEntity } from '../../../domain/entities/manager.entity';

export interface IManagerRepository {
  save(manager: ManagerEntity): Promise<ManagerEntity>;
  update(id: string, manager: ManagerEntity): Promise<ManagerEntity | null>;
  softDelete(id: string): Promise<boolean>;
  findById(id: string): Promise<ManagerEntity | null>;
  findByEmail(email: string): Promise<ManagerEntity | null>;
  existsByEmail(email: string): Promise<boolean>;
}