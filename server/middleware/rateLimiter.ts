import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitBuckets = new Map<string, RateLimitRecord>();
const MAX_BUCKETS = 50000;

// Cleanup stale buckets every 60 seconds
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitBuckets.entries()) {
    if (now > val.resetTime) {
      rateLimitBuckets.delete(key);
    }
  }
}, 60000);
if (cleanupTimer.unref) cleanupTimer.unref();

/**
 * In-memory sliding window rate limiter with namespace isolation
 * @param namespace Isolated bucket prefix
 * @param windowMs Window in milliseconds
 * @param max Maximum requests allowed per window
 */
export function createRateLimiter(namespace: string, windowMs: number = 60000, max: number = 30) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Extract client IP safely
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwarded) 
      ? forwarded[0] 
      : typeof forwarded === 'string' 
        ? forwarded.split(',')[0].trim() 
        : req.socket.remoteAddress || 'unknown-ip';

    const cleanIp = rawIp.replace(/[^a-zA-Z0-9.:_-]/g, '');
    const bucketKey = `${namespace}:${cleanIp}`;
    const now = Date.now();

    // Prevent Map memory exhaustion
    if (rateLimitBuckets.size >= MAX_BUCKETS && !rateLimitBuckets.has(bucketKey)) {
      // Evict first 500 oldest entries
      let count = 0;
      for (const k of rateLimitBuckets.keys()) {
        rateLimitBuckets.delete(k);
        if (++count > 500) break;
      }
    }

    const record = rateLimitBuckets.get(bucketKey);

    if (!record || now > record.resetTime) {
      rateLimitBuckets.set(bucketKey, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }

    if (record.count >= max) {
      const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', waitSeconds.toString());
      res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: `Too many attempts from this IP connection. Please wait ${waitSeconds} seconds before trying again.`,
        retryAfter: waitSeconds
      });
      return;
    }

    record.count++;
    next();
  };
}

// 5 attempts per 15 minutes for authentication & password recovery
export const authRateLimiter = createRateLimiter('auth', 15 * 60 * 1000, 5);

// 10 order creates/verifications per 10 minutes
export const paymentRateLimiter = createRateLimiter('pay', 10 * 60 * 1000, 10);

// 15 queries per 5 minutes for AI Assistant
export const aiRateLimiter = createRateLimiter('ai', 5 * 60 * 1000, 15);

// 100 general requests per minute
export const apiGeneralLimiter = createRateLimiter('general', 60 * 1000, 100);

