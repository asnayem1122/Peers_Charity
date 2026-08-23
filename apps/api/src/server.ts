import app from './app';
import { connectDatabase } from './config/database';
import { config } from './config/env';

const startServer = async () => {
  console.log(`[Server] Starting Peer's Charity API server...`);
  
  // Connect Database
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`[Server] Running on ${config.apiUrl}`);
    console.log(`[Server] Health check: ${config.apiUrl}/api/health`);
    console.log(`[Server] Better Auth: ${config.apiUrl}/api/auth/*`);
  });

  const shutdown = async () => {
    console.log(`\n[Server] Shutting down gracefully...`);
    server.close(() => {
      console.log(`[Server] HTTP server closed.`);
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer();
