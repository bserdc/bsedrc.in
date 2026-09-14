import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Copy, 
  Check, 
  Users, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  Layers, 
  Search, 
  Filter, 
  Share2,
  Building2,
  Printer,
  Download
} from 'lucide-react';
import { CustomForm, CustomFormField, FormFieldType, FormSubmission } from '../types';
import { getSignedUrlFromR2 } from '../lib/storage';

interface AdminFormBuilderProps {
  customForms: CustomForm[];
  formSubmissions: FormSubmission[];
  onAddNewForm: (form: CustomForm) => void;
  onUpdateForm: (form: CustomForm) => void;
  onDeleteForm: (id: string) => void;
  onTogglePublishForm: (id: string) => void;
  onUpdateSubmissionStatus: (id: string, status: FormSubmission['status']) => void;
}

export const AdminFormBuilder: React.FC<AdminFormBuilderProps> = ({
  customForms,
  formSubmissions,
  onAddNewForm,
  onUpdateForm,
  onDeleteForm,
  onTogglePublishForm,
  onUpdateSubmissionStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'forms' | 'submissions'>('forms');
  const [selectedFormForSubmissions, setSelectedFormForSubmissions] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);

  // Form Editor State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<CustomForm['category']>('Examination');
  const [formFee, setFormFee] = useState<number>(0);
  const [formLastDate, setFormLastDate] = useState<string>('2025-08-31');
  const [formStatus, setFormStatus] = useState<CustomForm['status']>('Published');
  const [formFields, setFormFields] = useState<CustomFormField[]>([
    {
      id: 'field-1',
      label: 'Candidate Name (परीक्षार्थी का नाम)',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
    },
    {
      id: 'field-2',
      label: 'Mobile Number (मोबाइल नंबर)',
      type: 'phone',
      placeholder: '10-digit mobile number',
      required: true,
    },
    {
      id: 'field-3',
      label: 'School / Institution (स्कूल चयन)',
      type: 'school_select',
      placeholder: 'Select school from directory...',
      required: true,
      helpText: 'Saharsa and Madhepura UDISE school list',
    },
  ]);

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/?tab=online-forms&formId=${formId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(formId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleOpenCreateModal = (formToEdit?: CustomForm) => {
    if (formToEdit) {
      setEditingFormId(formToEdit.id);
      setFormTitle(formToEdit.title);
      setFormDesc(formToEdit.description);
      setFormCategory(formToEdit.category);
      setFormFee(formToEdit.applicationFee);
      setFormLastDate(formToEdit.lastDate || '2025-08-31');
      setFormStatus(formToEdit.status);
      setFormFields([...formToEdit.fields]);
    } else {
      setEditingFormId(null);
      setFormTitle('');
      setFormDesc('');
      setFormCategory('Examination');
      setFormFee(0);
      setFormLastDate('2025-08-31');
      setFormStatus('Published');
      setFormFields([
        {
          id: 'field-1',
          label: 'Candidate Name (परीक्षार्थी का नाम)',
          type: 'text',
          placeholder: 'Enter candidate name',
          required: true,
        },
        {
          id: 'field-2',
          label: 'Roll / Registration Number',
          type: 'text',
          placeholder: 'e.g. 2510101',
          required: true,
        },
        {
          id: 'field-3',
          label: 'School / Center (विद्यालय)',
          type: 'school_select',
          placeholder: 'Select from verified UDISE school list...',
          required: true,
        },
        {
          id: 'field-4',
          label: 'Mobile Number (मोबाइल नंबर)',
          type: 'phone',
          placeholder: '10-digit number',
          required: true,
        }
      ]);
    }
    setIsCreateModalOpen(true);
  };

  const handleAddField = () => {
    const newField: CustomFormField = {
      id: 'field-' + Date.now(),
      label: `New Field ${formFields.length + 1}`,
      type: 'text',
      placeholder: 'Enter value',
      required: true,
    };
    setFormFields([...formFields, newField]);
  };

  const handleRemoveField = (id: string) => {
    if (formFields.length <= 1) {
      alert('कम से कम एक फील्ड होना आवश्यक है (At least 1 field is required)');
      return;
    }
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (id: string, key: keyof CustomFormField, value: any) => {
    setFormFields(
      formFields.map((f) => {
        if (f.id === id) {
          return { ...f, [key]: value };
        }
        return f;
      })
    );
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('कृपया फॉर्म का शीर्षक लिखें (Please enter Form Title)');
      return;
    }

    if (editingFormId) {
      const existing = customForms.find((f) => f.id === editingFormId);
      if (existing) {
        const updated: CustomForm = {
          ...existing,
          title: formTitle,
          description: formDesc,
          category: formCategory,
          applicationFee: Number(formFee) || 0,
          lastDate: formLastDate,
          status: formStatus,
          fields: formFields,
        };
        onUpdateForm(updated);
      }
    } else {
      const newForm: CustomForm = {
        id: 'form-' + Date.now(),
        title: formTitle,
        description: formDesc,
        category: formCategory,
        applicationFee: Number(formFee) || 0,
        lastDate: formLastDate,
        createdAt: new Date().toISOString().split('T')[0],
        status: formStatus,
        fields: formFields,
        submissionsCount: 0,
      };
      onAddNewForm(newForm);
    }

    setIsCreateModalOpen(false);
  };

  const filteredSubmissions = formSubmissions.filter((sub) => {
    if (selectedFormForSubmissions !== 'all' && sub.formId !== selectedFormForSubmissions) {
      return false;
    }
    if (submissionSearch.trim()) {
      const q = submissionSearch.toLowerCase();
      return (
        sub.applicantName.toLowerCase().includes(q) ||
        sub.receiptNo.toLowerCase().includes(q) ||
        sub.applicantMobile.includes(q) ||
        sub.formTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Header */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Form Builder &amp; Publisher Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-serif uppercase">
            डायनेमिक फॉर्म क्रिएटर एवं पब्लिशर
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            अपनी आवश्यकता अनुसार स्क्रूटिनी, संबद्धता, छात्रवृत्ति अथवा किसी भी प्रकार का नया फॉर्म बनाकर सीधे वेबसाइट पर प्रकाशित करें।
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('forms')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubTab === 'forms'
                  ? 'bg-[#142d2a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forms ({customForms.length})
            </button>
            <button
              onClick={() => setActiveSubTab('submissions')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubTab === 'submissions'
                  ? 'bg-[#142d2a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submissions ({formSubmissions.length})
            </button>
          </div>

          <button
            onClick={() => handleOpenCreateModal()}
            className="bg-[#943217] hover:bg-[#7a2812] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ नया फॉर्म बनाएं (Create Form)</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: FORMS LIST */}
      {/* ============================================================ */}
      {activeSubTab === 'forms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customForms.map((form) => {
            const isPublished = form.status === 'Published';
            const subsForThis = formSubmissions.filter((s) => s.formId === form.id).length;

            return (
              <div
                key={form.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#142d2a] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {form.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {isPublished ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{form.status}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
                    {form.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {form.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Application Fee</span>
                      <span className="font-bold text-[#943217] text-xs">
                        {form.applicationFee > 0 ? `₹${form.applicationFee}` : 'Free'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Fields</span>
                      <span className="font-bold text-slate-800 text-xs">{form.fields.length} Inputs</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Responses</span>
                      <span className="font-bold text-blue-900 text-xs">{subsForThis} Received</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePublishForm(form.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                        isPublished
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isPublished ? 'Unpublish (अप्रसारित)' : 'Publish (प्रकाशित करें)'}
                    </button>

                    <button
                      onClick={() => handleCopyLink(form.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      title="Copy Public Link"
                    >
                      {copiedLink === form.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFormForSubmissions(form.id);
                        setActiveSubTab('submissions');
                      }}
                      className="text-blue-900 hover:text-blue-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Responses</span>
                    </button>

                    <button
                      onClick={() => handleOpenCreateModal(form)}
                      className="text-slate-600 hover:text-slate-900 p-1.5 cursor-pointer"
                      title="Edit Form"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`क्या आप फॉर्म "${form.title}" हटाना चाहते हैं?`)) {
                          onDeleteForm(form.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1.5 cursor-pointer"
                      title="Delete Form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: SUBMISSIONS VIEWER */}
      {/* ============================================================ */}
      {activeSubTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Submissions Filter */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="font-bold text-slate-700">फॉर्म चुनें:</span>
              <select
                value={selectedFormForSubmissions}
                onChange={(e) => setSelectedFormForSubmissions(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
              >
                <option value="all">सभी फॉर्म्स (All Forms)</option>
                {customForms.map((f) => (
                  <option key={f.id} value={f.id}>{f.title}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder="नाम, मोबाइल, रसीद नंबर से खोजें..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#142d2a] text-white uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Receipt No.</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Form Name</th>
                  <th className="py-2.5 px-3">Mobile</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Fee / Status</th>
                  <th className="py-2.5 px-3">Application Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#943217]">{sub.receiptNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{sub.applicantName}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{sub.formTitle}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{sub.applicantMobile}</td>
                    <td className="py-2.5 px-3 text-slate-500">{sub.submittedAt}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-emerald-700">{sub.paymentStatus} (₹{sub.amount})</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={sub.status}
                        onChange={(e) => onUpdateSubmissionStatus(sub.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                          sub.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : sub.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setViewingSubmission(sub)}
                        className="text-blue-900 hover:text-blue-950 font-bold text-xs bg-blue-50 px-2 py-1 rounded border border-blue-200 cursor-pointer"
                      >
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              कोई आवेदन नहीं मिला (No submissions found)
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT CUSTOM FORM */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 border border-slate-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#142d2a] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-amber-300">
                  {editingFormId ? 'फॉर्म संपादित करें (Edit Form)' : 'नया फॉर्म बनाएं एवं प्रकाशित करें (Create New Form)'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  फील्ड्स, प्रकार, विवरण एवं आवेदन शुल्क निर्धारित करें
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800 block">फॉर्म का शीर्षक (Form Title) *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 10th Scrutiny Form 2025 या Sports Admission Form"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#142d2a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">श्रेणी (Category)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Admission">Admission</option>
                    <option value="Affiliation">Affiliation</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Certificate">Certificate</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">विवरण एवं निर्देश (Description &amp; Guidelines)</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="परीक्षार्थियों के लिए महत्वपूर्ण निर्देश या नियम..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              {/* Fee, Last Date, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">आवेदन शुल्क (Fee in ₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formFee}
                    onChange={(e) => setFormFee(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-[#943217]"
                  />
                  <span className="text-[10px] text-slate-500">₹0 = निःशुल्क फॉर्म</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">अंतिम तिथि (Last Date)</label>
                  <input
                    type="date"
                    value={formLastDate}
                    onChange={(e) => setFormLastDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">प्रकाशन स्थिति (Status)</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                  >
                    <option value="Published">Published (सीधे वेबसाइट पर दिखाएं)</option>
                    <option value="Draft">Draft (ड्राफ्ट में रखें)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Field Builder Header */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#943217]" />
                    <span>फॉर्म फील्ड्स बिल्डर (Form Fields List)</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleAddField}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ फील्ड जोड़ें</span>
                  </button>
                </div>

                {/* Fields Repeater */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formFields.map((f, idx) => (
                    <div
                      key={f.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs"
                    >
                      <div className="col-span-1 text-center font-bold text-slate-400">
                        {idx + 1}
                      </div>

                      {/* Label */}
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          value={f.label}
                          onChange={(e) => handleFieldChange(f.id, 'label', e.target.value)}
                          placeholder="Field Label"
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-semibold"
                        />
                      </div>

                      {/* Type */}
                      <div className="col-span-3">
                        <select
                          value={f.type}
                          onChange={(e) => handleFieldChange(f.id, 'type', e.target.value as FormFieldType)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                        >
                          <option value="text">Text (टेक्स्ट)</option>
                          <option value="number">Number (संख्या)</option>
                          <option value="phone">Phone / Mobile</option>
                          <option value="email">Email ID</option>
                          <option value="date">Date (तिथि)</option>
                          <option value="select">Dropdown Select</option>
                          <option value="school_select">School Directory Picker</option>
                          <option value="textarea">Long Textarea</option>
                          <option value="file">File Upload</option>
                        </select>
                      </div>

                      {/* Required Checkbox */}
                      <div className="col-span-3 flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id={`req-${f.id}`}
                          checked={f.required}
                          onChange={(e) => handleFieldChange(f.id, 'required', e.target.checked)}
                          className="rounded border-slate-300 text-[#142d2a] focus:ring-0"
                        />
                        <label htmlFor={`req-${f.id}`} className="text-[11px] text-slate-700 cursor-pointer">
                          Required
                        </label>
                      </div>

                      {/* Delete */}
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveField(f.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* If select dropdown, show options input */}
                      {f.type === 'select' && (
                        <div className="col-span-12 mt-1 pt-1 border-t border-slate-200">
                          <label className="text-[10px] text-slate-500 block font-medium">
                            Options (कॉमा लगाकर विकल्प लिखें):
                          </label>
                          <input
                            type="text"
                            value={f.options?.join(', ') || ''}
                            onChange={(e) =>
                              handleFieldChange(
                                f.id,
                                'options',
                                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            placeholder="Option 1, Option 2, Option 3"
                            className="w-full p-1 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  className="bg-[#142d2a] hover:bg-[#1f443f] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>{editingFormId ? 'फॉर्म अपडेट करें (Update Form)' : 'फॉर्म सेव एवं प्रकाशित करें (Save & Publish)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW SINGLE SUBMISSION DETAILS */}
      {/* ============================================================ */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-[#943217]">{viewingSubmission.receiptNo}</span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">{viewingSubmission.formTitle}</h3>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-3 space-y-2 text-xs max-h-72 overflow-y-auto">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Applicant Name:</span>
                <span className="font-bold text-slate-900 text-sm">{viewingSubmission.applicantName}</span>
                <span className="text-slate-500 block mt-1">Mobile: {viewingSubmission.applicantMobile}</span>
                <span className="text-slate-500 block">Date: {viewingSubmission.submittedAt}</span>
              </div>

              <div className="space-y-1.5 p-2 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-bold text-slate-700 block">Submitted Information:</span>
                {Object.entries(viewingSubmission.data).map(([k, v]) => {
                  if (k === '_attachments') return null;
                  return (
                    <div key={k} className="border-b border-slate-100 pb-1">
                      <span className="text-slate-500 text-[10px] block">{k}:</span>
                      <span className="font-bold text-slate-800">{String(v)}</span>
                    </div>
                  );
                })}
              </div>

              {viewingSubmission.attachmentKey && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wide">
                      Cloudflare R2 Encrypted Document
                    </span>
                    <span className="text-[11px] text-emerald-950 font-mono truncate block">
                      {viewingSubmission.attachmentKey}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const signedUrl = await getSignedUrlFromR2(viewingSubmission.attachmentKey!);
                        window.open(signedUrl, '_blank', 'noopener,noreferrer');
                      } catch (err: any) {
                        alert(`Could not fetch secure signed URL from Cloudflare R2: ${err.message}`);
                      }
                    }}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#142d2a] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
