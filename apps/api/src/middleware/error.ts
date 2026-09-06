import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  if (err.name === 'MulterError' || err.message?.includes('Forbidden file extension')) {
    statusCode = 400;
  }
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${req.method} ${req.url} - ${statusCode}: ${message}`);
  if (err.stack && config.env === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(err.code && { code: err.code }),
    ...(err.details && { details: err.details }),
    ...(config.env === 'development' && { stack: err.stack }),
  });
};
