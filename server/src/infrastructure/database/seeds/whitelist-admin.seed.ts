// src/infrastructure/database/seeds/whitelist-admin.seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdminWhitelistModel } from 'src/infrastructure/database/schemas/admin-whitelist.schema';

dotenv.config();

async function seedWhitelist(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: process.env.DB_NAME ?? 'edumanage',
  });

  console.log('[Whitelist] Connected to MongoDB');

  const email = process.env.SEED_ADMIN_EMAIL;

  if (!email) {
    console.error('[Whitelist] SEED_ADMIN_EMAIL is not set in .env');
    await mongoose.disconnect();
    process.exit(1);
  }

  const exists = await AdminWhitelistModel.findOne({ email });

  if (exists) {
    console.log(`[Whitelist] Already whitelisted: ${email}`);
    await mongoose.disconnect();
    return;
  }

  await AdminWhitelistModel.create({
    email,
    addedBy: 'system',
  });

  console.log(`[Whitelist] Successfully whitelisted: ${email}`);
  await mongoose.disconnect();
}

seedWhitelist().catch((err) => {
  console.error('[Whitelist] Seed failed:', err);
  process.exit(1);
});