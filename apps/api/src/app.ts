import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth/auth';
import { config } from './config/env';
import healthRouter from './routes/health.routes';
import userRouter from './routes/user.routes';
import taxonomyRouter from './routes/taxonomy.routes';
import resourceRouter from './routes/resource.routes';
import engagementRouter from './routes/engagement.routes';
import examRouter from './routes/exam.routes';
import adminRouter from './routes/admin.routes';
import { errorHandler } from './middleware/error';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Policy
app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// Logger
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// 1. Mount Better Auth BEFORE generic body parsers
app.all('/api/auth/*', toNodeHandler(auth));

// 2. Static File Uploads Directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 3. Generic Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. API Routes
app.use('/api', healthRouter);
app.use('/api/users', userRouter);
app.use('/api/taxonomy', taxonomyRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/engagement', engagementRouter);
app.use('/api/exam-mode', examRouter);
app.use('/api/admin', adminRouter);

// 5. Fallback 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Endpoint not found: ${req.method} ${req.url}`,
  });
});

// 6. Global Error Handler
app.use(errorHandler);

export default app;
