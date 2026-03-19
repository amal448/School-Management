// src/infrastructure/repositories/admin.repository.ts
import { IAdminRepository } from 'src/application/ports/repositories/admin.repository.interface'
import { AdminEntity } from 'src/domain/entities/admin.entity'
import { AdminModel, IAdminDocument } from 'src/infrastructure/database/schemas/admin.schema'
import { AdminWhitelistModel } from 'src/infrastructure/database/schemas/admin-whitelist.schema'

export class MongooseAdminRepository implements IAdminRepository {

  async save(admin: AdminEntity): Promise<AdminEntity> {
    const doc = await AdminModel.create({
      googleId:     admin.googleId,
      email:        admin.email,
      passwordHash: admin.passwordHash,
      firstName:    admin.firstName,
      lastName:     admin.lastName,
      avatar:       admin.avatar,
      isActive:     admin.isActive,
      isVerified:   admin.isVerified,
      lastLogin:    admin.lastLogin,
    })
    return this.toDomain(doc)
  }

  async update(id: string, admin: AdminEntity): Promise<AdminEntity | null> {
    const doc = await AdminModel.findByIdAndUpdate(
      id,
      { $set: {
        firstName:    admin.firstName,
        lastName:     admin.lastName,
        avatar:       admin.avatar,
        passwordHash: admin.passwordHash,
        isActive:     admin.isActive,
        isVerified:   admin.isVerified,
        lastLogin:    admin.lastLogin,
      }},
      { new: true },
    )
    return doc ? this.toDomain(doc) : null
  }

  async findById(id: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findById(id).lean<IAdminDocument>()
    return doc ? this.toDomain(doc as IAdminDocument) : null
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findOne({ email: email.toLowerCase() }).lean<IAdminDocument>()
    return doc ? this.toDomain(doc as IAdminDocument) : null
  }

  async findByGoogleId(googleId: string): Promise<AdminEntity | null> {
    const doc = await AdminModel.findOne({ googleId }).lean<IAdminDocument>()
    return doc ? this.toDomain(doc as IAdminDocument) : null
  }

  async findAll(): Promise<AdminEntity[]> {
    const docs = await AdminModel.find().lean<IAdminDocument[]>()
    return (docs as IAdminDocument[]).map(d => this.toDomain(d))
  }

  async softDelete(id: string): Promise<boolean> {
    const doc = await AdminModel.findByIdAndUpdate(
      id, { $set: { isActive: false } }, { new: true }
    )
    return !!doc
  }

  // ── Whitelist ────────────────────────────────────
  async isEmailWhitelisted(email: string, role: 'admin' | 'manager'): Promise<boolean> {
    const entry = await AdminWhitelistModel.findOne({
      email: email.toLowerCase(),
      role,
    })
    return !!entry
  }

  async addToWhitelist(
    email: string,
    role: 'admin' | 'manager',
    addedBy: string,
  ): Promise<void> {
    await AdminWhitelistModel.create({
      email: email.toLowerCase(),
      role,
      addedBy,
    })
  }

  async removeFromWhitelist(email: string): Promise<void> {
    await AdminWhitelistModel.deleteOne({ email: email.toLowerCase() })
  }

  // ── Private mapper ────────────────────────────────
  private toDomain(doc: IAdminDocument): AdminEntity {
    return AdminEntity.create({
      id:           doc._id.toString(),
      googleId:     doc.googleId     ?? undefined,
      email:        doc.email,
      passwordHash: doc.passwordHash ?? undefined,
      firstName:    doc.firstName,
      lastName:     doc.lastName,
      avatar:       doc.avatar       ?? undefined,
      isActive:     doc.isActive,
      isVerified:   doc.isVerified,
      lastLogin:    doc.lastLogin    ?? undefined,
      createdAt:    doc.createdAt,
      updatedAt:    doc.updatedAt,
    })
  }
}