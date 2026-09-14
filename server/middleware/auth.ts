import { Request, Response, NextFunction } from 'express';
import { verifyAdminTokenOrFirebaseToken, AdminUserPayload } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  adminUser?: AdminUserPayload;
}

/**
 * Authentication middleware for protected administrative endpoints
 * Validates Firebase ID tokens and confirms administrative authorization
 */
export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authorization token required. Please log into the BSEDRC Council Admin Portal.'
    });
    return;
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const authResult = await verifyAdminTokenOrFirebaseToken(token);
    if (!authResult.valid) {
      if (authResult.forbidden) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: authResult.message || 'Access denied: Your account is authenticated, but is not authorized as a Council Administrator.'
        });
        return;
      }

      res.status(401).json({
        success: false,
        error: 'InvalidToken',
        message: authResult.message || 'Admin session expired or invalid. Please re-authenticate via Firebase.'
      });
      return;
    }

    req.adminUser = authResult.user;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'Error verifying administrative authentication token.'
    });
  }
}

/**
 * Optional admin auth - if token is present, populates req.adminUser without blocking
 */
export async function optionalAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();
    try {
      const authResult = await verifyAdminTokenOrFirebaseToken(token);
      if (authResult.valid && authResult.user) {
        req.adminUser = authResult.user;
      }
    } catch {
      // non-blocking
    }
  }
  next();
}
