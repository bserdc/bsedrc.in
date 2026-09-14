import { onRequest, HttpsOptions } from 'firebase-functions/v2/https';
import { createApiApp } from '../server/apiApp';

// 1. Initialize the Express API Application
const apiApp = createApiApp();

const functionOptions: HttpsOptions = {
  region: 'asia-south1',
  cors: true,
  maxInstances: 20,
  minInstances: 0,
  concurrency: 80,
  timeoutSeconds: 60,
  memory: '512MiB'
};

/**
 * Main Firebase Cloud Function (v2 HTTP)
 * Serves all /api endpoints for the BSEDRC Portal:
 * - /admin/login & /admin/reset-password
 * - /students (Registration, verification)
 * - /results (Board Examination results)
 * - /payment/order & /payment/verify
 * - /storage/* (Cloudflare R2 documents)
 * - /notifications, /gallery, /forms, /jobs
 * - /ai/assistant (Gemini AI queries)
 */
export const api = onRequest(functionOptions, apiApp);

/**
 * Dedicated Serverless Endpoint for Gemini AI Assistant
 */
export const aiAssistant = onRequest(functionOptions, (req, res) => {
  apiApp(req, res);
});

/**
 * Dedicated Serverless Endpoint for Razorpay Payment Orders & Verification
 */
export const paymentGateway = onRequest(functionOptions, (req, res) => {
  apiApp(req, res);
});
