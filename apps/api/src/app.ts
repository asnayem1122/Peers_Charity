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
import sessionalRouter from './routes/sessional.routes';
import adminRouter from './routes/admin.routes';
import { errorHandler } from './middleware/error';

import { apiLimiter } from './middleware/rateLimit';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Policy with dynamic origin validation supporting Vercel and local dev
const allowedOrigins = [
  config.frontendUrl,
  config.corsOrigin,
  'http://localhost:3000',
  'http://localhost:3001',
]
  .flatMap((u) => (u ? u.split(',') : []))
  .map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, SSR)
      if (!origin) return callback(null, true);

      // Localhost check for development and tests
      if (config.env !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Check explicitly configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow all Vercel deployment domains (*.vercel.app)
      try {
        const parsedHost = new URL(origin).hostname;
        if (parsedHost.endsWith('.vercel.app') || parsedHost === 'localhost') {
          return callback(null, true);
        }
      } catch {
        // Invalid origin URL format
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'x-test-user-id',
      'x-test-user-email',
      'X-Requested-With',
    ],
  })
);

// Logger
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// 1. Mount Better Auth BEFORE generic body parsers
app.all('/api/auth/*', toNodeHandler(auth));

// 2. Static File Uploads Directory with strict security headers
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    dotfiles: 'deny',
    index: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
      res.setHeader('Content-Disposition', 'attachment');
    },
  })
);

// Apply API Rate Limiting to all /api endpoints
app.use('/api', apiLimiter);

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
app.use('/api/sessional', sessionalRouter);
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
