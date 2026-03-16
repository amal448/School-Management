import { AdminModel, IAdminDocument } from 'src/infrastructure/database/schemas/admin.schema';
import { AdminWhitelistModel } from 'src/infrastructure/database/schemas/admin-whitelist.schema';
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface';
import { AdminEntity } from 'src/domain/entities/admin.entity';
import { AdminDocumentMapper } from './mappers';

export class MongooseAdminRepository implements IAdminRepository {

  async save(admin: AdminEntity): Promise<AdminEntity> {
    const doc = await AdminModel.create({
      googleId: admin.googleId,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      avatar: admin.avatar,
      isActive: admin.isActive,
    });
    return AdminDocumentMapper.toDomain(doc);
  }

  async findAll(): Promise<AdminEntity[]> {
    const docs = await AdminModel.find().lean<IAdminDocument[]>();
    return (docs as IAdminDocument[]).map(doc => AdminDocumentMapper.toDomain(doc));
  }

  async addToWhitelist(email: string, addedBy: string): Promise<void> {
    await AdminWhitelistModel.create({
      email: email.toLowerCase(),
      addedBy,
    });
  }
  async update(id: string, admin: AdminEntity): Promise<AdminEntity | null> {
    const doc = await AdminModel.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          avatar: admin.avatar,
          isActive: admin.isActive,
        },
      },
      { new: true },
    );
    return doc ? AdminDocumentMapper.toDomain(doc) : null;
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findById(id).lean<IAdminDocument>();
    return doc ? AdminDocumentMapper.toDomain(doc as IAdminDocument) : null;
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findOne({ email: email.toLowerCase() }).lean<IAdminDocument>();
    return doc ? AdminDocumentMapper.toDomain(doc as IAdminDocument) : null;
  }

  async findByGoogleId(googleId: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findOne({ googleId }).lean<IAdminDocument>();
    return doc ? AdminDocumentMapper.toDomain(doc as IAdminDocument) : null;
  }

  async isEmailWhitelisted(email: string): Promise<boolean> {
    const entry = await AdminWhitelistModel.findOne({ email: email.toLowerCase() });
    return !!entry;
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await AdminModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );
    return !!doc;
  }

}