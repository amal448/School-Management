import dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/school_db',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_super_secret_key',
    tokenExpiry: '1d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
};