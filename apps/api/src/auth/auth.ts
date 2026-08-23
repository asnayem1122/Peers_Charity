import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';
import { config } from '../config/env';
import { connectDatabase } from '../config/database';

// Attempt DB connection on startup
await connectDatabase();

// Safely retrieve database or fallback if offline
const getDbInstance = () => {
  if (mongoose.connection && mongoose.connection.db) {
    return mongoose.connection.db;
  }
  return { collection: () => ({ findOne: () => null, insertOne: () => null }) } as any;
};

export const auth = betterAuth({
  database: mongodbAdapter(getDbInstance()),
  emailAndPassword: {
    enabled: true,
  },
  secret: config.betterAuthSecret,
  baseURL: config.betterAuthUrl,
  trustedOrigins: [config.frontendUrl, 'http://localhost:3000'],
  advanced: {
    useSecureCookies: config.env === 'production',
  },
});
