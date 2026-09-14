import React, { useState } from 'react';
import { 
  Lock, 
  Users, 
  Award, 
  Briefcase, 
  CreditCard, 
  Bell, 
  Plus, 
  Upload, 
  Trash2, 
  Edit, 
  Edit2,
  CheckCircle, 
  X, 
  Search, 
  FileText, 
  ShieldAlert, 
  Eye, 
  Printer, 
  Download,
  GraduationCap,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Cloud,
  RefreshCw,
  Check,
  Database,
  Loader2
} from 'lucide-react';
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
} from '../types';
import { AdminFormBuilder } from '../components/AdminFormBuilder';
import { AdminGalleryManager } from '../components/AdminGalleryManager';
import { EditStudentModal } from '../components/EditStudentModal';
import { parseBulkStudentInput, SAMPLE_BULK_STUDENTS_EXCEL } from '../lib/studentParser';

interface AdminDashboardViewProps {
  students: Student[];
  results: ExamResult[];
  vacancies: JobVacancy[];
  applications: JobApplication[];
  payments: FeePayment[];
  certificates: CertificateRecord[];
  notifications: BoardNotification[];
  customForms?: CustomForm[];
  formSubmissions?: FormSubmission[];
  gallery?: GalleryItem[];
  onAddNewStudent: (st: Student) => void;
  onBulkUploadStudents: (sts: Student[]) => void;
  onDeleteStudent: (id: string, regNo?: string) => void | Promise<void>;
  onDeleteAllStudents?: () => void | Promise<void>;
  onUpdateStudent?: (st: Student) => void | Promise<void>;
  onAddNewResult: (res: ExamResult) => void;
  onTogglePublishResult: (id: string) => void;
  onUpdateAppStatus: (id: string, status: JobApplication['status']) => void;
  onAddNewNotification: (notif: BoardNotification) => void;
  onDeleteNotification: (id: string) => void;
  onToggleNotificationMarquee: (id: string) => void;
  onAddNewForm?: (form: CustomForm) => void;
  onUpdateForm?: (form: CustomForm) => void;
  onDeleteForm?: (id: string) => void;
  onTogglePublishForm?: (id: string) => void;
  onUpdateSubmissionStatus?: (id: string, status: FormSubmission['status']) => void;
  onAddNewGalleryItem?: (item: GalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
  onUpdateGalleryItem?: (item: GalleryItem) => void;
  cloudSyncStatus?: string;
  isCloudSyncing?: boolean;
  onTriggerCloudSync?: () => Promise<{ success: boolean; message: string }>;
  onSelectStudentReg: (regNo: string) => void;
  setCurrentTab: (tab: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  students,
  results,
  vacancies,
  applications,
  payments,
  certificates,
  notifications,
  customForms = [],
  formSubmissions = [],
  gallery = [],
  cloudSyncStatus = 'Connected',
  isCloudSyncing = false,
  onTriggerCloudSync,
  onAddNewStudent,
  onBulkUploadStudents,
  onDeleteStudent,
  onDeleteAllStudents,
  onUpdateStudent,
  onAddNewResult,
  onTogglePublishResult,
  onUpdateAppStatus,
  onAddNewNotification,
  onDeleteNotification,
  onToggleNotificationMarquee,
  onAddNewForm,
  onUpdateForm,
  onDeleteForm,
  onTogglePublishForm,
  onUpdateSubmissionStatus,
  onAddNewGalleryItem,
  onDeleteGalleryItem,
  onUpdateGalleryItem,
  onSelectStudentReg,
  setCurrentTab,
  onLogoutAdmin,
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'students' | 'results' | 'jobs' | 'fees' | 'notifications' | 'forms' | 'gallery'>('overview');

  // Bulk student upload state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvInput, setBulkCsvInput] = useState('');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Add Notification state
  const [isAddNotifModalOpen, setIsAddNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifCategory, setNotifCategory] = useState<BoardNotification['category']>('Examination');
  const [notifDesc, setNotifDesc] = useState('');
  const [notifIsMarquee, setNotifIsMarquee] = useState(true);
  const [notifIsNew, setNotifIsNew] = useState(true);

  // Student search filter & Edit Student State
  const [studentSearch, setStudentSearch] = useState('');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string>('');

  // Calculate stats
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleSyncCloud = async () => {
    if (!onTriggerCloudSync) return;
    setSyncFeedback('Syncing data to Central Council Database...');
    const result = await onTriggerCloudSync();
    setSyncFeedback(result.message);
    setTimeout(() => {
      setSyncFeedback(null);
    }, 4000);
  };

  const handleBulkUpload = () => {
    if (!bulkCsvInput.trim()) {
      alert('Please enter or paste candidate records');
      return;
    }

    const parsedStudents = parseBulkStudentInput(bulkCsvInput, students.length);
    if (parsedStudents.length === 0) {
      alert('No valid candidate records detected. Please ensure records contain:\nName, DOB, Mother, Father, Gender, Class, Registration, Registration year');
      return;
    }

    onBulkUploadStudents(parsedStudents);
    setBulkSuccessMsg(`Successfully uploaded & activated ${parsedStudents.length} candidate registration cards! All candidate details (Name, DOB, Mother, Father, Gender, Class, Registration, Registration year) have been filled into the council registry.`);
    setBulkCsvInput('');
    setTimeout(() => {
      setIsBulkModalOpen(false);
      setBulkSuccessMsg('');
    }, 2200);
  };

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) return;

    const newNotif: BoardNotification = {
      id: 'notif-' + Date.now(),
      title: notifTitle.trim(),
      category: notifCategory,
      date: new Date().toISOString().split('T')[0],
      isNew: notifIsNew,
      isMarquee: notifIsMarquee,
      description: notifDesc.trim() || notifTitle.trim(),
    };

    onAddNewNotification(newNotif);
    setIsAddNotifModalOpen(false);
    setNotifTitle('');
    setNotifDesc('');
  };

  const filteredStudents = students.filter(
    (s) =>
      s.regNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Admin Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight">
              BSEDRC Board Administration Console
            </h1>
            <span className="text-xs text-amber-400 font-mono">
              Role: Master Board Controller • Session: 2024-2025
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Central Council Database Status & Sync Button */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200">
            <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">Central DB:</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
              {cloudSyncStatus}
            </span>
          </div>

          {/* Secure Council Storage Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200">
            <Database className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-[11px]">Archive:</span>
            <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
              Active &amp; Secured
            </span>
          </div>

          {onTriggerCloudSync && (
            <button
              onClick={handleSyncCloud}
              disabled={isCloudSyncing}
              className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Save all local changes permanently to Central Council Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Syncing...' : 'Sync Database'}</span>
            </button>
          )}

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Student List</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="bg-rose-900 hover:bg-rose-800 text-rose-200 font-bold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cloud Sync Feedback Banner */}
      {syncFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{syncFeedback}</span>
        </div>
      )}

      {/* Admin Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200 text-xs pb-2 sm:pb-2">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Layers },
          { id: 'students', label: `Students Database (${students.length})`, icon: Users },
          { id: 'forms', label: `Forms & Publisher (${customForms.length})`, icon: FileText },
          { id: 'gallery', label: `Photo Gallery (${gallery.length})`, icon: ImageIcon },
          { id: 'results', label: `Results Management (${results.length})`, icon: Award },
          { id: 'jobs', label: `Job Recruitment (${applications.length})`, icon: Briefcase },
          { id: 'fees', label: `Fee Ledger (${payments.length})`, icon: CreditCard },
          { id: 'notifications', label: `Circular & Marquee Manager (${notifications.length})`, icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOAST FEEDBACK NOTIFICATION */}
      {toastNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button 
            onClick={() => setToastNotice('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase block">Enrolled Students</span>
              <span className="text-2xl font-black text-blue-950 font-mono mt-1 block">{students.length}</span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Active Registration Cards</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase block">Results Published</span>
              <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                {results.filter((r) => r.isPublished).length}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">10th & 12th Marksheets</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase block">Total Fees Collected</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">{payments.length} Transactions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase block">Job Applications</span>
              <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">{applications.length}</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Across {vacancies.length} Post Openings</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase block">Active Circulars</span>
              <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">{notifications.length}</span>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                {notifications.filter((n) => n.isMarquee).length} Flash Marquee
              </span>
            </div>
          </div>

          {/* Quick Shortcuts & Ingestion Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Bulk Student Ingestion Engine
              </span>
              <h3 className="text-base font-bold text-white">
                Upload Candidate Roster / Registration Excel List
              </h3>
              <p className="text-xs text-slate-300">
                Instantly upload batch lists. Registered students can immediately look up their registration number on the public portal and print their registration card.
              </p>
            </div>

            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Open Bulk Upload Dialog</span>
            </button>
          </div>

          {/* Recent Candidates Quick Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-950 uppercase">
                Recently Enrolled Candidates
              </h3>
              <button
                onClick={() => setAdminTab('students')}
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                View Full Student Database ›
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3 border-b">Reg No.</th>
                    <th className="py-2 px-3 border-b">Mother Name</th>
                    <th className="py-2 px-3 border-b">Candidate Name</th>
                    <th className="py-2 px-3 border-b">Course</th>
                    <th className="py-2 px-3 border-b">Stream</th>
                    <th className="py-2 px-3 border-b">Status</th>
                    <th className="py-2 px-3 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-blue-900">{st.regNo}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Roll: {st.rollNo}</div>
                      </td>
                      <td className="py-2.5 px-3 uppercase font-medium text-slate-800">{st.motherName || '—'}</td>
                      <td className="py-2.5 px-3 font-semibold uppercase">{st.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{st.course}</td>
                      <td className="py-2.5 px-3">{st.stream}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {st.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            onSelectStudentReg(st.regNo);
                            setCurrentTab('student');
                          }}
                          className="bg-blue-100 text-blue-900 hover:bg-blue-200 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="View Registration Card"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => setEditingStudent(st)}
                          className="bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold px-2 py-1 rounded text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit Registration Form"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS DATABASE MANAGER */}
      {adminTab === 'students' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 uppercase">
                Student Enrolment Records & Registration Forms
              </h2>
              <span className="text-xs text-slate-500">
                All candidates in this database can instantly search and print their registration card. You can edit any candidate registration form or delete records.
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => {
                  if (students.length > 0) {
                    setEditingStudent(students[0]);
                  } else {
                    setCurrentTab('student');
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Edit Student Registration Form"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Registration Form</span>
              </button>

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Bulk Upload List</span>
              </button>

              {onDeleteAllStudents && students.length > 0 && (
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      `⚠️ चेतावनी (CRITICAL WARNING):\n\nक्या आप वाकई सभी (${students.length}) छात्रों का विवरण वेबसाइट और केंद्रीय परिषद अभिलेख से स्थायी रूप से हटाना (DELETE) चाहते हैं?\n\nAre you sure you want to permanently delete all student details from the website and central council records?`
                    );
                    if (confirmed) {
                      onDeleteAllStudents();
                    }
                  }}
                  className="bg-rose-700 hover:bg-rose-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  title="Delete all student details from database and website"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Students</span>
                </button>
              )}

              <button
                onClick={() => setCurrentTab('student')}
                className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Single Student</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Reg No, Name, Mother Name, or Roll No..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 border-b">Reg No</th>
                  <th className="py-2 px-3 border-b">Mother Name</th>
                  <th className="py-2 px-3 border-b">Candidate Name</th>
                  <th className="py-2 px-3 border-b">Father's Name</th>
                  <th className="py-2 px-3 border-b">Course / Stream</th>
                  <th className="py-2 px-3 border-b">Mobile</th>
                  <th className="py-2 px-3 border-b">Fee</th>
                  <th className="py-2 px-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-blue-900 block">{st.regNo}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Roll: {st.rollNo}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold uppercase text-slate-800">
                      {st.motherName || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-bold uppercase text-slate-900">{st.name}</td>
                    <td className="py-2.5 px-3 text-slate-600 uppercase">{st.fatherName}</td>
                    <td className="py-2.5 px-3">
                      <span className="block font-semibold text-slate-800">{st.stream}</span>
                      <span className="text-[10px] text-slate-500">{st.course}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{st.mobile}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        st.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {st.feeStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          onSelectStudentReg(st.regNo);
                          setCurrentTab('student');
                        }}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                        title="View Official Registration Card"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => setEditingStudent(st)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit Student Registration Form (संशोधन प्रपत्र)"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Form</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete student "${st.name}" (${st.regNo})? This will permanently remove the student registration from the portal and council records.`)) {
                            setIsDeletingId(st.id);
                            try {
                              await onDeleteStudent(st.id, st.regNo);
                              setToastNotice(`Student ${st.name} (${st.regNo}) deleted successfully.`);
                              setTimeout(() => setToastNotice(''), 4000);
                            } catch (err: any) {
                              setToastNotice(`Error deleting student: ${err.message}`);
                            } finally {
                              setIsDeletingId(null);
                            }
                          }
                        }}
                        disabled={isDeletingId === st.id}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 p-1.5 rounded inline-flex items-center transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete Student Record"
                      >
                        {isDeletingId === st.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RESULTS MANAGEMENT */}
      {adminTab === 'results' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 uppercase">
                Examination Results & Marksheet Management
              </h2>
              <span className="text-xs text-slate-500">
                Publish, unpublish, or review generated mark-sheets for Class 10th & 12th.
              </span>
            </div>
            <button
              onClick={() => setCurrentTab('results')}
              className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-3.5 py-1.5 rounded-lg text-xs"
            >
              Public Result Portal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 border-b">Roll No</th>
                  <th className="py-2 px-3 border-b">Reg No</th>
                  <th className="py-2 px-3 border-b">Candidate Name</th>
                  <th className="py-2 px-3 border-b">Course</th>
                  <th className="py-2 px-3 border-b">Total / Max</th>
                  <th className="py-2 px-3 border-b">Percentage</th>
                  <th className="py-2 px-3 border-b">Status</th>
                  <th className="py-2 px-3 border-b">Published</th>
                  <th className="py-2 px-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-950">{r.rollNo}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{r.studentRegNo}</td>
                    <td className="py-2.5 px-3 font-bold uppercase">{r.candidateName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.course}</td>
                    <td className="py-2.5 px-3 font-mono">{r.totalObt} / {r.totalMax}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-900">{r.percentage.toFixed(2)}%</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {r.resultStatus} ({r.division})
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onTogglePublishResult(r.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          r.isPublished
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {r.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setCurrentTab('results')}
                        className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded text-[11px]"
                      >
                        View Marksheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: JOB RECRUITMENT */}
      {adminTab === 'jobs' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 uppercase">
                Employee Job Recruitment Applications
              </h2>
              <span className="text-xs text-slate-500">
                Review applicant qualifications, verify fees, and update selection / admit card status.
              </span>
            </div>
            <button
              onClick={() => setCurrentTab('jobs')}
              className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-3.5 py-1.5 rounded-lg text-xs"
            >
              Public Job Portal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 border-b">Application No.</th>
                  <th className="py-2 px-3 border-b">Post Applied</th>
                  <th className="py-2 px-3 border-b">Candidate Name</th>
                  <th className="py-2 px-3 border-b">Qualification</th>
                  <th className="py-2 px-3 border-b">Phone</th>
                  <th className="py-2 px-3 border-b">Fee</th>
                  <th className="py-2 px-3 border-b">Current Status</th>
                  <th className="py-2 px-3 border-b text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{app.applicationNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{app.postTitle}</td>
                    <td className="py-2.5 px-3 font-bold uppercase">{app.candidateName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{app.qualification} ({app.percentage})</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{app.phone}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">₹{app.amount} ({app.paymentStatus})</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateAppStatus(app.id, e.target.value as any)}
                        className="bg-slate-50 p-1 rounded border border-slate-300 text-[11px] font-medium"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Admit Card Available">Admit Card Issued</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FEE LEDGER */}
      {adminTab === 'fees' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 uppercase">
                Treasury & Online Fee Transaction Records
              </h2>
              <span className="text-xs text-slate-500">
                Complete log of digital UPI, Net Banking, and Debit Card transactions with bank reference codes.
              </span>
            </div>
            <div className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg font-bold">
              Total Revenue: ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 border-b">Receipt No.</th>
                  <th className="py-2 px-3 border-b">Transaction ID</th>
                  <th className="py-2 px-3 border-b">Candidate Name</th>
                  <th className="py-2 px-3 border-b">Reference</th>
                  <th className="py-2 px-3 border-b">Purpose</th>
                  <th className="py-2 px-3 border-b">Amount</th>
                  <th className="py-2 px-3 border-b">Mode</th>
                  <th className="py-2 px-3 border-b">Date / Time</th>
                  <th className="py-2 px-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-950">{p.receiptNo}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{p.transactionId}</td>
                    <td className="py-2.5 px-3 font-bold uppercase">{p.candidateName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{p.refNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{p.purpose}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-blue-900">₹{p.amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3">{p.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{p.paymentDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATIONS & CIRCULARS WITH ADMIN CONTROL */}
      {adminTab === 'notifications' && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 uppercase">
                Notice Board & Flash Marquee Controller
              </h2>
              <span className="text-xs text-slate-500">
                "Or notification system with admin control feature bhi chahiye" — Add, toggle flash ticker, or delete notices.
              </span>
            </div>

            <button
              onClick={() => setIsAddNotifModalOpen(true)}
              className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {notif.category}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{notif.date}</span>
                    {notif.isMarquee && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        FLASH TICKER ACTIVE
                      </span>
                    )}
                    {notif.isNew && (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        NEW BADGE
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                  <p className="text-slate-600 text-xs">{notif.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onToggleNotificationMarquee(notif.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      notif.isMarquee
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {notif.isMarquee ? 'Pinned in Marquee' : 'Pin to Marquee'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete notification: "${notif.title}"?`)) {
                        onDeleteNotification(notif.id);
                      }
                    }}
                    className="p-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DYNAMIC FORM BUILDER & PUBLISHER */}
      {adminTab === 'forms' && (
        <AdminFormBuilder
          customForms={customForms}
          formSubmissions={formSubmissions}
          onAddNewForm={onAddNewForm || (() => {})}
          onUpdateForm={onUpdateForm || (() => {})}
          onDeleteForm={onDeleteForm || (() => {})}
          onTogglePublishForm={onTogglePublishForm || (() => {})}
          onUpdateSubmissionStatus={onUpdateSubmissionStatus || (() => {})}
        />
      )}

      {/* TAB: PHOTO GALLERY MANAGER */}
      {adminTab === 'gallery' && (
        <AdminGalleryManager
          gallery={gallery}
          onAddNewGalleryItem={onAddNewGalleryItem || (() => {})}
          onDeleteGalleryItem={onDeleteGalleryItem || (() => {})}
          onUpdateGalleryItem={onUpdateGalleryItem || (() => {})}
        />
      )}

      {/* BULK UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 border border-slate-200 my-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-blue-950 uppercase tracking-wide">
                  Bulk Student Registration Upload (कक्षा 5वीं - 10वीं)
                </h3>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Paste candidate list directly from Excel, Google Sheets, or CSV to auto-fill official Registration Cards.
                </span>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MANDATED FORMAT BANNER */}
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                  Mandatory 8-Column Format (Direct Tab / Excel / CSV copy-paste):
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="/bsedrc_student_registration_template.csv"
                    download="bsedrc_student_registration_template.csv"
                    className="text-[10px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Template CSV</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setBulkCsvInput(SAMPLE_BULK_STUDENTS_EXCEL)}
                    className="text-[10px] font-bold text-blue-900 bg-white border border-blue-300 hover:bg-blue-50 px-2 py-0.5 rounded shadow-2xs cursor-pointer"
                  >
                    Insert Sample Data
                  </button>
                </div>
              </div>

              {/* Badges for 8 columns in exact order */}
              <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                <span className="bg-blue-950 text-amber-300 font-bold px-2 py-0.5 rounded">1. Name</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">2. DOB</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">3. Mother</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">4. Father</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">5. Gender</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">6. Class</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">7. Registration</span>
                <span className="bg-blue-950 text-amber-300 font-bold px-2 py-0.5 rounded">8. Registration year</span>
              </div>

              <div className="text-[10px] text-amber-900 leading-tight">
                <strong>Copy-Paste Tip:</strong> Excel or Google Sheets columns (separated by Tab) can be pasted directly here. Both Tab (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">\t</code>) and Comma (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">,</code>) delimiters are supported.
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 block">
                  Paste Student Records (1 row per student):
                </label>
                {bulkCsvInput && (
                  <button
                    type="button"
                    onClick={() => setBulkCsvInput('')}
                    className="text-[10px] text-rose-600 hover:underline"
                  >
                    Clear Text
                  </button>
                )}
              </div>

              <textarea
                rows={7}
                value={bulkCsvInput}
                onChange={(e) => setBulkCsvInput(e.target.value)}
                placeholder={"Name\tDOB\tMother\tFather\tGender\tClass\tRegistration\tRegistration year\nPRIYA KUMARI\t15/08/2012\tSUNITA DEVI\tRAMESHWAR YADAV\tFemale\tClass 8th\tBSE/2026/801\t2026\nSANJAY KUMAR\t10/05/2011\tMEENA DEVI\tSHIV CHARAN\tMale\tClass 10th\tBSE/2026/802\t2026"}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-300 font-mono text-xs focus:bg-white focus:outline-blue-900"
              />

              {/* Real-time Parsed Count Indicator */}
              {bulkCsvInput.trim().length > 0 && (
                <div className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center justify-between">
                  <span>Detected Records:</span>
                  <span className="font-bold bg-blue-900 text-white px-2 py-0.5 rounded-full text-[10px]">
                    {parseBulkStudentInput(bulkCsvInput, 0).length} Candidates Ready to Ingest
                  </span>
                </div>
              )}

              {bulkSuccessMsg && (
                <div className="bg-emerald-100 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkUpload}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Ingest & Activate Registration Cards</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NOTIFICATION MODAL */}
      {isAddNotifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-blue-950 uppercase">
                Publish New Notice or Circular
              </h3>
              <button
                onClick={() => setIsAddNotifModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Category *</label>
                <select
                  value={notifCategory}
                  onChange={(e) => setNotifCategory(e.target.value as any)}
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="Examination">Examination</option>
                  <option value="Admission">Admission / Registration</option>
                  <option value="Recruitment">Recruitment / Jobs</option>
                  <option value="Results">Results & Marksheet</option>
                  <option value="General Notice">General Notice</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Circular Headline / Title *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Schedule of Annual Secondary Examination 2025 Announced..."
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Detailed Notice Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed guidelines, instructions, and circular directives..."
                  value={notifDesc}
                  onChange={(e) => setNotifDesc(e.target.value)}
                  className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifIsMarquee}
                    onChange={(e) => setNotifIsMarquee(e.target.checked)}
                    className="rounded text-blue-900"
                  />
                  <span className="font-bold text-slate-800">Pin to Top Flash Ticker Marquee</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifIsNew}
                    onChange={(e) => setNotifIsNew(e.target.checked)}
                    className="rounded text-blue-900"
                  />
                  <span className="font-bold text-slate-800">Display "NEW" Blinking Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddNotifModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-5 py-2 rounded-lg shadow-sm"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT REGISTRATION FORM MODAL */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={async (updated) => {
            if (onUpdateStudent) {
              await onUpdateStudent(updated);
            }
            setToastNotice(`Registration details for ${updated.name} (${updated.regNo}) updated successfully.`);
            setTimeout(() => setToastNotice(''), 4000);
          }}
        />
      )}

    </div>
  );
};
