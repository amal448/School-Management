
import { FilterQuery } from 'mongoose';
import { ManagerEntity } from '../../domain/entities/manager.entity';
import { ManagerModel, IManagerDocument } from '../database/schemas/manager.schema';
import { IManagerRepository } from 'src/application/ports/repositories/manager.repository.interface';
import { ManagerDocumentMapper } from './mappers';

// ── Manager Repository ─────────────────────────────────
export class MongooseManagerRepository implements IManagerRepository {
  
  
  async save(manager: ManagerEntity): Promise<ManagerEntity> {
    const doc = await ManagerModel.create(ManagerDocumentMapper.toPersistence(manager));
    return ManagerDocumentMapper.toDomain(doc);
  }

  async update(id: string, manager: ManagerEntity): Promise<ManagerEntity | null> {
    const doc = await ManagerModel.findByIdAndUpdate(
      id,
      { $set: ManagerDocumentMapper.toPersistence(manager) },
      { new: true, runValidators: true },
    );
    return doc ? ManagerDocumentMapper.toDomain(doc) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await ManagerModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    return !!doc;
  }

  async findById(id: string): Promise<ManagerEntity | null> {
    const doc = await ManagerModel.findById(id).lean<IManagerDocument>();
    return doc ? ManagerDocumentMapper.toDomain(doc as IManagerDocument) : null;
  }

  async findByEmail(email: string): Promise<ManagerEntity | null> {
    const doc = await ManagerModel.findOne({ email: email.toLowerCase() }).lean<IManagerDocument>();
    return doc ? ManagerDocumentMapper.toDomain(doc as IManagerDocument) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await ManagerModel.countDocuments({ email: email.toLowerCase() })) > 0;
  }
}
