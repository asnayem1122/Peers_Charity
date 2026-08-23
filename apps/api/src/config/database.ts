import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`\n=============================================================`);
    console.warn(`[Database] ⚠️  MongoDB Connection Warning:`);
    console.warn(`Unable to connect to MongoDB at ${config.mongodbUri}`);
    console.warn(`Reason: ${error.message || 'ECONNREFUSED'}`);
    console.warn(`Tip: Start local MongoDB service or set MONGODB_URI in apps/api/.env to your MongoDB Atlas cluster URI.`);
    console.warn(`=============================================================\n`);
    
    if (config.env === 'production') {
      process.exit(1);
    }
    return false;
  }
};
