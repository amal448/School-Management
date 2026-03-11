import { Manager } from '../../../domain/entities/manager.entity';

export interface IManagerRepository {
  save(manager: Manager): Promise<void>;
  findByEmail(email: string): Promise<Manager | null>;
}