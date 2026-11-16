import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

/**
 * Redacts passwords and credentials from connection strings for safe logging
 */
export const maskConnectionString = (uri: string): string => {
  return uri.replace(/:([^@/:]+)@/, ':****@');
};

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      minPoolSize: 2,
      heartbeatFrequencyMS: 10000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`\n=============================================================`);
    console.warn(`[Database] ⚠️  MongoDB Connection Warning:`);
    console.warn(`Unable to connect to MongoDB at ${maskConnectionString(config.mongodbUri)}`);
    console.warn(`Reason: ${error.message || 'ECONNREFUSED'}`);
    console.warn(`Tip: Start local MongoDB service or set MONGODB_URI in apps/api/.env to your MongoDB Atlas cluster URI.`);
    console.warn(`=============================================================\n`);
    
    if (config.env === 'production') {
      process.exit(1);
    }
    return false;
  }
};

/**
 * Performs an active non-blocking health probe ping against MongoDB
 */
export const checkDatabaseHealth = async (): Promise<{ status: string; latencyMs: number }> => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    const states: Record<number, string> = { 0: 'disconnected', 2: 'connecting', 3: 'disconnecting' };
    return { status: states[mongoose.connection.readyState] || 'disconnected', latencyMs: -1 };
  }
  const start = Date.now();
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', latencyMs: Date.now() - start };
  } catch {
    return { status: 'degraded', latencyMs: Date.now() - start };
  }
};
