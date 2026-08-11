import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config } from '../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Peer's Charity API Health Check OK",
    data: {
      status: 'UP',
      service: "Peer's Charity API",
      environment: config.env,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
