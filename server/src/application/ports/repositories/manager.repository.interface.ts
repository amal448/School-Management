import { ManagerQueryDto } from 'src/domain/dtos/manager.dto';
import { ManagerEntity } from '../../../domain/entities/manager.entity';
import { PaginatedResult } from 'src/shared/types/Pagination-type';

export interface IManagerRepository {
  save(manager: ManagerEntity): Promise<ManagerEntity>;
  update(id: string, manager: ManagerEntity): Promise<ManagerEntity | null>;
  softDelete(id: string): Promise<boolean>;
  findById(id: string): Promise<ManagerEntity | null>;
  findByEmail(email: string): Promise<ManagerEntity | null>;

  findByGoogleId(googleId: string): Promise<ManagerEntity | null>
  findAll(query: ManagerQueryDto): Promise<PaginatedResult<ManagerEntity>>
  existsByEmail(email: string): Promise<boolean>

}