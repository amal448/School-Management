// src/infrastructure/database/mongoose-client.database.ts
import mongoose from 'mongoose';
import { AppConfig } from '../../config/app.config';

export class MongooseClient {
  private static instance: MongooseClient;
  private isConnected = false;

  private constructor() {}

  static getInstance(): MongooseClient {
    if (!MongooseClient.instance) {
      MongooseClient.instance = new MongooseClient();
    }
    return MongooseClient.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected',     () => { console.info('[MongoDB] Connected'); this.isConnected = true; });
    mongoose.connection.on('disconnected',  () => { console.warn('[MongoDB] Disconnected'); this.isConnected = false; });
    mongoose.connection.on('error',    (e) => { console.error('[MongoDB] Error:', e.message); });

    await mongoose.connect(AppConfig.database.mongoUri, {
      dbName: AppConfig.database.dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    console.info('[MongoDB] Disconnected cleanly');
  }
}
