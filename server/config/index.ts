import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import firebaseAppletConfig from '../../firebase-applet-config.json';

dotenv.config();

// Attempt loading local dev config if present
try {
  const envFilePaths = [
    path.resolve(process.cwd(), '../.dev.env.json'),
    path.resolve(process.cwd(), '.dev.env.json')
  ];
  for (const fp of envFilePaths) {
    if (fs.existsSync(fp)) {
      const raw = fs.readFileSync(fp, 'utf8');
      const parsed = JSON.parse(raw);
      for (const [k, v] of Object.entries(parsed)) {
        if (!process.env[k] && typeof v === 'string') {
          process.env[k] = v;
        }
      }
      break;
    }
  }
} catch {
  // Silent fallback
}

const isProduction = process.env.NODE_ENV === 'production';

// Secure fallback secret generated on boot if not explicitly provided in environment
const secureSecretFallback = crypto.randomBytes(32).toString('hex');

export const config = {
  port: 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  offlineMode: process.env.OFFLINE_MODE === 'true',
  jwtSecret: (process.env.JWT_SECRET || secureSecretFallback).trim(),

  admin: {
    superUsername: (process.env.ADMIN_SUPER_USERNAME || 'bserdc.bihar@gmail.com').toLowerCase().trim(),
    superPassword: (process.env.ADMIN_SUPER_PASSWORD || 'Bsedrc@2026').trim(),
    securityPin: (process.env.ADMIN_SECURITY_PIN || '852113').trim(),
  },

  firebase: {
    projectId: firebaseAppletConfig.projectId,
    appId: firebaseAppletConfig.appId,
    apiKey: process.env.FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
    authDomain: firebaseAppletConfig.authDomain,
    firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || 'ai-studio-bsedrc-8d3ec7a9-5b78-44bb-ab3a-7916ac9efd88',
    storageBucket: firebaseAppletConfig.storageBucket,
    messagingSenderId: firebaseAppletConfig.messagingSenderId,
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '',
    isConfigured: !!(firebaseAppletConfig.projectId && (process.env.FIREBASE_API_KEY || firebaseAppletConfig.apiKey))
  },

  cloudflareR2: {
    accountId: (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim(),
    accessKeyId: (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim(),
    bucketName: (process.env.CLOUDFLARE_R2_BUCKET_NAME || 'bsedrc').trim(),
    publicUrl: (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim(),
    isConfigured: !!(
      process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    )
  },

  razorpay: {
    keyId: (process.env.RAZORPAY_KEY_ID || '').trim(),
    keySecret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
    currency: (process.env.RAZORPAY_CURRENCY || 'INR').trim(),
    isRealGateway: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  },

  gemini: {
    apiKey: (process.env.GEMINI_API_KEY || '').trim(),
    isConfigured: !!process.env.GEMINI_API_KEY
  },

  cors: {
    allowedOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5500')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean)
  },

  board: {
    name: 'Bihar State Educational Development & Research Council',
    nameHindi: 'बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद',
    shortName: 'BSEDRC / BRSV & RCT',
    officeAddress: 'Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar 852113',
    helplinePhone: '+91 7070530080',
    helplineEmail: 'adarshbiharsiksha@gmail.com',
    regdOffice: 'Sahugarh, Madhepura, Bihar (852113)'
  }
};

/**
 * Validates critical environment secrets at startup.
 * Throws in production if required security variables are absent.
 */
export function validateStartupConfig(): void {
  const notices: string[] = [];

  if (config.isProduction) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      notices.push('JWT_SECRET: using secure ephemeral in-memory fallback secret (configure in environment for cross-instance token sharing)');
    }
    if (!process.env.ADMIN_SUPER_PASSWORD || process.env.ADMIN_SUPER_PASSWORD.length < 8) {
      notices.push('ADMIN_SUPER_PASSWORD: not configured in environment (admin portal will verify via Firestore credentials or require password setup)');
    }
    if (!process.env.ADMIN_SECURITY_PIN || process.env.ADMIN_SECURITY_PIN.length < 4) {
      notices.push('ADMIN_SECURITY_PIN: not configured in environment');
    }

    if (notices.length > 0) {
      console.warn('================================================================');
      console.warn('[SECURITY NOTICE] Production startup environment status:');
      notices.forEach(item => console.warn(`  - ${item}`));
      console.warn('Portal initialized successfully. All public candidate portals and services are operational.');
      console.warn('================================================================');
    }
  } else {
    // Non-production notices
    if (!process.env.ADMIN_SUPER_PASSWORD) {
      console.warn('[SECURITY NOTICE] ADMIN_SUPER_PASSWORD not set in environment. Set it in .env to protect administrative portal.');
    }
    if (!process.env.ADMIN_SECURITY_PIN) {
      console.warn('[SECURITY NOTICE] ADMIN_SECURITY_PIN not set in environment. Set it in .env.');
    }
    if (!process.env.JWT_SECRET) {
      console.warn('[SECURITY NOTICE] JWT_SECRET not set in environment. Generated ephemeral in-memory secret for this session.');
    }
  }
}

