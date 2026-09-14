import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle, 
  Clock, 
  Calendar, 
  IndianRupee, 
  FileText, 
  User, 
  Award, 
  ShieldCheck, 
  Download, 
  Printer, 
  X,
  CreditCard,
  QrCode
} from 'lucide-react';
import { JobVacancy, JobApplication } from '../types';
import { OfficialSignature } from '../components/OfficialSignature';

interface JobPortalViewProps {
  vacancies: JobVacancy[];
  applications: JobApplication[];
  onAddNewApplication: (app: JobApplication) => void;
  onOpenPaymentModal: (purpose: any, amount: number, refNo: string, name: string, father: string, mobile: string) => void;
}

export const JobPortalView: React.FC<JobPortalViewProps> = ({
  vacancies,
  applications,
  onAddNewApplication,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'vacancies' | 'track'>('vacancies');
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application form fields
  const [candidateName, setCandidateName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [category, setCategory] = useState('General');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [percentage, setPercentage] = useState('');
  const [address, setAddress] = useState('');
  const [examCenterPref, setExamCenterPref] = useState('Madhepura Center (Zone 1 - Campus / Sahugarh)');

  // Track state
  const [trackInput, setTrackInput] = useState('');
  const [trackedApplication, setTrackedApplication] = useState<JobApplication | null>(applications[0] || null);
  const [trackError, setTrackError] = useState('');

  const handleOpenApply = (vac: JobVacancy) => {
    setSelectedVacancy(vac);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    const randomAppNo = `JOB-2025-${selectedVacancy.postCode.split('/').pop()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: JobApplication = {
      id: 'app-' + Date.now(),
      applicationNo: randomAppNo,
      vacancyId: selectedVacancy.id,
      postTitle: selectedVacancy.title,
      candidateName: candidateName.toUpperCase().trim(),
      fatherName: fatherName.toUpperCase().trim(),
      dob: dob || '1995-01-01',
      gender: gender,
      category: category,
      email: email || `${candidateName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: phone,
      qualification: qualification || 'Bachelor Degree',
      percentage: percentage ? `${percentage}%` : '75.00%',
      address: address || 'Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar - 852113',
      appliedDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      amount: selectedVacancy.applicationFee,
      examCenterPref: examCenterPref,
      status: 'Admit Card Available',
      admitCardReady: true,
    };

    onAddNewApplication(newApp);
    setIsApplyModalOpen(false);
    setTrackedApplication(newApp);
    setTrackInput(newApp.applicationNo);
    setActiveTab('track');
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackInput.trim().toLowerCase();
    if (!clean) return;

    const found = applications.find((a) => a.applicationNo.toLowerCase() === clean || a.phone.includes(clean));
    if (found) {
      setTrackedApplication(found);
      setTrackError('');
    } else {
      setTrackedApplication(null);
      setTrackError(`No application found for ID/Phone: "${clean}". Please verify your Application Number.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Direct Board Recruitment 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Employee Job Portal & Recruitment Cell
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Apply online for administrative, pedagogical, and technical posts. Download Hall Ticket / Admit Card.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('vacancies')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'vacancies'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Current Vacancies</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Track Application / Admit Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Current Vacancies */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vacancies.map((vac) => (
              <div
                key={vac.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                      {vac.postCode}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {vac.vacancies} Openings
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {vac.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">
                    Department: {vac.department}
                  </span>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {vac.description}
                  </p>

                  <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pay Scale:</span>
                      <span className="font-bold text-slate-900">{vac.payScale}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age Limit:</span>
                      <span className="font-medium text-slate-800">{vac.ageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Application Fee:</span>
                      <span className="font-bold text-blue-900 font-mono">₹{vac.applicationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Date to Apply:</span>
                      <span className="font-bold text-rose-700">{vac.lastDate}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Essential Qualifications:</span>
                    <p className="text-[11px] text-slate-600 italic">
                      {vac.qualification}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Closing: {vac.lastDate}</span>
                  </div>

                  <button
                    onClick={() => handleOpenApply(vac)}
                    className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Apply Online</span>
                    <IndianRupee className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Track Application & Admit Card */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Tracker Search Form */}
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">
                  Track Job Application & Download Admit Card
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Enter your Application ID (e.g. JOB-2025-DEO-8812) or Registered Phone Number.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter Application No. (e.g. JOB-2025-DEO-8812)"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="flex-1 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </button>
              </form>

              {/* Sample Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Try Sample Applications:</span>
                {applications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setTrackInput(app.applicationNo);
                      setTrackedApplication(app);
                      setTrackError('');
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-0.5 rounded font-mono text-[10px] border border-slate-700"
                  >
                    {app.applicationNo} ({app.candidateName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {trackError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs">
              {trackError}
            </div>
          )}

          {/* Application Slip & Admit Card View */}
          {trackedApplication && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="no-print bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold">
                    Application ID: <span className="font-mono text-amber-400">{trackedApplication.applicationNo}</span>
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                    STATUS: {trackedApplication.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Admit Card</span>
                  </button>
                </div>
              </div>

              {/* Printable Hall Ticket Canvas */}
              <div className="printable-area p-8 bg-white">
                <div className="border-4 border-slate-900 p-6 relative">
                  
                  {/* Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                    <div className="text-xs font-bold text-amber-800 font-hindi">
                      बिहार राज्य संस्कृत एवं ग्रामीण विकास परिषद
                    </div>
                    <h2 className="text-lg font-black text-blue-950 uppercase font-serif-title">
                      BOARD OF SECONDARY EDUCATION & RURAL DEVELOPMENT COUNCIL
                    </h2>
                    <span className="text-[10px] text-slate-500 block">
                      Recruitment & Staff Selection Board | Sahugarh, Madhepura, Bihar - 852113
                    </span>
                    <div className="inline-block bg-blue-950 text-amber-300 font-bold px-4 py-0.5 rounded text-xs uppercase tracking-wider mt-2">
                      EXAMINATION ADMIT CARD / HALL TICKET 2025
                    </div>
                  </div>

                  {/* Application Data Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="sm:col-span-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">Application No.</span>
                          <span className="font-mono font-bold text-blue-900">{trackedApplication.applicationNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">Post Applied For</span>
                          <span className="font-bold text-slate-900">{trackedApplication.postTitle}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">Candidate Name</span>
                          <span className="font-bold text-slate-900 uppercase">{trackedApplication.candidateName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">Father's Name</span>
                          <span className="font-bold text-slate-800 uppercase">{trackedApplication.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">DOB & Gender</span>
                          <span className="font-semibold text-slate-800">{trackedApplication.dob} ({trackedApplication.gender})</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase">Category</span>
                          <span className="font-semibold text-slate-800">{trackedApplication.category}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-2">
                        <span className="text-slate-500 text-[10px] block uppercase">Examination Venue / Center</span>
                        <span className="font-bold text-blue-950 text-sm block">{trackedApplication.examCenterPref}</span>
                        <span className="text-[11px] text-slate-600">Reporting Time: 09:00 AM | Exam Date: 2025-11-25</span>
                      </div>
                    </div>

                    {/* Photo & QR */}
                    <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded border border-slate-200 space-y-2">
                      <div className="w-24 h-28 bg-slate-200 border border-slate-300 rounded overflow-hidden flex items-center justify-center text-slate-400">
                        <User className="w-12 h-12 text-slate-400" />
                      </div>
                      <div className="w-16 h-16 bg-white border border-slate-300 p-1 flex items-center justify-center">
                        <QrCode className="w-14 h-14 text-slate-800" />
                      </div>
                      <span className="text-[8px] font-mono text-slate-500">Official Admit QR</span>
                    </div>
                  </div>

                  {/* Instructions & Signatory */}
                  <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-[10px] text-slate-500 leading-relaxed">
                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-700 block">EXAM INSTRUCTIONS:</span>
                      <p>1. Carry this printed Admit Card along with original Aadhaar Card or Voter ID.</p>
                      <p>2. Electronic gadgets, mobile phones, and calculators are strictly prohibited inside examination hall.</p>
                      <p>3. Examination Center: Sahugarh / BNMV Campus, Madhepura, Bihar - 852113.</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <OfficialSignature
                        officerName="Bibhishan Kumar"
                        designation="Chief Executive Officer"
                        councilSubtitle="BRSV & RCT Council, Madhepura"
                        align="right"
                        size="sm"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Online Job Application Modal */}
      {isApplyModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {selectedVacancy.postCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Online Application: {selectedVacancy.title}
                </h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMIT KUMAR"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOHAN LAL"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Highest Academic Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.A / B.Ed / BCA / M.A"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Marks Percentage (%) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 74.50"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Exam Center Preference</label>
                <select
                  value={examCenterPref}
                  onChange={(e) => setExamCenterPref(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-300"
                >
                  <option value="Madhepura Center (Zone 1 - BNMV Campus / Sahugarh)">Madhepura Center (Zone 1 - BNMV Campus / Sahugarh)</option>
                  <option value="Madhepura Central Hub (Zone 2 - College Chowk)">Madhepura Central Hub (Zone 2 - College Chowk)</option>
                  <option value="Madhepura Rural Circle (Zone 3 - Shankarpur Road)">Madhepura Rural Circle (Zone 3 - Shankarpur Road)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Address for Correspondence *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Complete Address with Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-300"
                />
              </div>

              {/* Fee Notice */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600 block">Application Fee:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">₹{selectedVacancy.applicationFee}.00</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">
                  Instant Hall Ticket Generation on Submission
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-lg shadow-md"
                >
                  Submit Application & Pay ₹{selectedVacancy.applicationFee}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
