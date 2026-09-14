import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * Standardized global error handler
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[SERVER ERROR] ${req.method} ${req.url} ->`, err);

  res.status(status).json({
    success: false,
    error: err.name || 'ServerError',
    message: config.isProduction && status === 500 ? 'An unexpected server error occurred. Please try again later.' : message,
    timestamp: new Date().toISOString()
  });
}
