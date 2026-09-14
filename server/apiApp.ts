import express, { Express } from 'express';
import { securityMiddleware } from './middleware/security';
import { apiGeneralLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes/api.routes';
import { validateStartupConfig } from './config';

/**
 * Creates the official BSEDRC REST API Express Application.
 * Usable both as standalone Express server and exported as a Firebase Cloud Function (onRequest).
 */
export function createApiApp(): Express {
  validateStartupConfig();

  const app = express();
  app.disable('x-powered-by');

  // 1. Security & CORS middleware
  app.use(securityMiddleware);

  // 2. Request body parsing (up to 15mb for documents/photos)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // 3. General Rate Limiter
  app.use(apiGeneralLimiter);

  // 4. Mount API Routes on both '/api' and '/'
  // Ensures seamless operation whether invoked directly, via /api rewrite, or inside Firebase Cloud Functions
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // 5. Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}
