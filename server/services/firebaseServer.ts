import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { config } from '../config';

let serverApp: FirebaseApp;
let serverDb: Firestore;
let serverAuth: Auth;

try {
  const existingApps = getApps();
  const serverAppNamed = existingApps.find(a => a.name === 'bsedrc-server');

  if (serverAppNamed) {
    serverApp = serverAppNamed;
  } else {
    serverApp = initializeApp({
      projectId: config.firebase.projectId,
      appId: config.firebase.appId,
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId
    }, 'bsedrc-server');
  }

  serverDb = getFirestore(serverApp, config.firebase.firestoreDatabaseId);
  serverAuth = getAuth(serverApp);
  console.log(`[FIREBASE] Server initialized with Database ID: ${config.firebase.firestoreDatabaseId}`);
} catch (err: any) {
  console.warn('[FIREBASE] Server initialization warning:', err?.message || err);
}

export { 
  serverApp, 
  serverDb, 
  serverAuth,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  firestoreLimit,
  serverTimestamp 
};

export const FIRESTORE_COLLECTIONS = {
  STUDENTS: 'students',
  RESULTS: 'results',
  VACANCIES: 'vacancies',
  APPLICATIONS: 'applications',
  PAYMENTS: 'payments',
  CERTIFICATES: 'certificates',
  NOTIFICATIONS: 'notifications',
  CUSTOM_FORMS: 'custom_forms',
  FORM_SUBMISSIONS: 'form_submissions',
  GALLERY: 'gallery',
  ADMIN_CONFIG: 'admin_config',
  USERS: 'users'
} as const;
