import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/peers_charity',
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || 'peers_charity_super_secret_key_32_characters_minimum_len',
  betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  storageBucket: process.env.STORAGE_BUCKET || 'peers-charity-local',
  universityEmailDomains: (process.env.UNIVERSITY_EMAIL_DOMAINS || '@university.edu,@student.university.edu').split(','),
};
