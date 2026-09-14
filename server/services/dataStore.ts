import { 
  serverDb, 
  serverAuth,
  FIRESTORE_COLLECTIONS,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query as firestoreQuery, 
  where, 
  orderBy, 
  firestoreLimit,
  serverTimestamp 
} from './firebaseServer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { config } from '../config';
import { 
  initialStudents, 
  initialResults, 
  initialVacancies, 
  initialApplications, 
  initialPayments, 
  initialCertificates, 
  initialNotifications, 
  initialCustomForms, 
  initialFormSubmissions, 
  initialGallery 
} from '../../src/data/initialData';

async function ensureServerAdminAuth() {
  if (serverAuth && !serverAuth.currentUser) {
    try {
      await signInWithEmailAndPassword(serverAuth, config.admin.superUsername, config.admin.superPassword);
    } catch (err: any) {
      console.warn('[FIREBASE AUTH] Admin auto-auth note:', err?.message);
    }
  }
}
import { 
  Student, 
  ExamResult, 
  JobVacancy, 
  JobApplication, 
  FeePayment, 
  CertificateRecord, 
  BoardNotification, 
  CustomForm, 
  FormSubmission, 
  GalleryItem 
} from '../../src/types';

class UnifiedDataStore {
  public memory = {
    students: [...initialStudents],
    results: [...initialResults],
    vacancies: [...initialVacancies],
    applications: [...initialApplications],
    payments: [...initialPayments] as FeePayment[],
    certificates: [...initialCertificates],
    notifications: [...initialNotifications],
    forms: [...initialCustomForms],
    submissions: [...initialFormSubmissions],
    gallery: [...initialGallery]
  };

  public isFirestoreReady(): boolean {
    return !!serverDb;
  }

  // ==========================================
  // STUDENTS (Cloud Firestore)
  // ==========================================

  public async getStudents(filter?: { search?: string; course?: string; limit?: number }): Promise<Student[]> {
    if (serverDb) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        let q = firestoreQuery(colRef);
        if (filter?.course) {
          q = firestoreQuery(colRef, where('course', '==', filter.course));
        }
        if (filter?.limit) {
          q = firestoreQuery(q, firestoreLimit(filter.limit));
        }
        const snap = await getDocs(q);
        let list = snap.docs.map(d => d.data() as Student);
        if (filter?.search) {
          const s = filter.search.toLowerCase();
          list = list.filter(
            st => st.name.toLowerCase().includes(s) ||
                  st.regNo.toLowerCase().includes(s) ||
                  st.rollNo.toLowerCase().includes(s)
          );
        }
        return list;
      } catch (err: any) {
        console.warn('[FIRESTORE] getStudents error, falling back to cache:', err?.message);
      }
    }

    let results = [...this.memory.students];
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      results = results.filter(
        st => st.name.toLowerCase().includes(s) ||
              st.regNo.toLowerCase().includes(s) ||
              st.rollNo.toLowerCase().includes(s)
      );
    }
    if (filter?.course) {
      results = results.filter(st => st.course === filter.course);
    }
    if (filter?.limit) {
      results = results.slice(0, filter.limit);
    }
    return results;
  }

  public async getStudentByRegOrRoll(identifier: string): Promise<Student | null> {
    const clean = identifier.trim().toLowerCase();

    if (serverDb) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        
        // Try direct doc read by ID / RegNo
        const docSnap = await getDoc(doc(colRef, clean.toUpperCase()));
        if (docSnap.exists()) {
          return docSnap.data() as Student;
        }

        // Query by regNo
        const qReg = firestoreQuery(colRef, where('regNo', '==', identifier.trim()));
        const snapReg = await getDocs(qReg);
        if (!snapReg.empty) {
          return snapReg.docs[0].data() as Student;
        }

        // Query by rollNo
        const qRoll = firestoreQuery(colRef, where('rollNo', '==', identifier.trim()));
        const snapRoll = await getDocs(qRoll);
        if (!snapRoll.empty) {
          return snapRoll.docs[0].data() as Student;
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] getStudentByRegOrRoll query fallback:', err?.message);
      }
    }

    const found = this.memory.students.find(
      st => st.regNo.toLowerCase() === clean || st.rollNo.toLowerCase() === clean || st.id.toLowerCase() === clean
    );
    return found || null;
  }

  public async saveStudent(student: Student): Promise<Student> {
    const existingIndex = this.memory.students.findIndex(s => s.regNo === student.regNo || s.id === student.id);
    if (existingIndex >= 0) {
      this.memory.students[existingIndex] = { ...this.memory.students[existingIndex], ...student };
    } else {
      this.memory.students.unshift(student);
    }

    if (serverDb) {
      try {
        const docId = student.id || student.regNo.replace(/\//g, '_');
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.STUDENTS, docId), {
          ...student,
          _updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveStudent fallback:', err?.message);
      }
    }

    return student;
  }

  public async deleteStudent(idOrReg: string): Promise<boolean> {
    const idx = this.memory.students.findIndex(s => s.id === idOrReg || s.regNo === idOrReg);
    let matchedStudent: Student | null = null;
    if (idx >= 0) {
      matchedStudent = this.memory.students[idx];
      this.memory.students.splice(idx, 1);
    }

    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        const cleanId = idOrReg.replace(/\//g, '_');
        
        // 1. Delete direct document IDs
        const idsToDelete = new Set<string>([idOrReg, cleanId]);
        if (matchedStudent) {
          if (matchedStudent.id) idsToDelete.add(matchedStudent.id);
          if (matchedStudent.regNo) {
            idsToDelete.add(matchedStudent.regNo);
            idsToDelete.add(matchedStudent.regNo.replace(/\//g, '_'));
          }
        }

        for (const docId of idsToDelete) {
          try {
            await deleteDoc(doc(serverDb, FIRESTORE_COLLECTIONS.STUDENTS, docId));
          } catch {}
        }

        // 2. Query Firestore by id and regNo to delete any docs that have matching fields
        const qId = firestoreQuery(colRef, where('id', '==', idOrReg));
        const snapId = await getDocs(qId);
        for (const d of snapId.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }

        const qReg = firestoreQuery(colRef, where('regNo', '==', idOrReg));
        const snapReg = await getDocs(qReg);
        for (const d of snapReg.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }

        if (matchedStudent && matchedStudent.regNo && matchedStudent.regNo !== idOrReg) {
          const qMatchedReg = firestoreQuery(colRef, where('regNo', '==', matchedStudent.regNo));
          const snapMatchedReg = await getDocs(qMatchedReg);
          for (const d of snapMatchedReg.docs) {
            try {
              await deleteDoc(d.ref);
            } catch {}
          }
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] deleteStudent fallback:', err?.message);
      }
    }
    return true;
  }

  public async clearAllStudents(): Promise<boolean> {
    this.memory.students = [];

    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        const snap = await getDocs(colRef);
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllStudents fallback error:', err?.message);
      }
    }
    return true;
  }

  // ==========================================
  // RESULTS (Cloud Firestore)
  // ==========================================

  public async getResults(): Promise<ExamResult[]> {
    if (serverDb) {
      try {
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.RESULTS));
        return snap.docs.map(d => d.data() as ExamResult);
      } catch (err: any) {
        console.warn('[FIRESTORE] getResults error:', err?.message);
      }
    }
    return this.memory.results;
  }

  public async clearAllResults(): Promise<boolean> {
    this.memory.results = [];
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.RESULTS);
        const snap = await getDocs(colRef);
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllResults fallback error:', err?.message);
      }
    }
    return true;
  }

  public async searchResult(rollNo?: string, regNo?: string): Promise<ExamResult | null> {
    const cleanRoll = rollNo?.trim();
    const cleanReg = regNo?.trim();

    if (serverDb && (cleanRoll || cleanReg)) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.RESULTS);
        if (cleanRoll) {
          const q = firestoreQuery(colRef, where('rollNo', '==', cleanRoll));
          const snap = await getDocs(q);
          if (!snap.empty) return snap.docs[0].data() as ExamResult;
        }
        if (cleanReg) {
          const q = firestoreQuery(colRef, where('studentRegNo', '==', cleanReg));
          const snap = await getDocs(q);
          if (!snap.empty) return snap.docs[0].data() as ExamResult;
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] searchResult query error:', err?.message);
      }
    }

    const found = this.memory.results.find(r => {
      const matchRoll = cleanRoll ? r.rollNo.toLowerCase() === cleanRoll.toLowerCase() : false;
      const matchReg = cleanReg ? r.studentRegNo.toLowerCase() === cleanReg.toLowerCase() : false;
      return (cleanRoll && cleanReg) ? (matchRoll || matchReg) : (matchRoll || matchReg);
    });

    return found || null;
  }

  public async saveResult(result: ExamResult): Promise<ExamResult> {
    const idx = this.memory.results.findIndex(r => r.rollNo === result.rollNo || r.id === result.id);
    if (idx >= 0) {
      this.memory.results[idx] = result;
    } else {
      this.memory.results.unshift(result);
    }

    if (serverDb) {
      try {
        const docId = result.id || result.rollNo;
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.RESULTS, docId), {
          ...result,
          _updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveResult fallback:', err?.message);
      }
    }
    return result;
  }

  // ==========================================
  // NOTIFICATIONS (Cloud Firestore)
  // ==========================================

  public async getNotifications(): Promise<BoardNotification[]> {
    if (serverDb) {
      try {
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS));
        return snap.docs.map(d => d.data() as BoardNotification);
      } catch (err: any) {
        console.warn('[FIRESTORE] getNotifications fallback:', err?.message);
      }
    }
    return this.memory.notifications;
  }

  public async saveNotification(notification: BoardNotification): Promise<BoardNotification> {
    const idx = this.memory.notifications.findIndex(n => n.id === notification.id);
    if (idx >= 0) {
      this.memory.notifications[idx] = notification;
    } else {
      this.memory.notifications.unshift(notification);
    }

    if (serverDb) {
      try {
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS, notification.id), notification, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveNotification fallback:', err?.message);
      }
    }
    return notification;
  }

  public async deleteNotification(id: string): Promise<boolean> {
    this.memory.notifications = this.memory.notifications.filter(n => n.id !== id);
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        await deleteDoc(doc(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS, id));
      } catch (err: any) {
        console.warn('[FIRESTORE] deleteNotification fallback:', err?.message);
      }
    }
    return true;
  }

  public async clearAllNotifications(): Promise<boolean> {
    this.memory.notifications = [];
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS));
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllNotifications fallback error:', err?.message);
      }
    }
    return true;
  }

  // ==========================================
  // GALLERY (Cloud Firestore)
  // ==========================================

  public async getGallery(): Promise<GalleryItem[]> {
    if (serverDb) {
      try {
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.GALLERY));
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as GalleryItem);
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] getGallery fallback:', err?.message);
      }
    }
    return this.memory.gallery;
  }

  public async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const idx = this.memory.gallery.findIndex(g => g.id === item.id);
    if (idx >= 0) {
      this.memory.gallery[idx] = item;
    } else {
      this.memory.gallery.unshift(item);
    }

    if (serverDb) {
      try {
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.GALLERY, item.id), item, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveGalleryItem fallback:', err?.message);
      }
    }
    return item;
  }

  public async deleteGalleryItem(id: string): Promise<boolean> {
    this.memory.gallery = this.memory.gallery.filter(g => g.id !== id);
    if (serverDb) {
      try {
        await deleteDoc(doc(serverDb, FIRESTORE_COLLECTIONS.GALLERY, id));
      } catch (err: any) {
        console.warn('[FIRESTORE] deleteGalleryItem fallback:', err?.message);
      }
    }
    return true;
  }

  // ==========================================
  // ONLINE FORMS & SUBMISSIONS (Cloud Firestore)
  // ==========================================

  public async getForms(): Promise<CustomForm[]> {
    if (serverDb) {
      try {
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS));
        return snap.docs.map(d => d.data() as CustomForm);
      } catch (err: any) {
        console.warn('[FIRESTORE] getForms fallback:', err?.message);
      }
    }
    return this.memory.forms;
  }

  public async getFormById(id: string): Promise<CustomForm | null> {
    if (serverDb) {
      try {
        const docSnap = await getDoc(doc(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS, id));
        if (docSnap.exists()) {
          return docSnap.data() as CustomForm;
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] getFormById fallback:', err?.message);
      }
    }
    const found = this.memory.forms.find(f => f.id === id);
    return found || null;
  }

  public async saveForm(form: CustomForm): Promise<CustomForm> {
    const idx = this.memory.forms.findIndex(f => f.id === form.id);
    if (idx >= 0) {
      this.memory.forms[idx] = form;
    } else {
      this.memory.forms.unshift(form);
    }

    if (serverDb) {
      try {
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS, form.id), form, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveForm fallback:', err?.message);
      }
    }
    return form;
  }

  public async deleteForm(id: string): Promise<boolean> {
    this.memory.forms = this.memory.forms.filter(f => f.id !== id);
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        await deleteDoc(doc(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS, id));
      } catch (err: any) {
        console.warn('[FIRESTORE] deleteForm fallback:', err?.message);
      }
    }
    return true;
  }

  public async clearAllForms(): Promise<boolean> {
    this.memory.forms = [];
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS));
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllForms fallback error:', err?.message);
      }
    }
    return true;
  }

  public async getSubmissions(formId?: string): Promise<FormSubmission[]> {
    if (serverDb) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.FORM_SUBMISSIONS);
        const q = formId ? firestoreQuery(colRef, where('formId', '==', formId)) : colRef;
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data() as FormSubmission);
      } catch (err: any) {
        console.warn('[FIRESTORE] getSubmissions fallback:', err?.message);
      }
    }
    if (formId) {
      return this.memory.submissions.filter(s => s.formId === formId);
    }
    return this.memory.submissions;
  }

  public async clearAllSubmissions(): Promise<boolean> {
    this.memory.submissions = [];
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.FORM_SUBMISSIONS));
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllSubmissions fallback error:', err?.message);
      }
    }
    return true;
  }

  public async saveSubmission(submission: FormSubmission): Promise<FormSubmission> {
    this.memory.submissions.unshift(submission);

    if (serverDb) {
      try {
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.FORM_SUBMISSIONS, submission.id), {
          ...submission,
          _submittedAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] saveSubmission fallback:', err?.message);
      }
    }
    return submission;
  }

  // ==========================================
  // PAYMENTS (Cloud Firestore)
  // ==========================================

  public async savePayment(payment: any): Promise<any> {
    this.memory.payments.unshift(payment);

    if (serverDb) {
      try {
        const docId = payment.orderId || payment.transactionId || `PAY-${Date.now()}`;
        await setDoc(doc(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS, docId), {
          ...payment,
          _createdAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('[FIRESTORE] savePayment fallback:', err?.message);
      }
    }
    return payment;
  }

  public async getPaymentByTxn(txnId: string): Promise<any | null> {
    const clean = txnId.trim().toLowerCase();

    if (serverDb) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS);
        const q = firestoreQuery(colRef, where('transactionId', '==', txnId.trim()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs[0].data();
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] getPaymentByTxn fallback:', err?.message);
      }
    }

    const found = this.memory.payments.find(p => {
      const pAny = p as any;
      return (
        p.transactionId?.toLowerCase() === clean || 
        p.receiptNo?.toLowerCase() === clean ||
        p.refNumber?.toLowerCase() === clean ||
        pAny.orderId?.toLowerCase() === clean ||
        pAny.razorpayOrderId?.toLowerCase() === clean
      );
    });
    return found || null;
  }

  public async getPayments(): Promise<FeePayment[]> {
    if (serverDb) {
      try {
        const snap = await getDocs(collection(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS));
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as FeePayment);
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] getPayments fallback:', err?.message);
      }
    }
    return this.memory.payments;
  }

  // ==========================================
  // CERTIFICATES (Cloud Firestore)
  // ==========================================

  public async verifyCertificate(serialNo: string): Promise<CertificateRecord | null> {
    const clean = serialNo.trim();

    if (serverDb) {
      try {
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.CERTIFICATES);
        
        // Search by certificateNo
        const qCert = firestoreQuery(colRef, where('certificateNo', '==', clean));
        const snapCert = await getDocs(qCert);
        if (!snapCert.empty) {
          return snapCert.docs[0].data() as CertificateRecord;
        }

        // Search by studentRegNo
        const qReg = firestoreQuery(colRef, where('studentRegNo', '==', clean));
        const snapReg = await getDocs(qReg);
        if (!snapReg.empty) {
          return snapReg.docs[0].data() as CertificateRecord;
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] verifyCertificate fallback:', err?.message);
      }
    }

    const found = this.memory.certificates.find(
      c => c.certificateNo.toLowerCase() === clean.toLowerCase() || 
           c.studentRegNo.toLowerCase() === clean.toLowerCase() ||
           c.studentRollNo.toLowerCase() === clean.toLowerCase() ||
           c.id.toLowerCase() === clean.toLowerCase()
    );
    return found || null;
  }

  public async clearAllCertificates(): Promise<boolean> {
    this.memory.certificates = [];
    if (serverDb) {
      try {
        await ensureServerAdminAuth();
        const colRef = collection(serverDb, FIRESTORE_COLLECTIONS.CERTIFICATES);
        const snap = await getDocs(colRef);
        for (const d of snap.docs) {
          try {
            await deleteDoc(d.ref);
          } catch {}
        }
      } catch (err: any) {
        console.warn('[FIRESTORE] clearAllCertificates fallback error:', err?.message);
      }
    }
    return true;
  }
}

export const dataStore = new UnifiedDataStore();
