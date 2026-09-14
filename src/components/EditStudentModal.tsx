import React, { useState } from 'react';
import { 
  X, 
  Save, 
  User, 
  BookOpen, 
  School, 
  Plus, 
  Trash2, 
  CheckCircle, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Hash,
  ShieldCheck
} from 'lucide-react';
import { Student } from '../types';

interface EditStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Student) => Promise<void> | void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'registration' | 'subjects'>('personal');
  const [formData, setFormData] = useState<Student>({ ...student });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // New subject state
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubType, setNewSubType] = useState<'Theory' | 'Practical' | 'Compulsory'>('Theory');

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Student, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSubject = () => {
    if (!newSubCode.trim() || !newSubName.trim()) {
      alert('Please enter both subject code and subject name.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          code: newSubCode.trim(),
          name: newSubName.trim(),
          type: newSubType
        }
      ]
    }));

    setNewSubCode('');
    setNewSubName('');
    setNewSubType('Theory');
  };

  const handleRemoveSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.regNo.trim()) {
      setErrorMsg('Candidate Name and Registration Number are required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      await onSave({
        ...formData,
        name: formData.name.toUpperCase().trim(),
        fatherName: (formData.fatherName || '').toUpperCase().trim(),
        motherName: (formData.motherName || '').toUpperCase().trim(),
        regNo: formData.regNo.trim(),
        rollNo: formData.rollNo.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save student changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Edit Student Registration Form
                </h2>
                <span className="bg-amber-400 text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  संशोधन प्रपत्र
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Modifying registration record for <span className="font-bold text-white uppercase">{formData.name}</span> ({formData.regNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS HEADER */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-2.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'personal'
                ? 'border-blue-900 text-blue-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal & Mother Name (व्यक्तिगत)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-2.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'academic'
                ? 'border-blue-900 text-blue-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>2. Course & School (शैक्षणिक)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`py-2.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'subjects'
                ? 'border-blue-900 text-blue-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Subjects ({formData.subjects?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registration')}
            className={`py-2.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'registration'
                ? 'border-blue-900 text-blue-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>4. Registration ID & Roll No</span>
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Candidate Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name (परीक्षार्थी का नाम) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold uppercase focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. AMIT KUMAR"
                  />
                </div>

                {/* Mother Name - PROMINENT AS REQUESTED */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                  <label className="block text-xs font-extrabold text-blue-950 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mother's Name (माता का नाम)</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-bold uppercase focus:ring-1 focus:ring-blue-900"
                    placeholder="e.g. SUNITA DEVI"
                  />
                  <span className="text-[10px] text-amber-800 block mt-1">
                    Mother's name is printed on the official registration card and marksheets.
                  </span>
                </div>

                {/* Father Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Father's Name (पिता का नाम)
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold uppercase focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. RAMESH PRASAD"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth (जन्म तिथि)
                  </label>
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="DD-MM-YYYY or YYYY-MM-DD"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender (लिंग)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category (कोटि / वर्ग)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="General">General (सामान्य)</option>
                    <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाति)</option>
                    <option value="ST">ST (अनुसूचित जनजाति)</option>
                    <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
                  </select>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Mobile Number (मोबाइल नं.)
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (ईमेल पता)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="candidate@example.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complete Residential Address (स्थायी पता)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  placeholder="Village/Mohalla, Post, Block, District, Bihar, PIN"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC & INSTITUTIONAL */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrolled Course (पाठ्यक्रम)
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="Secondary Examination (Class 10th)">Secondary Examination (Class 10th)</option>
                    <option value="Secondary Foundation (Class 9th)">Secondary Foundation (Class 9th)</option>
                    <option value="Middle Foundation (Class 8th)">Middle Foundation (Class 8th)</option>
                    <option value="Middle Foundation (Class 7th)">Middle Foundation (Class 7th)</option>
                    <option value="Middle Foundation (Class 6th)">Middle Foundation (Class 6th)</option>
                    <option value="Primary/Middle Foundation (Class 5th)">Primary/Middle Foundation (Class 5th)</option>
                    <option value="Foundation Bridge & Skill (Class 5th-10th)">Foundation Bridge & Skill (Class 5th-10th)</option>
                  </select>
                </div>

                {/* Stream */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stream / Group (संकाय)
                  </label>
                  <select
                    value={formData.stream}
                    onChange={(e) => handleInputChange('stream', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="General">General</option>
                    <option value="Science & Math">Science & Math</option>
                    <option value="Social & Humanities">Social & Humanities</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Skill & Vocational">Skill & Vocational</option>
                  </select>
                </div>

                {/* Session */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Session (शैक्षणिक सत्र)
                  </label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => handleInputChange('session', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. 2024-2025, 2026-2027"
                  />
                </div>

                {/* Center / UDISE Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Center / UDISE Code (केंद्र कोड / यू-डायस)
                  </label>
                  <input
                    type="text"
                    value={formData.centerCode || formData.udiseCode || ''}
                    onChange={(e) => {
                      handleInputChange('centerCode', e.target.value);
                      handleInputChange('udiseCode', e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. 10110901003 or CTR-MD-104"
                  />
                </div>

                {/* Center Name (English) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    School / Center Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.centerName}
                    onChange={(e) => handleInputChange('centerName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold uppercase focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. MIDDLE SCHOOL ARRAHA, GHAILADH"
                  />
                </div>

                {/* School Name (Hindi) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    School Name in Hindi (विद्यालय का नाम हिंदी में)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolNameHindi || formData.centerName || ''}
                    onChange={(e) => handleInputChange('schoolNameHindi', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. मध्य विद्यालय, अर्राहा, घैलाढ़"
                  />
                </div>

                {/* Examination Center Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Allocated Examination Center (आवंटित परीक्षा केंद्र)
                  </label>
                  <input
                    type="text"
                    value={formData.examCenter}
                    onChange={(e) => handleInputChange('examCenter', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                    placeholder="e.g. मध्य विद्यालय, अर्राहा, घैलाढ़ (10110901003)"
                  />
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Verification Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="Verified">Verified (सत्यापित)</option>
                    <option value="Pending">Pending (लंबित)</option>
                    <option value="Suspended">Suspended (निलंबित)</option>
                  </select>
                </div>

                {/* Fee Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrolment Fee Status
                  </label>
                  <select
                    value={formData.feeStatus}
                    onChange={(e) => handleInputChange('feeStatus', e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:bg-white focus:outline-blue-900"
                  >
                    <option value="Paid">Paid (भुगतान पूर्ण)</option>
                    <option value="Pending">Pending (अदत्त)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Enrolled Subject Papers ({formData.subjects?.length || 0})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Modify or add subjects associated with this registration record.
                  </p>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3 border-b">Code</th>
                      <th className="py-2 px-3 border-b">Subject Name</th>
                      <th className="py-2 px-3 border-b">Type</th>
                      <th className="py-2 px-3 border-b text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.subjects?.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-blue-950">{sub.code}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-2 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sub.type === 'Practical' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {sub.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded transition-colors"
                            title="Remove Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Subject Row */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Add New Subject to Registration Card:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Sub Code (e.g. 101)"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Subject Name (e.g. Mathematics)"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="sm:col-span-2 bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newSubType}
                      onChange={(e) => setNewSubType(e.target.value as any)}
                      className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold flex-1"
                    >
                      <option value="Theory">Theory</option>
                      <option value="Practical">Practical</option>
                      <option value="Compulsory">Compulsory</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRATION ID & ROLL NO */}
          {activeTab === 'registration' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Registration Number */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-blue-900" />
                    <span>Registration Number (पंजीकरण संख्या)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.regNo}
                    onChange={(e) => handleInputChange('regNo', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-blue-950 focus:outline-blue-900"
                    placeholder="e.g. MPE-2026-MDH-120 or BSE/2025/1001"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Students use this ID on the public portal to locate their registration card.
                  </span>
                </div>

                {/* Roll Number */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-blue-900" />
                    <span>Roll Number (क्रमांक)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => handleInputChange('rollNo', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-800 focus:outline-blue-900"
                    placeholder="e.g. 202608120"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Official roll number for exam center seating.
                  </span>
                </div>
              </div>

              {/* Registration Confirmation Info */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Verified Registration Record</span>
                </span>
                <p className="text-xs text-emerald-800 mt-1">
                  Registration credentials are automatically synchronized with the candidate's official Registration Card (पंजीयन पत्रक) and council records.
                </p>
              </div>
            </div>
          )}

          {/* MODAL ACTIONS FOOTER */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              Changes will immediately update the database and public registration card.
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Record...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Update Registration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
