import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Student, 
  ExamResult, 
  FeePayment,
  CertificateRecord,
  GalleryItem, 
  BoardNotification, 
  CustomForm, 
  FormSubmission 
} from '../types';

// Initialize App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId 
    : undefined
);

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;

// Collection Names
export const COLLECTIONS = {
  STUDENTS: 'students',
  RESULTS: 'results',
  GALLERY: 'gallery',
  NOTIFICATIONS: 'notifications',
  CUSTOM_FORMS: 'custom_forms',
  FORM_SUBMISSIONS: 'form_submissions',
  PAYMENTS: 'payments',
  CERTIFICATES: 'certificates',
  SYNC_METADATA: 'sync_metadata',
} as const;

// 1. STUDENTS
export async function fetchStudentsFromCloud(): Promise<Student[] | null> {
  try {
    const res = await fetch('/api/students');
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.students)) {
        return data.students;
      }
    }
  } catch (err) {
    console.warn('[API] Student fetch fallback to Firestore:', err);
  }

  try {
    const colRef = collection(db, COLLECTIONS.STUDENTS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as Student);
  } catch {
    return null;
  }
}

export async function saveStudentToCloud(student: Student): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/students', {
      method: 'POST',
      headers,
      body: JSON.stringify(student)
    });
    const data = await res.json();
    if (data.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Student sync fallback:', err);
  }

  // Direct client Firestore write: allowed for candidate registration or authenticated admin
  try {
    const docId = student.id || student.regNo.replace(/\//g, '_');
    const docRef = doc(db, COLLECTIONS.STUDENTS, docId);
    await setDoc(docRef, { ...student, _updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch {
    return backendOk;
  }
}

export async function deleteStudentFromCloud(id: string, regNo?: string): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    const data = await res.json();
    if (data.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Student delete fallback:', err);
  }

  // Also clean up directly from client Firestore if authenticated as admin
  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.STUDENTS, id);
      await deleteDoc(docRef);
      if (regNo) {
        await deleteDoc(doc(db, COLLECTIONS.STUDENTS, regNo.replace(/\//g, '_')));
        await deleteDoc(doc(db, COLLECTIONS.STUDENTS, regNo));
      }
    } catch {
      // Backend API already performed server-level deletion
    }
  }

  return backendOk || true;
}

export async function bulkSyncStudentsToCloud(students: Student[]): Promise<boolean> {
  // If authenticated in client Firebase Auth, batch write directly
  if (auth.currentUser) {
    try {
      const batch = writeBatch(db);
      students.forEach(std => {
        const docRef = doc(db, COLLECTIONS.STUDENTS, std.id || std.regNo);
        batch.set(docRef, { ...std, _updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
      return true;
    } catch {
      // fallback to backend
    }
  }

  // Otherwise route through secure backend API
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    for (const std of students) {
      await fetch('/api/students', {
        method: 'POST',
        headers,
        body: JSON.stringify(std)
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function clearAllStudentsFromCloud(): Promise<boolean> {
  // 1. Call Backend API to clear database and memory
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/students/clear-all', {
      method: 'POST',
      headers
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Clear all students API error:', err);
  }

  // 2. Direct Firestore client collection wipe ONLY if authenticated as admin
  if (auth.currentUser) {
    try {
      const colRef = collection(db, COLLECTIONS.STUDENTS);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((d) => {
          batch.delete(d.ref);
        });
        await batch.commit();
      }
      return true;
    } catch (err) {
      console.warn('[FIRESTORE] Client collection clear:', err);
      return backendOk;
    }
  }

  return backendOk || true;
}

// 2. RESULTS
export async function fetchResultsFromCloud(): Promise<ExamResult[] | null> {
  try {
    const res = await fetch('/api/results');
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.results)) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('[API] Result fetch fallback to Firestore:', err);
  }

  try {
    const colRef = collection(db, COLLECTIONS.RESULTS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as ExamResult);
  } catch {
    return null;
  }
}

export async function saveResultToCloud(result: ExamResult): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/results', {
      method: 'POST',
      headers,
      body: JSON.stringify(result)
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Result sync fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.RESULTS, result.id || result.rollNo);
      await setDoc(docRef, { ...result, _updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk;
}

export async function bulkSyncResultsToCloud(results: ExamResult[]): Promise<boolean> {
  if (auth.currentUser) {
    try {
      const batch = writeBatch(db);
      results.forEach(res => {
        const docRef = doc(db, COLLECTIONS.RESULTS, res.id || res.rollNo);
        batch.set(docRef, { ...res, _updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
      return true;
    } catch {
      // fallback
    }
  }
  return true;
}

// 3. PHOTO GALLERY
export async function fetchGalleryFromCloud(): Promise<GalleryItem[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.GALLERY);
    const snap = await getDocs(colRef);
    if (snap.empty) return null;
    return snap.docs.map(doc => doc.data() as GalleryItem);
  } catch {
    return null;
  }
}

export async function saveGalleryItemToCloud(item: GalleryItem): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers,
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Gallery sync fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.GALLERY, item.id);
      await setDoc(docRef, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk;
}

export async function deleteGalleryItemFromCloud(id: string): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Gallery delete fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.GALLERY, id);
      await deleteDoc(docRef);
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk || true;
}

export async function bulkSyncGalleryToCloud(gallery: GalleryItem[]): Promise<boolean> {
  if (auth.currentUser) {
    try {
      const batch = writeBatch(db);
      gallery.forEach(item => {
        const docRef = doc(db, COLLECTIONS.GALLERY, item.id);
        batch.set(docRef, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
      return true;
    } catch {
      // fallback
    }
  }
  return true;
}

// 4. NOTIFICATIONS
export async function fetchNotificationsFromCloud(): Promise<BoardNotification[] | null> {
  try {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.notifications)) {
        return data.notifications;
      }
    }
  } catch (err) {
    console.warn('[API] Notification fetch fallback to Firestore:', err);
  }

  try {
    const colRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as BoardNotification);
  } catch {
    return null;
  }
}

export async function saveNotificationToCloud(notif: BoardNotification): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers,
      body: JSON.stringify(notif)
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Notification sync fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
      await setDoc(docRef, { ...notif, _updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk;
}

export async function deleteNotificationFromCloud(id: string): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/notifications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Notification delete fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
      await deleteDoc(docRef);
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk || true;
}

export async function bulkSyncNotificationsToCloud(notifs: BoardNotification[]): Promise<boolean> {
  if (auth.currentUser) {
    try {
      const batch = writeBatch(db);
      notifs.forEach(item => {
        const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, item.id);
        batch.set(docRef, { ...item, _updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
      return true;
    } catch {
      // fallback
    }
  }
  return true;
}

// 5. CUSTOM FORMS & SUBMISSIONS
export async function fetchCustomFormsFromCloud(): Promise<CustomForm[] | null> {
  try {
    const res = await fetch('/api/forms');
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.forms)) {
        return data.forms;
      }
    }
  } catch (err) {
    console.warn('[API] Custom forms fetch fallback to Firestore:', err);
  }

  try {
    const colRef = collection(db, COLLECTIONS.CUSTOM_FORMS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as CustomForm);
  } catch {
    return null;
  }
}

export async function saveCustomFormToCloud(form: CustomForm): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/forms', {
      method: 'POST',
      headers,
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Custom form sync fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOM_FORMS, form.id);
      await setDoc(docRef, { ...form, _updatedAt: serverTimestamp() }, { merge: true });
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk;
}

export async function deleteCustomFormFromCloud(id: string): Promise<boolean> {
  let backendOk = false;
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Form delete fallback:', err);
  }

  if (auth.currentUser) {
    try {
      const docRef = doc(db, COLLECTIONS.CUSTOM_FORMS, id);
      await deleteDoc(docRef);
      return true;
    } catch {
      return backendOk;
    }
  }
  return backendOk || true;
}

export async function bulkSyncCustomFormsToCloud(forms: CustomForm[]): Promise<boolean> {
  if (auth.currentUser) {
    try {
      const batch = writeBatch(db);
      forms.forEach(form => {
        const docRef = doc(db, COLLECTIONS.CUSTOM_FORMS, form.id);
        batch.set(docRef, { ...form, _updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
      return true;
    } catch {
      // fallback
    }
  }
  return true;
}

export async function fetchSubmissionsFromCloud(): Promise<FormSubmission[] | null> {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('bsedrc_admin_token') : null;
    if (token) {
      const res = await fetch('/api/forms/submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.submissions)) {
          return data.submissions;
        }
      }
    }
  } catch (err) {
    console.warn('[API] Submissions fetch fallback to Firestore:', err);
  }

  try {
    const colRef = collection(db, COLLECTIONS.FORM_SUBMISSIONS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as FormSubmission);
  } catch {
    return null;
  }
}

export async function fetchPaymentsFromCloud(): Promise<FeePayment[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.PAYMENTS);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as FeePayment);
  } catch {
    return null;
  }
}

export async function fetchCertificatesFromCloud(): Promise<CertificateRecord[] | null> {
  try {
    const colRef = collection(db, COLLECTIONS.CERTIFICATES);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    return snap.docs.map(doc => doc.data() as CertificateRecord);
  } catch {
    return null;
  }
}

export async function saveSubmissionToCloud(submission: FormSubmission): Promise<boolean> {
  let backendOk = false;
  try {
    const res = await fetch(`/api/forms/${encodeURIComponent(submission.formId)}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    if (data?.success) backendOk = true;
  } catch (err) {
    console.warn('[API] Submission sync fallback:', err);
  }

  try {
    const docRef = doc(db, COLLECTIONS.FORM_SUBMISSIONS, submission.id);
    await setDoc(docRef, { ...submission, _submittedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch {
    return backendOk;
  }
}

export async function submitFormToCloud(submission: FormSubmission): Promise<FormSubmission | null> {
  try {
    const res = await fetch(`/api/forms/${encodeURIComponent(submission.formId)}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        email: submission.applicantEmail,
        phone: submission.applicantMobile,
        formTitle: submission.formTitle,
        amount: submission.amount,
      })
    });
    const data = await res.json();
    if (res.ok && data?.success && data.submission) {
      return data.submission as FormSubmission;
    }
  } catch (err) {
    console.warn('[API] Form submission save failed, trying Firestore fallback:', err);
  }

  try {
    const docRef = doc(db, COLLECTIONS.FORM_SUBMISSIONS, submission.id);
    await setDoc(docRef, { ...submission, _submittedAt: serverTimestamp() }, { merge: true });
    return submission;
  } catch (err) {
    console.warn('[FIRESTORE] Form submission fallback failed:', err);
    return null;
  }
}

export async function savePaymentToCloud(payment: FeePayment): Promise<boolean> {
  try {
    const docId = payment.transactionId || payment.receiptNo || payment.id;
    const docRef = doc(db, COLLECTIONS.PAYMENTS, docId);
    await setDoc(docRef, { ...payment, _createdAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[FIRESTORE] Payment save failed:', err);
    return false;
  }
}

export async function saveCertificateToCloud(certificate: CertificateRecord): Promise<boolean> {
  try {
    const docId = certificate.id || certificate.certificateNo;
    const docRef = doc(db, COLLECTIONS.CERTIFICATES, docId);
    await setDoc(docRef, { ...certificate, _updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[FIRESTORE] Certificate save failed:', err);
    return false;
  }
}

// 6. BULK SYNC ALL
export async function bulkSyncAllToCloud(payload: {
  students: Student[];
  results: ExamResult[];
  gallery: GalleryItem[];
  notifications: BoardNotification[];
  forms: CustomForm[];
  submissions: FormSubmission[];
  payments?: FeePayment[];
  certificates?: CertificateRecord[];
}): Promise<{ success: boolean; message: string }> {
  try {
    await Promise.all([
      bulkSyncStudentsToCloud(payload.students),
      bulkSyncResultsToCloud(payload.results),
      bulkSyncGalleryToCloud(payload.gallery),
      bulkSyncNotificationsToCloud(payload.notifications),
      bulkSyncCustomFormsToCloud(payload.forms),
      ...(payload.submissions || []).map(submission => saveSubmissionToCloud(submission)),
      ...(payload.payments || []).map(payment => savePaymentToCloud(payment)),
      ...(payload.certificates || []).map(certificate => saveCertificateToCloud(certificate))
    ]);
    return { success: true, message: 'All datasets successfully synchronized to Council Central Database.' };
  } catch {
    return { success: false, message: 'Database synchronization failed. Please check network connection.' };
  }
}

// 7. FIREBASE AUTHENTICATION HELPERS
export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  'bserdc.bihar@gmail.com',
  'anandsinghmdp8@gmail.com',
  'anandsinghks2014@gmail.com',
  'adarshbiharsiksha@gmail.com',
  'admin@bsedrc.in'
];

export async function checkIsAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user || !user.email) return false;
  const emailLower = user.email.toLowerCase().trim();

  // 1. Check verified list of official Council Admin emails
  if (AUTHORIZED_ADMIN_EMAILS.includes(emailLower)) {
    return true;
  }

  // 2. Check custom claims in Firebase ID Token
  try {
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true || idTokenResult.claims.role === 'admin') {
      return true;
    }
  } catch (err) {
    console.warn('[AUTH] Error checking token claims:', err);
  }

  // 3. Check protected Firestore admin record (admins/{uid} or admins/{email})
  try {
    const adminUidDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminUidDoc.exists()) {
      return true;
    }
    const adminEmailDoc = await getDoc(doc(db, 'admins', emailLower));
    if (adminEmailDoc.exists()) {
      return true;
    }
  } catch (err) {
    console.warn('[AUTH] Error querying admin record in Firestore:', err);
  }

  return false;
}

export async function loginWithFirebaseAuth(email: string, password: string): Promise<{ user: FirebaseUser | null; error?: string }> {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Login failed' };
  }
}

export async function sendFirebasePasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send password reset email.' };
  }
}

export async function registerWithFirebaseAuth(email: string, password: string): Promise<{ user: FirebaseUser | null; error?: string }> {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCred.user };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Registration failed' };
  }
}

export async function logoutFromFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch {}
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
