import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * Production Security headers and CORS middleware
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. CORS Configuration
  const origin = req.headers.origin;

  if (origin) {
    const isAllowed = config.cors.allowedOrigins.includes(origin) || 
      (!config.isProduction && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')));

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
  }

  // 2. Strict Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CSP: Allow container preview in AI Studio & Cloud Run while restricting malicious embedders
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app;"
  );

  // HSTS in production environments
  if (config.isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}

