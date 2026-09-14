import crypto from 'crypto';
import { config } from '../config';
import { adminApp, adminAuth } from './firebaseAdmin';
import { serverDb, doc, getDoc } from './firebaseServer';

export interface AdminUserPayload {
  username: string;
  email: string;
  role: string;
  organization: string;
  iat: number;
  exp: number;
  uid?: string;
}

export interface AdminAuthResult {
  valid: boolean;
  forbidden?: boolean;
  message?: string;
  user?: AdminUserPayload;
}

/**
 * Constant-time safe string equality to prevent timing attacks
 */
export function safeStringCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Timing attack resistance: still do a dummy compare
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generate a cryptographically signed HMAC token for Admin sessions
 */
export function generateAdminToken(user: { username: string; email: string; role: string; organization: string }): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours validity

  const payload: AdminUserPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
    organization: user.organization,
    iat,
    exp
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(payloadEncoded)
    .digest('base64url');

  return `bsedrc_v1.${payloadEncoded}.${signature}`;
}

/**
 * Verify and decode an admin token
 */
export function verifyAdminToken(token: string): AdminUserPayload | null {
  if (!token || typeof token !== 'string') return null;

  // Handle legacy simple tokens if present during transition
  if (token.startsWith('bsedrc_token_')) {
    try {
      const b64 = token.replace('bsedrc_token_', '');
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      const [username, timestampStr] = decoded.split(':');
      const ts = Number(timestampStr);
      // Valid for 24h
      if (Date.now() - ts < 24 * 60 * 60 * 1000) {
        return {
          username: username || 'admin',
          email: username.includes('@') ? username : config.admin.superUsername,
          role: 'Administrator',
          organization: config.board.name,
          iat: Math.floor(ts / 1000),
          exp: Math.floor((ts + 86400000) / 1000)
        };
      }
    } catch {
      // ignore
    }
  }

  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'bsedrc_v1') {
    return null;
  }

  const [, payloadEncoded, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(payloadEncoded)
    .digest('base64url');

  if (!safeStringCompare(signature, expectedSig)) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
    const payload: AdminUserPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Cryptographic password hashing using Node scrypt
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, effectiveSalt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: effectiveSalt
  };
}

/**
 * Constant-time password hash verification
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const expectedBuf = Buffer.from(hash, 'hex');
    if (derivedKey.length !== expectedBuf.length) {
      crypto.timingSafeEqual(derivedKey, derivedKey);
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Authorized Board Administrator Identifiers and Emails
 */
export const AUTHORIZED_ADMIN_EMAILS = [
  'bserdc.bihar@gmail.com',
  'adarshbiharsiksha@gmail.com',
  'anandsinghmdp8@gmail.com',
  'anandsinghks2014@gmail.com',
  'admin@bsedrc.in'
];

export const AUTHORIZED_ADMIN_IDENTIFIERS = [
  ...AUTHORIZED_ADMIN_EMAILS,
  'admin',
  'bserdc',
  'bserdc.bihar'
];

export function isAuthorizedAdminEmail(emailOrUser?: string): boolean {
  if (!emailOrUser) return false;
  const clean = emailOrUser.toLowerCase().trim();
  const superUser = config.admin.superUsername?.toLowerCase().trim();
  if (superUser && (clean === superUser || clean === superUser.split('@')[0])) return true;
  return AUTHORIZED_ADMIN_IDENTIFIERS.some(id => clean === id || clean === id.split('@')[0]);
}

/**
 * Checks whether a verified user UID, email, or token claims is an authorized Council Administrator
 */
export async function checkAdminAuthorization(uid: string, email: string, claims?: any): Promise<boolean> {
  const cleanEmail = (email || '').toLowerCase().trim();

  // 1. Verify against official council admin email whitelist
  if (cleanEmail && AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) {
    return true;
  }

  // 2. Verify custom claims in token
  if (claims && (claims.admin === true || claims.role === 'admin' || claims.role === 'Council Administrator')) {
    return true;
  }

  // 3. Verify in Firestore protected admins record (admins/{uid} or admins/{email})
  if (serverDb) {
    try {
      if (uid) {
        const uidDoc = await getDoc(doc(serverDb, 'admins', uid));
        if (uidDoc.exists()) return true;
      }
      if (cleanEmail) {
        const emailDoc = await getDoc(doc(serverDb, 'admins', cleanEmail));
        if (emailDoc.exists()) return true;
      }
    } catch (err) {
      console.warn('[AUTH] Error checking admin authorization record in Firestore:', err);
    }
  }

  return false;
}

/**
 * Verifies a Firebase ID Token using Firebase Admin SDK or Google Identity Toolkit fallback,
 * and checks admin authorization.
 */
export async function verifyFirebaseIdToken(token: string): Promise<AdminAuthResult> {
  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'Invalid token format.' };
  }

  // Attempt 1: Verify with Firebase Admin SDK
  try {
    if (adminAuth && typeof adminAuth.verifyIdToken === 'function') {
      const decoded = await adminAuth.verifyIdToken(token);
      const uid = decoded.uid;
      const email = (decoded.email || '').toLowerCase().trim();

      const isAuthorized = await checkAdminAuthorization(uid, email, decoded);
      if (!isAuthorized) {
        return {
          valid: false,
          forbidden: true,
          message: 'Access denied: User is authenticated but is not an authorized Council Administrator.'
        };
      }

      return {
        valid: true,
        user: {
          uid,
          username: email ? email.split('@')[0] : uid,
          email,
          role: 'Council Administrator',
          organization: config.board.name,
          iat: decoded.iat,
          exp: decoded.exp
        }
      };
    }
  } catch (adminErr: any) {
    // If token was expired or format error, log note and try fallback
    const errMsg = adminErr?.message || '';
    if (errMsg.includes('expired') || errMsg.includes('revoked')) {
      return { valid: false, message: 'Authentication session expired. Please log in again.' };
    }
  }

  // Attempt 2: Fallback using Google Identity Toolkit verification endpoint
  if (config.firebase.apiKey) {
    try {
      const resp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.firebase.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token })
        }
      );

      if (resp.ok) {
        const data = await resp.json();
        if (data.users && data.users[0]) {
          const fbUser = data.users[0];
          const uid = fbUser.localId;
          const email = (fbUser.email || '').toLowerCase().trim();
          let claims: any = {};
          if (fbUser.customAttributes) {
            try {
              claims = JSON.parse(fbUser.customAttributes);
            } catch {}
          }

          const isAuthorized = await checkAdminAuthorization(uid, email, claims);
          if (!isAuthorized) {
            return {
              valid: false,
              forbidden: true,
              message: 'Access denied: User is authenticated but is not an authorized Council Administrator.'
            };
          }

          return {
            valid: true,
            user: {
              uid,
              username: email ? email.split('@')[0] : uid,
              email,
              role: 'Council Administrator',
              organization: config.board.name,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 3600
            }
          };
        }
      }
    } catch (fetchErr) {
      console.warn('[AUTH] Google Identity Toolkit verification fallback failed:', fetchErr);
    }
  }

  return { valid: false, message: 'Token verification failed. Please re-authenticate.' };
}

/**
 * Universal token verifier: handles Firebase ID Tokens as primary authentication,
 * with graceful support for existing sessions.
 */
export async function verifyAdminTokenOrFirebaseToken(token: string): Promise<AdminAuthResult> {
  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'No authorization token provided.' };
  }

  // 1. Primary: Verify as Firebase ID Token (JWT with 3 base64url segments)
  if (token.split('.').length === 3 && !token.startsWith('bsedrc_v1.')) {
    return await verifyFirebaseIdToken(token);
  }

  // 2. Legacy server token check
  const legacyUser = verifyAdminToken(token);
  if (legacyUser) {
    return { valid: true, user: legacyUser };
  }

  // Also try Firebase ID token if other formats failed
  return await verifyFirebaseIdToken(token);
}
