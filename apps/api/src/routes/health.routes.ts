import { Router, Request, Response } from 'express';
import { config } from '../config/env.js';
import { checkDatabaseHealth } from '../config/database.js';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Peer's Charity API Health Check OK",
    data: {
      status: 'UP',
      service: "Peer's Charity API",
      environment: config.env,
      database: dbHealth.status,
      databaseLatencyMs: dbHealth.latencyMs,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
