import { ManagerEntity } from '../../../domain/entities/manager.entity';
import { IBaseRepository, PaginationOptions } from './base.repository.interface';


export interface ManagerQueryDto extends PaginationOptions {
  isActive?:  boolean
  isBlocked?: boolean
  search?:    string
}
export interface IManagerRepository extends  IBaseRepository<ManagerEntity,ManagerQueryDto> {
  softDelete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<ManagerEntity | null>;
  existsByEmail(email: string): Promise<boolean>

}