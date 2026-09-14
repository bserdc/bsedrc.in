import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { config } from '../config';

let adminApp: App;
let adminAuth: Auth;
let adminFirestore: Firestore;

try {
  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(creds),
        projectId: config.firebase.projectId
      });
    } catch {
      adminApp = initializeApp({
        projectId: config.firebase.projectId
      });
    }
  } else {
    adminApp = initializeApp({
      projectId: config.firebase.projectId
    });
  }

  adminAuth = getAuth(adminApp);
  adminFirestore = getFirestore(adminApp);
} catch (err: any) {
  console.warn('[FIREBASE ADMIN] Initialization warning:', err?.message || err);
  adminApp = (getApps()[0] || {}) as App;
  try {
    adminAuth = getAuth(adminApp);
    adminFirestore = getFirestore(adminApp);
  } catch {
    // fallback
  }
}

export { adminApp, adminAuth, adminFirestore };

