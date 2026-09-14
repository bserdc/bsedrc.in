import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserCheck, 
  UserPlus, 
  FileCheck, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Download, 
  Printer, 
  GraduationCap, 
  Layers,
  ArrowRight,
  BookOpen,
  School,
  Building2,
  X
} from 'lucide-react';
import { Student, SchoolInfo } from '../types';
import { StudentRegistrationCard } from '../components/StudentRegistrationCard';
import { OFFICIAL_SCHOOLS_LIST } from '../data/schoolsData';
import { parseBulkStudentInput, SAMPLE_BULK_STUDENTS_EXCEL } from '../lib/studentParser';

interface StudentPortalViewProps {
  students: Student[];
  selectedRegNo: string;
  setSelectedRegNo: (regNo: string) => void;
  onAddNewStudent: (student: Student) => void;
  onBulkUploadStudents: (students: Student[]) => void;
  onOpenPaymentModal: (purpose: any, amount: number, refNo: string, name: string, father: string, mobile: string) => void;
  preselectedSchool?: SchoolInfo | null;
  onNavigateToSchoolDirectory?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  selectedRegNo,
  setSelectedRegNo,
  onAddNewStudent,
  onBulkUploadStudents,
  onOpenPaymentModal,
  preselectedSchool,
  onNavigateToSchoolDirectory,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'new-form'>('search');
  const [searchInput, setSearchInput] = useState(selectedRegNo || '');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState('');
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolSearchText, setSchoolSearchText] = useState('');

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male' as Student['gender'],
    category: 'General' as Student['category'],
    course: 'Secondary Examination (Class 10th)' as Student['course'],
    stream: 'General' as Student['stream'],
    regNo: '',
    registrationYear: '2026',
    mobile: '',
    email: '',
    address: '',
    examCenter: 'Center No. 104 - BNMV Campus Zone, Madhepura (852113)',
    photoUrl: '',
    photoKey: '',
  });

  // Automatically update examCenter if preselectedSchool is provided
  useEffect(() => {
    if (preselectedSchool) {
      setFormData((prev) => ({
        ...prev,
        examCenter: `${preselectedSchool.name} (${preselectedSchool.udiseCode}) - ${preselectedSchool.district}`,
      }));
      setActiveTab('new-form');
    }
  }, [preselectedSchool]);
  const [formSuccess, setFormSuccess] = useState<Student | null>(null);

  // Bulk Upload Text State
  const [bulkText, setBulkText] = useState('');
  const [bulkStatus, setBulkStatus] = useState<string>('');

  // Auto-search if selectedRegNo changes
  useEffect(() => {
    if (selectedRegNo) {
      setSearchInput(selectedRegNo);
      findAndSetStudent(selectedRegNo);
      setActiveTab('search');
    } else {
      setMatchedStudent(null);
    }
  }, [selectedRegNo, students]);

  const findAndSetStudent = (query: string) => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setMatchedStudent(null);
      setSearchError('');
      return;
    }

    const found = students.find((s) => {
      const reg = s.regNo.toLowerCase();
      const roll = s.rollNo.toLowerCase();
      const name = s.name.toLowerCase();
      return reg === clean || reg.endsWith(clean) || roll === clean || name.includes(clean);
    });

    if (found) {
      setMatchedStudent(found);
      setSearchError('');
      setSelectedRegNo(found.regNo);
    } else {
      setMatchedStudent(null);
      setSearchError(`No candidate registration found matching "${query}". Please check the registration number.`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findAndSetStudent(searchInput);
  };

  // 5 Competition Examination Subjects (Class 5th to 10th): Hindi, Math, Science, Social Science, General Knowledge
  const getDefaultSubjectsForStream = (course: string, stream: string) => {
    return [
      { code: '01', name: 'हिन्दी', type: 'Theory' as const },
      { code: '02', name: 'गणित', type: 'Theory' as const },
      { code: '03', name: 'विज्ञान', type: 'Theory' as const },
      { code: '04', name: 'सामाजिक विज्ञान', type: 'Theory' as const },
      { code: '05', name: 'सामान्य ज्ञान', type: 'Theory' as const },
    ];
  };

  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fatherName) {
      alert('Please fill all required student details (Candidate Name and Father Name)');
      return;
    }

    const nextIdNumber = 100 + students.length + 1;
    const sessionYear = formData.registrationYear?.trim() || '2026';
    const newRegNo = formData.regNo?.trim() || `BSE/${sessionYear}/${String(nextIdNumber).padStart(3, '0')}`;
    const newRollNo = `${sessionYear.slice(-2)}0${nextIdNumber}`;

    const newStudent: Student = {
      id: 'std-' + Date.now(),
      regNo: newRegNo,
      rollNo: newRollNo,
      name: formData.name.toUpperCase().trim(),
      fatherName: formData.fatherName.toUpperCase().trim(),
      motherName: (formData.motherName || 'माता का नाम').toUpperCase().trim(),
      dob: formData.dob || '2013-05-10',
      gender: formData.gender,
      category: formData.category,
      course: formData.course,
      stream: formData.stream,
      session: sessionYear,
      centerCode: '10110901003',
      centerName: 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      schoolNameHindi: formData.examCenter || 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      udiseCode: '10110901003',
      nationality: 'INDIAN',
      mobile: formData.mobile || '9876543210',
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      address: formData.address || 'मधेपुरा, बिहार - 852113',
      photoUrl: formData.photoUrl || (formData.gender === 'Female' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
      photoKey: formData.photoKey || undefined,
      subjects: getDefaultSubjectsForStream(formData.course, formData.stream),
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      feeStatus: 'Paid',
      examCenter: formData.examCenter || 'मध्य विद्यालय, अर्राहा, घैलाढ़ (10110901003)',
    };

    onAddNewStudent(newStudent);
    setFormSuccess(newStudent);
    setMatchedStudent(newStudent);
    setSelectedRegNo(newStudent.regNo);
    setSearchInput(newStudent.regNo);

    // Open the payment gateway for the ₹25 registration fee
    if (onOpenPaymentModal) {
      onOpenPaymentModal(
        'Registration Fee',
        25,
        newStudent.regNo,
        newStudent.name,
        newStudent.fatherName,
        newStudent.mobile
      );
    }

    setActiveTab('search');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">

      {/* Page Header */}
      <div className="no-print bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Digital Registry System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Candidate Registration & Card Download Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Search your Registration Number to auto-fill & download your official BSEDRC Registration Card.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'search'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search & Download Card</span>
            </button>

            <button
              onClick={() => setActiveTab('new-form')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'new-form'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Online Registration</span>
            </button>

          </div>
        </div>
      </div>

      {/* TAB 1: Search Registration Card & Auto-Fill */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="no-print bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="text-center">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">
                  CANDIDATE SELF SERVICE
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  Enter Registration Number or Roll Number
                </h2>
                <p className="text-slate-300 text-xs mt-1">
                  Once you search, candidate particulars, enrolled subjects, and verification QR code will be automatically filled into the Registration Card.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Enter Registration No. or Roll No."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Card</span>
                </button>
              </form>
            </div>
          </div>

          {/* Search Error Alert */}
          {searchError && (
            <div className="no-print bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold block">Record Not Found</span>
                <span>{searchError}</span>
              </div>
            </div>
          )}

          {/* Display Auto-Populated Registration Card */}
          {matchedStudent ? (
            <div className="space-y-4">
              <div className="no-print flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>
                    Details automatically populated for <strong>{matchedStudent.name}</strong> ({matchedStudent.regNo})
                  </span>
                </div>
              </div>

              <StudentRegistrationCard student={matchedStudent} />
            </div>
          ) : (
            !searchError && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                      Bihar Rural Secondary Education Registry
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#142d2a] font-serif">
                      कक्षा 5वीं से 10वीं पंजीयन पत्रक एवं डिजिटल रिकॉर्ड्स (सत्र 2026-27)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Enter your Registration Number above or click any candidate sample chip to automatically preview, verify, and download your council registration slip.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-800">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Instant QR verification &amp; Barcode Enabled</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <div className="relative rounded-xl overflow-hidden border-2 border-[#943217]/30 shadow-md">
                      <img
                        src="/assets/images/students_exam_forms_1789140710491.jpg"
                        alt="Bihar students with registration examination cards"
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] text-white font-medium">
                          आदर्श संकुल विद्यालय छात्र पंजीयन वितरण
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 2: Online Student Registration Form */}
      {activeTab === 'new-form' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block">
              NEW CANDIDATE ADMISSION
            </span>
            <h2 className="text-lg sm:text-xl font-black text-blue-950 uppercase font-serif-title mt-1">
              Online Examination Registration Form 2024-2025
            </h2>
            <p className="text-slate-600 text-xs mt-1">
              Fill in the candidate particulars. Upon submission, an official Registration Number and Registration Card will be automatically generated.
            </p>
          </div>

          <form onSubmit={handleCreateNewStudent} className="space-y-6 text-xs">
            {/* Academic Selection */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-3">
              <h3 className="font-bold text-blue-950 uppercase text-xs flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Course & Stream Selection</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Applying For Course (प्रखंड स्तरीय प्रतिभा प्रतियोगिता - कक्षा 5 से 10वीं) *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value as any })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 font-semibold text-slate-800"
                  >
                    <option value="Secondary Examination (Class 10th)">Secondary Examination (Class 10th - मैट्रिक परीक्षा)</option>
                    <option value="Secondary Foundation (Class 9th)">Secondary Foundation (Class 9th - नवमी फाउंडेशन)</option>
                    <option value="Middle Foundation (Class 8th)">Middle Foundation (Class 8th - आठवीं फाउंडेशन)</option>
                    <option value="Middle Foundation (Class 7th)">Middle Foundation (Class 7th - सातवीं फाउंडेशन)</option>
                    <option value="Middle Foundation (Class 6th)">Middle Foundation (Class 6th - छठी फाउंडेशन)</option>
                    <option value="Primary/Middle Foundation (Class 5th)">Primary Foundation (Class 5th - पांचवी फाउंडेशन)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stream / Group *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value as any })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="General">General Foundation (All Subjects)</option>
                    <option value="Science & Math">Science & Math Special Focus</option>
                    <option value="Social & Humanities">Social Studies & Humanities</option>
                    <option value="Information Technology">Information Technology & Skill Basics</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Registration Details Section */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
              <h3 className="font-bold text-blue-950 uppercase text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-700" />
                  <span>Registration & Session Particulars (पंजीयन एवं सत्र विवरण)</span>
                </span>
                <span className="text-[10px] text-amber-800 font-normal">
                  8-Field System: Name, DOB, Mother, Father, Gender, Class, Registration, Registration year
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Registration Number (पंजीयन संख्या)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSE/2026/801 (Leave blank to auto-generate)"
                    value={formData.regNo}
                    onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-amber-300 font-mono text-xs uppercase focus:ring-1 focus:ring-blue-950"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Optional: Provide custom registration number or leave blank to auto-allocate.
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Registration Year / Session (पंजीयन वर्ष) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={formData.registrationYear}
                    onChange={(e) => setFormData({ ...formData, registrationYear: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-amber-300 font-mono text-xs font-bold text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Printed on official registration cards and certificates.
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Bio-data */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-950 uppercase text-xs">
                Candidate Personal Particulars
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Candidate Full Name (in Capital) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROHIT SHARMA"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 uppercase font-semibold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SURESH SHARMA"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mother's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KAMLA SHARMA"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth (DOB) *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 block">
                      विद्यालय / परीक्षा केंद्र (School / Center) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSchoolModal(true)}
                      className="text-[11px] text-[#943217] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <School className="w-3.5 h-3.5" />
                      <span>सहरसा/मधेपुरा स्कूल सूची</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="स्कूल का नाम चुनें या लिखें..."
                      value={formData.examCenter}
                      onChange={(e) => setFormData({ ...formData, examCenter: e.target.value })}
                      className="w-full bg-white p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSchoolModal(true)}
                      className="px-3 py-2 bg-[#142d2a] hover:bg-[#1e4641] text-amber-300 font-bold rounded-lg text-xs shrink-0 flex items-center gap-1 cursor-pointer"
                      title="Browse 2,142 Schools from UDISE+"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>सूची</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Permanent Residential Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House No., Street, Village/Town, District, State, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            {/* Auto Subject Preview based on selection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-2">
                Enrolled Subjects Automatically Allocated for {formData.course} ({formData.stream}):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getDefaultSubjectsForStream(formData.course, formData.stream).map((sub) => (
                  <div key={sub.code} className="bg-white p-2 rounded border border-slate-200 text-[11px]">
                    <span className="font-mono font-bold text-blue-900 mr-1">{sub.code}:</span>
                    <span>{sub.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded ml-1 font-semibold">
                      {sub.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="text-slate-500 text-[11px]">
                Registration Fee: <span className="font-bold text-slate-900">₹25.00</span> (Payable now via Payment Gateway)
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Submit & Generate Registration Card</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Bulk upload removed */}
      {false && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">
                ADMINISTRATIVE & INSTITUTIONAL BULK UPLOAD
              </span>
              <h2 className="text-lg sm:text-xl font-black text-blue-950 uppercase font-serif-title mt-1">
                Upload Student Batch (कक्षा 5वीं - 10वीं)
              </h2>
              <p className="text-slate-600 text-xs mt-1">
                Upload candidates directly. Their official Registration Cards will be activated immediately and ready for instant search and download.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href="/bsedrc_student_registration_template.csv"
                download="bsedrc_student_registration_template.csv"
                className="text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3 py-1.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </a>
              <button
                type="button"
                onClick={() => setBulkText(SAMPLE_BULK_STUDENTS_EXCEL)}
                className="text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                Insert Sample Excel Data
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* Mandated 8-Column Format Banner */}
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 space-y-2">
              <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide block">
                Standard 8-Column Upload Format (Excel / Google Sheets / CSV):
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="bg-blue-950 text-amber-300 font-bold px-2 py-0.5 rounded">1. Name</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">2. DOB</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">3. Mother</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">4. Father</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">5. Gender</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">6. Class</span>
                <span className="bg-slate-800 text-white font-bold px-2 py-0.5 rounded">7. Registration</span>
                <span className="bg-blue-950 text-amber-300 font-bold px-2 py-0.5 rounded">8. Registration year</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Direct copy-paste from Excel / Google Sheets is supported. Separate columns using <strong>Tab</strong> or <strong>Comma</strong>.
              </p>
            </div>

            {/* Textarea for pasting records */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs block">
                  Paste Tabular / CSV Student Records (1 row per candidate):
                </label>
                {bulkText && (
                  <button
                    type="button"
                    onClick={() => setBulkText('')}
                    className="text-[10px] text-rose-600 hover:underline"
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <textarea
                rows={7}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"Name\tDOB\tMother\tFather\tGender\tClass\tRegistration\tRegistration year\nPRIYA KUMARI\t15/08/2012\tSUNITA DEVI\tRAMESHWAR YADAV\tFemale\tClass 8th\tBSE/2026/801\t2026\nSANJAY KUMAR\t10/05/2011\tMEENA DEVI\tSHIV CHARAN\tMale\tClass 10th\tBSE/2026/802\t2026"}
                className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-300 text-xs font-mono focus:bg-white focus:outline-blue-900"
              />

              {/* Real-time Parsed Count Indicator */}
              {bulkText.trim().length > 0 && (
                <div className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 flex items-center justify-between">
                  <span>Detected Candidates:</span>
                  <span className="font-bold bg-blue-900 text-white px-2.5 py-0.5 rounded-full text-[11px]">
                    {parseBulkStudentInput(bulkText, 0).length} Candidates Ready to Ingest
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!bulkText.trim()) {
                    alert('Please enter or paste student records');
                    return;
                  }

                  const parsed = parseBulkStudentInput(bulkText, students.length);
                  if (parsed.length === 0) {
                    alert('No valid candidate records found. Please check format:\nName, DOB, Mother, Father, Gender, Class, Registration, Registration year');
                    return;
                  }

                  onBulkUploadStudents(parsed);
                  setBulkStatus(`Successfully added and activated ${parsed.length} candidate registration cards!`);
                  if (parsed.length > 0) {
                    setSelectedRegNo(parsed[0].regNo);
                    findAndSetStudent(parsed[0].regNo);
                    setTimeout(() => {
                      setActiveTab('search');
                    }, 1200);
                  }
                }}
                className="w-full bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Upload & Activate Registration Cards</span>
              </button>
            </div>
          </div>

          {bulkStatus && (
            <div className="bg-emerald-100 text-emerald-900 p-4 rounded-xl text-xs flex items-center gap-2 font-bold max-w-3xl mx-auto">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{bulkStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Official School List Selection Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 max-h-[85vh] flex flex-col border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-[#943217]" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    सहरसा एवं मधेपुरा आधिकारिक विद्यालय सूची (UDISE+)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    अपना स्कूल खोजकर सीधे चुनें (2,142 मान्यता प्राप्त विद्यालय)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                value={schoolSearchText}
                onChange={(e) => setSchoolSearchText(e.target.value)}
                placeholder="स्कूल का नाम, ब्लॉक या UDISE कोड लिखें..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#142d2a]"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 text-xs">
              {OFFICIAL_SCHOOLS_LIST.filter((s) => {
                if (!schoolSearchText.trim()) return true;
                const q = schoolSearchText.toLowerCase();
                return s.name.toLowerCase().includes(q) || s.udiseCode.includes(q) || s.block.toLowerCase().includes(q);
              }).slice(0, 40).map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      examCenter: `${sch.name} (${sch.udiseCode}) - ${sch.district}`,
                    }));
                    setShowSchoolModal(false);
                    setSchoolSearchText('');
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50 rounded-lg border border-slate-200 hover:border-amber-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sch.name}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-[#142d2a] font-bold">
                      {sch.udiseCode}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Block: {sch.block}, District: {sch.district}</span>
                    <span className="text-emerald-700 font-bold">क्लिक करके चुनें</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
