import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Footer 
} from './components/Footer';
import { 
  MarqueeTicker 
} from './components/MarqueeTicker';
import { 
  PaymentModal 
} from './components/PaymentModal';

import { HomeView } from './views/HomeView';
import { StudentPortalView } from './views/StudentPortalView';
import { ResultPortalView } from './views/ResultPortalView';
import { JobPortalView } from './views/JobPortalView';
import { FeePaymentView } from './views/FeePaymentView';
import { CertificatesView } from './views/CertificatesView';
import { NotificationsView } from './views/NotificationsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SchoolDirectoryView } from './views/SchoolDirectoryView';
import { OnlineFormsView } from './views/OnlineFormsView';
import { GalleryView } from './views/GalleryView';

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
} from './data/initialData';

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
  SchoolInfo,
  GalleryItem
} from './types';
import { 
  fetchStudentsFromCloud, 
  fetchResultsFromCloud, 
  fetchGalleryFromCloud, 
  fetchNotificationsFromCloud, 
  fetchCustomFormsFromCloud, 
  fetchSubmissionsFromCloud, 
  fetchPaymentsFromCloud,
  fetchCertificatesFromCloud,
  saveStudentToCloud, 
  deleteStudentFromCloud, 
  clearAllStudentsFromCloud,
  saveResultToCloud, 
  saveGalleryItemToCloud, 
  deleteGalleryItemFromCloud, 
  saveNotificationToCloud, 
  deleteNotificationFromCloud, 
  saveCustomFormToCloud, 
  deleteCustomFormFromCloud, 
  saveSubmissionToCloud, 
  submitFormToCloud,
  savePaymentToCloud,
  saveCertificateToCloud,
  bulkSyncAllToCloud,
  bulkSyncStudentsToCloud,
  loginWithFirebaseAuth,
  sendFirebasePasswordResetEmail,
  checkIsAdmin,
  logoutFromFirebaseAuth,
  subscribeToAuthChanges,
  FIREBASE_PROJECT_ID 
} from './lib/firebase';
import { Lock, Key, AlertCircle, X, ShieldCheck, RefreshCw, Eye, EyeOff, CheckCircle2, Mail, ArrowLeft, Database } from 'lucide-react';

export const VALID_TABS = [
  'home',
  'student',
  'schools',
  'online-forms',
  'results',
  'jobs',
  'payment',
  'certificates',
  'notifications',
  'gallery',
  'admin',
] as const;

export function normalizeTab(rawTab?: string | null): string | null {
  if (!rawTab) return null;
  const t = rawTab.trim().toLowerCase().replace(/^#\/?/, '');
  if (t === 'fees' || t === 'fee' || t === 'pay') return 'payment';
  if (t === 'students' || t === 'registration' || t === 'admit-card') return 'student';
  if (t === 'school' || t === 'directory') return 'schools';
  if (t === 'result' || t === 'marksheet') return 'results';
  if (t === 'job' || t === 'vacancies' || t === 'recruitment') return 'jobs';
  if (t === 'forms' || t === 'form' || t === 'onlineforms') return 'online-forms';
  if (t === 'certificate' || t === 'verify') return 'certificates';
  if (t === 'notices' || t === 'notice' || t === 'notification') return 'notifications';
  if (VALID_TABS.includes(t as any)) return t;
  return null;
}

export function resolveInitialTab(): string {
  if (typeof window === 'undefined') return 'home';
  try {
    // 1. Check URL Hash (e.g. #/results, #student)
    const hashTab = normalizeTab(window.location.hash);
    if (hashTab) {
      if (hashTab === 'admin') {
        const isAuth = sessionStorage.getItem('bsedrc_admin_auth') === 'true';
        return isAuth ? 'admin' : 'home';
      }
      return hashTab;
    }

    // 2. Check URL search query parameter (e.g. ?tab=results)
    const params = new URLSearchParams(window.location.search);
    const searchTab = normalizeTab(params.get('tab'));
    if (searchTab) {
      if (searchTab === 'admin') {
        const isAuth = sessionStorage.getItem('bsedrc_admin_auth') === 'true';
        return isAuth ? 'admin' : 'home';
      }
      return searchTab;
    }

    // 3. Check Session Storage (preserved when refreshed)
    const sessionTab = normalizeTab(sessionStorage.getItem('bsedrc_current_tab'));
    if (sessionTab) {
      if (sessionTab === 'admin') {
        const isAuth = sessionStorage.getItem('bsedrc_admin_auth') === 'true';
        return isAuth ? 'admin' : 'home';
      }
      return sessionTab;
    }

    // 4. Check Local Storage fallback
    const localTab = normalizeTab(localStorage.getItem('bsedrc_current_tab'));
    if (localTab) {
      if (localTab === 'admin') {
        const isAuth = sessionStorage.getItem('bsedrc_admin_auth') === 'true';
        return isAuth ? 'admin' : 'home';
      }
      return localTab;
    }
  } catch {
    // Ignore storage restriction
  }
  return 'home';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(resolveInitialTab);

  // Core Data States - students cleared per user request
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_students_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_students');
        localStorage.removeItem('bsedrc_selected_reg_no');
        localStorage.setItem('bsedrc_students_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_students');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [results, setResults] = useState<ExamResult[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_results_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_results');
        localStorage.setItem('bsedrc_results_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_results');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [vacancies, setVacancies] = useState<JobVacancy[]>(() => {
    const saved = localStorage.getItem('bsedrc_vacancies');
    return saved ? JSON.parse(saved) : initialVacancies;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('bsedrc_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_payments_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_payments');
        localStorage.setItem('bsedrc_payments_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_payments');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_certificates_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_certificates');
        localStorage.setItem('bsedrc_certificates_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_certificates');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [notifications, setNotifications] = useState<BoardNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_notifications_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_notifications');
        localStorage.setItem('bsedrc_notifications_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_notifications');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [customForms, setCustomForms] = useState<CustomForm[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_custom_forms_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_custom_forms');
        localStorage.setItem('bsedrc_custom_forms_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_custom_forms');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(() => {
    if (typeof window !== 'undefined') {
      const isCleared = localStorage.getItem('bsedrc_form_submissions_cleared_v4');
      if (!isCleared) {
        localStorage.removeItem('bsedrc_form_submissions');
        localStorage.setItem('bsedrc_form_submissions_cleared_v4', 'true');
        return [];
      }
      const saved = localStorage.getItem('bsedrc_form_submissions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('bsedrc_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p: any) => p.imageUrl && p.imageUrl.includes('unsplash.com'))) {
          localStorage.setItem('bsedrc_gallery', JSON.stringify(initialGallery));
          return initialGallery;
        }
        return parsed;
      } catch {
        return initialGallery;
      }
    }
    return initialGallery;
  });

  const [preselectedSchool, setPreselectedSchool] = useState<SchoolInfo | null>(null);

  // Cloud Database Sync State
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string>('Connected');

  // Initial Cloud Data Fetch & Seed
  useEffect(() => {
    let isMounted = true;
    async function loadCloudData() {
      try {
        const [cloudStudents, cloudResults, cloudGallery, cloudNotifs, cloudForms, cloudSubmissions, cloudPayments, cloudCertificates] = await Promise.all([
          fetchStudentsFromCloud(),
          fetchResultsFromCloud(),
          fetchGalleryFromCloud(),
          fetchNotificationsFromCloud(),
          fetchCustomFormsFromCloud(),
          fetchSubmissionsFromCloud(),
          fetchPaymentsFromCloud(),
          fetchCertificatesFromCloud(),
        ]);

        if (!isMounted) return;

        if (Array.isArray(cloudStudents)) {
          setStudents(cloudStudents);
        }

        if (Array.isArray(cloudResults)) {
          setResults(cloudResults);
        }
        if (cloudGallery && cloudGallery.length > 0) {
          // Check if cloud gallery contains outdated unsplash photos; if so, update to initialGallery
          const hasUnsplash = cloudGallery.some(g => g.imageUrl?.includes('unsplash.com'));
          if (hasUnsplash) {
            setGallery(initialGallery);
          } else {
            setGallery(cloudGallery);
          }
        }
        if (Array.isArray(cloudNotifs)) {
          setNotifications(cloudNotifs);
        }
        if (Array.isArray(cloudForms)) {
          setCustomForms(cloudForms);
        }
        if (Array.isArray(cloudSubmissions)) {
          setFormSubmissions(cloudSubmissions);
        }
        if (Array.isArray(cloudPayments)) {
          setPayments(cloudPayments);
        }
        if (Array.isArray(cloudCertificates)) {
          setCertificates(cloudCertificates);
        }
        setCloudSyncStatus('Synced');
      } catch (err) {
        console.warn('Initial cloud sync notice:', err);
      }
    }
    loadCloudData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    try {
      const res = await bulkSyncAllToCloud({
        students,
        results,
        gallery,
        notifications,
        forms: customForms,
        submissions: formSubmissions,
        payments,
        certificates,
      });
      setCloudSyncStatus(res.success ? 'Synced' : 'Failed');
      return res;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Cross-view selection hooks
  const [selectedRegNo, setSelectedRegNo] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlReg = params.get('regNo');
        if (urlReg) return urlReg;
        const saved = localStorage.getItem('bsedrc_selected_reg_no');
        if (saved) return saved;
      } catch {}
    }
    return '';
  });

  const [selectedNotification, setSelectedNotification] = useState<BoardNotification | null>(null);

  // Admin Auth & Password Recovery State (persisted in sessionStorage)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('bsedrc_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminLoginMode, setAdminLoginMode] = useState<'login' | 'forgot'>('login');
  const [adminUsernameInput, setAdminUsernameInput] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [adminLoginError, setAdminLoginError] = useState<string>('');
  const [isAdminSubmitting, setIsAdminSubmitting] = useState<boolean>(false);

  // Admin Forgot Password State
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSecurityPin, setForgotSecurityPin] = useState<string>('');
  const [forgotNewPassword, setForgotNewPassword] = useState<string>('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState<string>('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

  // Synchronize admin authentication state with Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        try {
          const authorized = await checkIsAdmin(user);
          if (authorized) {
            const token = await user.getIdToken();
            sessionStorage.setItem('bsedrc_admin_token', token);
            sessionStorage.setItem('bsedrc_admin_auth', 'true');
            setIsAdminLoggedIn(true);
          } else {
            setIsAdminLoggedIn(false);
            sessionStorage.removeItem('bsedrc_admin_auth');
            sessionStorage.removeItem('bsedrc_admin_token');
            localStorage.removeItem('bsedrc_admin_auth');
          }
        } catch {
          // ignore
        }
      } else {
        setIsAdminLoggedIn(false);
        try {
          sessionStorage.removeItem('bsedrc_admin_auth');
          sessionStorage.removeItem('bsedrc_admin_token');
          localStorage.removeItem('bsedrc_admin_auth');
          localStorage.removeItem('bsedrc_admin_custom_pwd');
        } catch {}
      }
    });

    return () => unsubscribe();
  }, []);

  // URL query params & direct link listener (for QR code scan direct landing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = normalizeTab(params.get('tab'));
        const regParam = params.get('regNo');
        const rollParam = params.get('rollNo');

        if (tabParam) {
          setCurrentTab(tabParam);
        }
        if (regParam) {
          setSelectedRegNo(regParam);
          if (!tabParam) setCurrentTab('student');
        } else if (rollParam) {
          const found = students.find((s) => s.rollNo === rollParam);
          if (found) {
            setSelectedRegNo(found.regNo);
            if (!tabParam) setCurrentTab('student');
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Synchronize currentTab changes to Session Storage, Local Storage, and URL Hash so refresh stays on current page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('bsedrc_current_tab', currentTab);
      localStorage.setItem('bsedrc_current_tab', currentTab);

      const targetClean = currentTab === 'home' ? '' : currentTab;
      const currentClean = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();

      if (currentClean !== targetClean) {
        try {
          const url = new URL(window.location.href);
          if (currentTab === 'home') {
            url.hash = '';
            if (url.searchParams.has('tab')) url.searchParams.delete('tab');
          } else {
            url.hash = currentTab;
            url.searchParams.set('tab', currentTab);
          }
          window.history.replaceState(null, '', url.toString());
        } catch {
          window.location.hash = targetClean ? `#${targetClean}` : '';
        }
      }
    } catch {
      // ignore storage limitations
    }
  }, [currentTab]);

  // Support Browser Back and Forward Navigation (popstate & hashchange)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNavigationChange = () => {
      const nextTab = resolveInitialTab();
      if (nextTab === 'admin' && !isAdminLoggedIn) {
        setShowAdminLoginModal(true);
      } else {
        setCurrentTab(nextTab);
      }
    };

    window.addEventListener('popstate', handleNavigationChange);
    window.addEventListener('hashchange', handleNavigationChange);
    return () => {
      window.removeEventListener('popstate', handleNavigationChange);
      window.removeEventListener('hashchange', handleNavigationChange);
    };
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (selectedRegNo && typeof window !== 'undefined') {
      try {
        localStorage.setItem('bsedrc_selected_reg_no', selectedRegNo);
      } catch {}
    }
  }, [selectedRegNo]);

  // Payment Modal State
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    purpose: FeePayment['purpose'];
    amount: number;
    refNumber: string;
    candidateName: string;
    fatherName: string;
    mobile: string;
  }>({
    isOpen: false,
    purpose: 'Registration Fee',
    amount: 650,
    refNumber: '',
    candidateName: '',
    fatherName: '',
    mobile: '',
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('bsedrc_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bsedrc_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('bsedrc_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('bsedrc_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('bsedrc_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('bsedrc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bsedrc_custom_forms', JSON.stringify(customForms));
  }, [customForms]);

  useEffect(() => {
    localStorage.setItem('bsedrc_form_submissions', JSON.stringify(formSubmissions));
  }, [formSubmissions]);

  useEffect(() => {
    localStorage.setItem('bsedrc_gallery', JSON.stringify(gallery));
  }, [gallery]);

  // Data mutation handlers
  const handleAddNewStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    saveStudentToCloud(newStudent);
  };

  const handleBulkUploadStudents = (batch: Student[]) => {
    setStudents((prev) => {
      // Remove duplicates by regNo
      const existingRegs = new Set(prev.map((s) => s.regNo));
      const filteredNew = batch.filter((b) => !existingRegs.has(b.regNo));
      return [...filteredNew, ...prev];
    });
    bulkSyncStudentsToCloud(batch);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id || s.regNo === updatedStudent.regNo ? updatedStudent : s))
    );
    await saveStudentToCloud(updatedStudent);
  };

  const handleDeleteStudent = async (id: string, regNo?: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id && s.regNo !== (regNo || id)));
    await deleteStudentFromCloud(id, regNo);
  };

  const handleDeleteAllStudents = async () => {
    setStudents([]);
    setSelectedRegNo('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bsedrc_students');
      localStorage.removeItem('bsedrc_selected_reg_no');
    }
    await clearAllStudentsFromCloud();
  };

  const handleAddNewResult = (res: ExamResult) => {
    setResults((prev) => [res, ...prev]);
    saveResultToCloud(res);
  };

  const handleTogglePublishResult = (id: string) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, isPublished: !r.isPublished };
          saveResultToCloud(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const handleAddNewApplication = (app: JobApplication) => {
    setApplications((prev) => [app, ...prev]);
  };

  const handleUpdateAppStatus = (id: string, status: JobApplication['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, admitCardReady: status === 'Admit Card Available' } : a))
    );
  };

  const handleAddNewCertificate = (cert: CertificateRecord) => {
    setCertificates((prev) => [cert, ...prev]);
    saveCertificateToCloud(cert);
  };

  const handleAddNewNotification = (notif: BoardNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    saveNotificationToCloud(notif);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    deleteNotificationFromCloud(id);
  };

  const handleToggleNotificationMarquee = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, isMarquee: !n.isMarquee };
          saveNotificationToCloud(updated);
          return updated;
        }
        return n;
      })
    );
  };

  // Custom Form Handlers
  const handleAddNewForm = (newForm: CustomForm) => {
    setCustomForms((prev) => [newForm, ...prev]);
    saveCustomFormToCloud(newForm);
  };

  const handleUpdateForm = (updatedForm: CustomForm) => {
    setCustomForms((prev) =>
      prev.map((f) => (f.id === updatedForm.id ? updatedForm : f))
    );
    saveCustomFormToCloud(updatedForm);
  };

  const handleDeleteForm = (id: string) => {
    setCustomForms((prev) => prev.filter((f) => f.id !== id));
    deleteCustomFormFromCloud(id);
  };

  const handleTogglePublishForm = (id: string) => {
    setCustomForms((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === 'Published' ? 'Draft' : 'Published';
          const updated = { ...f, status: nextStatus };
          saveCustomFormToCloud(updated);
          return updated;
        }
        return f;
      })
    );
  };

  const handleAddNewFormSubmission = async (sub: FormSubmission) => {
    const saved = await submitFormToCloud(sub);
    if (!saved) {
      throw new Error('Firebase me form submission save nahi ho paya.');
    }
    setFormSubmissions((prev) => [saved, ...prev]);
    // increment count on form
    setCustomForms((prev) =>
      prev.map((f) => {
        if (f.id === saved.formId) {
          const updated = { ...f, submissionsCount: (f.submissionsCount || 0) + 1 };
          saveCustomFormToCloud(updated);
          return updated;
        }
        return f;
      })
    );
    return saved;
  };

  const handleUpdateSubmissionStatus = (id: string, status: FormSubmission['status']) => {
    setFormSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, status };
          saveSubmissionToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const handleAddNewGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => [item, ...prev]);
    saveGalleryItemToCloud(item);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    deleteGalleryItemFromCloud(id);
  };

  const handleUpdateGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => prev.map((g) => (g.id === item.id ? item : g)));
    saveGalleryItemToCloud(item);
  };

  // Payment trigger
  const handleOpenPaymentModal = (
    purpose: FeePayment['purpose'],
    amount: number,
    refNumber: string,
    candidateName: string,
    fatherName: string,
    mobile: string
  ) => {
    setPaymentModalState({
      isOpen: true,
      purpose,
      amount,
      refNumber,
      candidateName,
      fatherName,
      mobile,
    });
  };

  const handlePaymentSuccess = (newPayment: FeePayment) => {
    setPayments((prev) => [newPayment, ...prev]);
    savePaymentToCloud(newPayment);
    // If student payment, mark student fee as paid
    setStudents((prev) =>
      prev.map((s) => {
        if (s.regNo === newPayment.refNumber) {
          return { ...s, feeStatus: 'Paid' };
        }
        return s;
      })
    );
    // Note: Modal displays the generated receipt with print/download and closes via onClose
  };

  // Language and Filter State
  const [lang, setLang] = useState<'EN' | 'HI'>('HI');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Global search handler for Header search bar (works on mobile & desktop)
  const handleGlobalQuickSearch = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) return;

    // Check if matches a student
    const matchedStudent = students.find(
      (s) => s.regNo.toUpperCase().includes(q) || s.name.toUpperCase().includes(q) || s.rollNo.includes(q)
    );
    if (matchedStudent) {
      setSelectedRegNo(matchedStudent.regNo);
      setCurrentTab('student');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if matches results
    const matchedResult = results.find(
      (r) => r.rollNo.includes(q) || r.candidateName.toUpperCase().includes(q)
    );
    if (matchedResult) {
      setCurrentTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default to student portal search with whatever query was entered
    setSelectedRegNo(query.trim());
    setCurrentTab('student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const grantAdminAccess = (token?: string) => {
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem('bsedrc_admin_auth', 'true');
      localStorage.setItem('bsedrc_admin_auth', 'true');
      if (token) {
        sessionStorage.setItem('bsedrc_admin_token', token);
      }
    } catch {}
    setShowAdminLoginModal(false);
    setAdminLoginError('');
    setAdminPasswordInput('');
    handleTabChange('admin');
  };

  // Admin Login Handler via Firebase Authentication Only
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    const user = adminUsernameInput.trim();
    const pass = adminPasswordInput.trim();

    if (!user || !pass) {
      setAdminLoginError('Please enter both Council Admin ID / Email and password.');
      return;
    }

    let email = user.toLowerCase();
    if (!email.includes('@')) {
      if (email === 'bserdc' || email === 'bserdc.bihar') {
        email = 'bserdc.bihar@gmail.com';
      } else if (email === 'adarshbihar' || email === 'adarshbiharsiksha') {
        email = 'adarshbiharsiksha@gmail.com';
      } else if (email === 'anandsinghks2014') {
        email = 'anandsinghks2014@gmail.com';
      } else if (email === 'anand' || email === 'anandsingh') {
        email = 'anandsinghmdp8@gmail.com';
      } else {
        email = `${email}@bsedrc.in`;
      }
    }

    setIsAdminSubmitting(true);
    try {
      // 1. Authenticate solely with Firebase Email/Password Auth
      const loginRes = await loginWithFirebaseAuth(email, pass);
      if (!loginRes.user) {
        const rawErr = (loginRes.error || '').toLowerCase();
        if (rawErr.includes('user-not-found') || rawErr.includes('invalid-credential') || rawErr.includes('wrong-password') || rawErr.includes('invalid_login_credentials')) {
          setAdminLoginError('Invalid administrative credentials. Please verify your registered email and password.');
        } else if (rawErr.includes('too-many-requests')) {
          setAdminLoginError('Access temporarily restricted due to consecutive failed attempts. Please reset password or retry later.');
        } else {
          setAdminLoginError(loginRes.error || 'Authentication failed. Please verify credentials.');
        }
        return;
      }

      // 2. Validate admin authorization via UID, token claims, or Firestore admins record
      const isAuthorized = await checkIsAdmin(loginRes.user);
      if (!isAuthorized) {
        await logoutFromFirebaseAuth();
        setAdminLoginError('Access Denied: Your account is authenticated, but is not authorized as a Council Administrator.');
        return;
      }

      // 3. Acquire Firebase ID token for secure backend admin operations
      const token = await loginRes.user.getIdToken(true);
      grantAdminAccess(token);
    } catch (err: any) {
      setAdminLoginError(err?.message || 'Authentication error. Please check your network connection.');
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  // Admin Forgot Password Handler via Official Firebase Password Reset Email
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus({ type: '', message: '' });

    const rawEmail = forgotEmail.trim();
    if (!rawEmail) {
      setForgotStatus({ type: 'error', message: 'Please enter your registered council admin email.' });
      return;
    }

    let email = rawEmail.toLowerCase();
    if (!email.includes('@')) {
      if (email === 'bserdc' || email === 'bserdc.bihar') {
        email = 'bserdc.bihar@gmail.com';
      } else if (email === 'adarshbihar' || email === 'adarshbiharsiksha') {
        email = 'adarshbiharsiksha@gmail.com';
      } else if (email === 'anand' || email === 'anandsingh') {
        email = 'anandsinghmdp8@gmail.com';
      } else {
        email = `${email}@bsedrc.in`;
      }
    }

    setIsResettingPassword(true);
    try {
      const res = await sendFirebasePasswordResetEmail(email);
      if (res.success) {
        setForgotStatus({
          type: 'success',
          message: `Official password reset link sent to ${email} via Firebase Authentication! Please check your inbox and spam folder.`
        });
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotSecurityPin('');
        setTimeout(() => {
          setAdminLoginMode('login');
          setForgotStatus({ type: '', message: '' });
          setAdminLoginError('');
        }, 4000);
      } else {
        const rawErr = (res.error || '').toLowerCase();
        if (rawErr.includes('user-not-found')) {
          setForgotStatus({
            type: 'error',
            message: 'No registered council administrator found with this email address.'
          });
        } else if (rawErr.includes('invalid-email')) {
          setForgotStatus({
            type: 'error',
            message: 'Please enter a valid email address.'
          });
        } else {
          setForgotStatus({
            type: 'error',
            message: res.error || 'Failed to send password reset email via Firebase.'
          });
        }
      }
    } catch (err: any) {
      setForgotStatus({
        type: 'error',
        message: err?.message || 'Error communicating with Firebase Authentication.'
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleTabChange = (tab: string) => {
    const normalized = normalizeTab(tab) || tab;
    if (normalized === 'admin' && !isAdminLoggedIn) {
      setShowAdminLoginModal(true);
      return;
    }
    setCurrentTab(normalized);
    try {
      sessionStorage.setItem('bsedrc_current_tab', normalized);
      localStorage.setItem('bsedrc_current_tab', normalized);
      const url = new URL(window.location.href);
      if (normalized === 'home') {
        url.hash = '';
        if (url.searchParams.has('tab')) url.searchParams.delete('tab');
      } else {
        url.hash = normalized;
        url.searchParams.set('tab', normalized);
      }
      window.history.pushState(null, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Global Portal Header with Bihar Council Branding & Filters */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminModalOpen={setShowAdminLoginModal}
        lang={lang}
        setLang={setLang}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onQuickSearch={handleGlobalQuickSearch}
      />

      {/* Breaking News Marquee */}
      <MarqueeTicker
        notifications={notifications}
        onSelectNotification={(notif) => {
          setSelectedNotification(notif);
          setCurrentTab('notifications');
        }}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            notifications={notifications}
            vacancies={vacancies}
            students={students}
            setCurrentTab={handleTabChange}
            onSelectNotification={setSelectedNotification}
            activeFilter={activeFilter}
            onSearchRegCard={(reg) => {
              setSelectedRegNo(reg);
              setCurrentTab('student');
            }}
          />
        )}

        {currentTab === 'student' && (
          <StudentPortalView
            students={students}
            selectedRegNo={selectedRegNo}
            setSelectedRegNo={setSelectedRegNo}
            onAddNewStudent={handleAddNewStudent}
            onBulkUploadStudents={handleBulkUploadStudents}
            onOpenPaymentModal={handleOpenPaymentModal}
            preselectedSchool={preselectedSchool}
            onNavigateToSchoolDirectory={() => setCurrentTab('schools')}
          />
        )}

        {currentTab === 'schools' && (
          <SchoolDirectoryView
            onSelectSchoolForRegistration={(school) => {
              setPreselectedSchool(school);
              setCurrentTab('student');
            }}
          />
        )}

        {currentTab === 'online-forms' && (
          <OnlineFormsView
            forms={customForms}
            submissions={formSubmissions}
            onSubmitForm={handleAddNewFormSubmission}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentTab === 'results' && (
          <ResultPortalView
            results={results}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentTab === 'jobs' && (
          <JobPortalView
            vacancies={vacancies}
            applications={applications}
            onAddNewApplication={handleAddNewApplication}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentTab === 'payment' && (
          <FeePaymentView
            students={students}
            payments={payments}
            onOpenPaymentModal={handleOpenPaymentModal}
          />
        )}

        {currentTab === 'certificates' && (
          <CertificatesView
            certificates={certificates}
            students={students}
            results={results}
            onAddNewCertificate={handleAddNewCertificate}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            selectedNotification={selectedNotification}
            onSelectNotification={setSelectedNotification}
            setCurrentTab={handleTabChange}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            gallery={gallery}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminModal={() => setShowAdminLoginModal(true)}
            onGoToAdminGallery={() => {
              setCurrentTab('admin');
            }}
          />
        )}

        {currentTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboardView
            students={students}
            results={results}
            vacancies={vacancies}
            applications={applications}
            payments={payments}
            certificates={certificates}
            notifications={notifications}
            customForms={customForms}
            formSubmissions={formSubmissions}
            gallery={gallery}
            cloudSyncStatus={cloudSyncStatus}
            isCloudSyncing={isCloudSyncing}
            onTriggerCloudSync={handleManualCloudSync}
            onAddNewStudent={handleAddNewStudent}
            onBulkUploadStudents={handleBulkUploadStudents}
            onDeleteStudent={handleDeleteStudent}
            onDeleteAllStudents={handleDeleteAllStudents}
            onUpdateStudent={handleUpdateStudent}
            onAddNewResult={handleAddNewResult}
            onTogglePublishResult={handleTogglePublishResult}
            onUpdateAppStatus={handleUpdateAppStatus}
            onAddNewNotification={handleAddNewNotification}
            onDeleteNotification={handleDeleteNotification}
            onToggleNotificationMarquee={handleToggleNotificationMarquee}
            onAddNewForm={handleAddNewForm}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
            onTogglePublishForm={handleTogglePublishForm}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
            onAddNewGalleryItem={handleAddNewGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onUpdateGalleryItem={handleUpdateGalleryItem}
            onSelectStudentReg={setSelectedRegNo}
            setCurrentTab={handleTabChange}
            onLogoutAdmin={async () => {
              setIsAdminLoggedIn(false);
              try {
                await logoutFromFirebaseAuth();
                sessionStorage.removeItem('bsedrc_admin_auth');
                sessionStorage.removeItem('bsedrc_admin_token');
                localStorage.removeItem('bsedrc_admin_auth');
                localStorage.removeItem('bsedrc_admin_custom_pwd');
                sessionStorage.setItem('bsedrc_current_tab', 'home');
                localStorage.setItem('bsedrc_current_tab', 'home');
              } catch {}
              setAdminUsernameInput('');
              setAdminPasswordInput('');
              handleTabChange('home');
            }}
          />
        )}
      </main>

      {/* Global Payment Modal */}
      {paymentModalState.isOpen && (
        <PaymentModal
          isOpen={paymentModalState.isOpen}
          onClose={() => setPaymentModalState((prev) => ({ ...prev, isOpen: false }))}
          purpose={paymentModalState.purpose}
          amount={paymentModalState.amount}
          refNumber={paymentModalState.refNumber}
          candidateName={paymentModalState.candidateName}
          fatherName={paymentModalState.fatherName}
          mobile={paymentModalState.mobile}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Admin Login & Password Recovery Dialog */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shadow-xs">
                  {adminLoginMode === 'login' ? <Lock className="w-4.5 h-4.5" /> : <Key className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-950 uppercase">
                    {adminLoginMode === 'login' ? 'Admin Council Portal' : 'Admin Password Recovery'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>परिषद केंद्रीय प्रशासनिक अभिलेख प्रणाली</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminLoginError('');
                  setForgotStatus({ type: '', message: '' });
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Pills */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAdminLoginMode('login');
                  setAdminLoginError('');
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  adminLoginMode === 'login'
                    ? 'bg-white text-blue-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminLoginMode('forgot');
                  setForgotStatus({ type: '', message: '' });
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  adminLoginMode === 'forgot'
                    ? 'bg-white text-blue-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Forgot Password</span>
              </button>
            </div>

            {/* MODE 1: LOGIN */}
            {adminLoginMode === 'login' && (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-950" />
                    <span>Council Admin ID / Email</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsernameInput}
                    onChange={(e) => setAdminUsernameInput(e.target.value)}
                    placeholder="Enter Council Admin ID / Email"
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300 font-semibold focus:bg-white focus:outline-blue-900"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-blue-950" />
                      <span>Access Password</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAdminLoginMode('forgot')}
                      className="text-[11px] text-blue-700 hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter access password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full bg-white p-2.5 pr-10 rounded-lg border border-slate-300 font-mono focus:outline-blue-900"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {adminLoginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{adminLoginError}</span>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-950" />
                  <span>Confidential admin portal. Unauthorized access is strictly prohibited.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLoginModal(false);
                      setAdminLoginError('');
                      setAdminPasswordInput('');
                    }}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdminSubmitting}
                    className="bg-blue-950 hover:bg-blue-900 disabled:opacity-60 text-amber-400 font-bold px-5 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    {isAdminSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize Login</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: FORGOT PASSWORD */}
            {adminLoginMode === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 text-xs">
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                  <span className="font-bold block">Council Admin Password Recovery</span>
                  Enter your registered council email to receive a secure password reset link directly via Firebase Authentication.
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Registered Council Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered council email"
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300 font-semibold focus:bg-white focus:outline-blue-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Council Verification PIN
                    </label>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter 6-digit Council Security PIN (Optional)"
                    value={forgotSecurityPin}
                    onChange={(e) => setForgotSecurityPin(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 font-mono tracking-widest focus:outline-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="New password (optional)"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono focus:outline-blue-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono focus:outline-blue-900"
                    />
                  </div>
                </div>

                {forgotStatus.message && (
                  <div
                    className={`p-2.5 rounded-lg text-[11px] flex items-center gap-2 ${
                      forgotStatus.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {forgotStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{forgotStatus.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminLoginMode('login');
                      setForgotStatus({ type: '', message: '' });
                    }}
                    className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    {isResettingPassword ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Footer with Admin Link */}
      <Footer 
        setCurrentTab={handleTabChange} 
        isAdminLoggedIn={isAdminLoggedIn} 
        setIsAdminModalOpen={setShowAdminLoginModal} 
      />

    </div>
  );
}
