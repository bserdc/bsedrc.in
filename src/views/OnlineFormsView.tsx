import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  ArrowRight, 
  Building2, 
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { CustomForm, FormSubmission, SchoolInfo } from '../types';
import { OFFICIAL_SCHOOLS_LIST } from '../data/schoolsData';
import { DynamicQRCode } from '../components/DynamicQRCode';
import { uploadToCloudflareR2 } from '../lib/storage';

interface OnlineFormsViewProps {
  forms: CustomForm[];
  submissions: FormSubmission[];
  onSubmitForm: (submission: FormSubmission) => Promise<FormSubmission | void> | FormSubmission | void;
  onOpenPaymentModal?: (purpose: any, amount: number, refNo: string, name: string, father: string, mobile: string) => void;
}

export const OnlineFormsView: React.FC<OnlineFormsViewProps> = ({
  forms,
  submissions,
  onSubmitForm,
  onOpenPaymentModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Form being filled
  const [activeForm, setActiveForm] = useState<CustomForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolModal, setShowSchoolModal] = useState<string | null>(null); // field id for school picker
  
  // Completed submission modal state
  const [completedSubmission, setCompletedSubmission] = useState<FormSubmission | null>(null);
  const [attachmentMap, setAttachmentMap] = useState<Record<string, { url: string; key: string; name: string }>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publishedForms = forms.filter((f) => f.status === 'Published');

  const filteredForms = publishedForms.filter((f) => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = ['All', 'Examination', 'Admission', 'Affiliation', 'Scholarship', 'Certificate', 'General'];

  const handleOpenForm = (form: CustomForm) => {
    setActiveForm(form);
    setAttachmentMap({});
    setAttachmentError('');
    // initialize empty form data
    const initial: Record<string, any> = {};
    form.fields.forEach((f) => {
      initial[f.label] = '';
    });
    setFormData(initial);
  };

  const handleFieldChange = (label: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;

    // Validate required fields
    for (const field of activeForm.fields) {
      if (field.required && !formData[field.label]) {
        alert(`कृपया "${field.label}" भरें (This field is required)`);
        return;
      }
    }

    const applicantName = formData['परीक्षार्थी का नाम (Candidate Name)'] ||
      formData['छात्र / छात्रा का नाम (Candidate Name)'] ||
      formData['छात्र / छात्रा का नाम (Applicant Name)'] ||
      formData['प्राचार्य / निदेशक का नाम (Principal / Director Name)'] ||
      formData['आवेदक का नाम (Applicant Name)'] ||
      Object.values(formData)[0] ||
      'Candidate';

    const applicantMobile = formData['मोबाइल नंबर (WhatsApp / SMS Alert)'] ||
      formData['संपर्क मोबाइल नंबर (Mobile Number)'] ||
      formData['मोबाइल नंबर (Mobile Number)'] ||
      formData['आधिकारिक संपर्क नंबर (Contact Phone)'] ||
      '9876543210';

    const subId = 'sub-' + Date.now();
    const receiptNo = 'RCP-BSE-' + Math.floor(100000 + Math.random() * 900000);

    const attachmentsList: { url: string; key: string; name: string }[] = Object.values(attachmentMap);
    const primaryAttachment = attachmentsList[0];

    const newSubmission: FormSubmission = {
      id: subId,
      formId: activeForm.id,
      formTitle: activeForm.title,
      applicantName: String(applicantName).toUpperCase(),
      applicantMobile: String(applicantMobile),
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Submitted',
      paymentStatus: activeForm.applicationFee > 0 ? 'Pending' : 'Free',
      amount: activeForm.applicationFee,
      receiptNo,
      attachmentKey: primaryAttachment?.key,
      attachmentUrl: primaryAttachment?.url,
      data: { ...formData, _attachments: attachmentMap },
    };

    setIsSubmitting(true);
    try {
      const savedSubmission = await onSubmitForm(newSubmission);
      const finalSubmission = savedSubmission || newSubmission;
      setActiveForm(null);
      setCompletedSubmission(finalSubmission);
      if (activeForm.applicationFee > 0 && onOpenPaymentModal) {
        onOpenPaymentModal(
          'Registration Fee',
          activeForm.applicationFee,
          finalSubmission.receiptNo,
          finalSubmission.applicantName,
          '',
          finalSubmission.applicantMobile
        );
      }
    } catch (err: any) {
      alert(err?.message || 'Form submit nahi ho paya. Kripya dobara try karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#142d2a] to-[#254641] text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital E-Governance Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-serif tracking-tight text-amber-300">
            ऑनलाइन आवेदन एवं फॉर्म पोर्टल (Online E-Forms)
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed">
            परिषद द्वारा प्रकाशित सभी आधिकारिक आवेदन पत्र यहाँ उपलब्ध हैं—10वीं/12वीं स्क्रूटिनी, पुनर्मूल्यांकन, स्कूल संबद्धता, छात्रवृत्ति, एवं प्रमाण पत्र संशोधन। बिना किसी कार्यालय के चक्कर लगाए सीधे ऑनलाइन आवेदन करें एवं तत्काल पावती रसीद प्राप्त करें।
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="फॉर्म खोजें (e.g. Scrutiny, Affiliation, Scholarship)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#142d2a]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#142d2a] text-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'सभी फॉर्म (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Published Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#142d2a] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {form.category}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Date: {form.lastDate || 'Open Always'}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg mb-2">
                {form.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {form.description}
              </p>

              {/* Fields Count Badge */}
              <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-500 font-medium">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  📋 {form.fields.length} Required Fields
                </span>
                {form.submissionsCount !== undefined && (
                  <span>👥 {form.submissionsCount} Submissions</span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Application Fee</span>
                <span className="text-sm sm:text-base font-black text-[#943217]">
                  {form.applicationFee > 0 ? `₹${form.applicationFee}/-` : 'निःशुल्क (FREE)'}
                </span>
              </div>

              <button
                onClick={() => handleOpenForm(form)}
                className="bg-[#142d2a] hover:bg-[#1f443f] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>आवेदन करें (Apply Now)</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">कोई फॉर्म नहीं मिला</h3>
          <p className="text-xs text-slate-500 mt-1">
            इस श्रेणी में फिलहाल कोई सक्रिय फॉर्म उपलब्ध नहीं है।
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* DYNAMIC FORM FILLING MODAL */}
      {/* ============================================================ */}
      {activeForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#142d2a] text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase tracking-wide">
                  {activeForm.category}
                </span>
                <h2 className="text-base sm:text-lg font-bold font-serif text-amber-200 mt-1">
                  {activeForm.title}
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Fee: {activeForm.applicationFee > 0 ? `₹${activeForm.applicationFee}/-` : 'निःशुल्क (FREE)'}
                </p>
              </div>
              <button
                onClick={() => setActiveForm(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                कृपया सभी जानकारी अपने आधार कार्ड एवं पूर्व अंकपत्र के अनुसार सावधानीपूर्वक भरें। आवेदन सबमिट होने के बाद आपको डिजिटल पावती रसीद प्राप्त होगी।
              </div>

              {activeForm.fields.map((field) => {
                const isSchoolField = field.type === 'school_select';

                return (
                  <div key={field.id} className="space-y-1">
                    <label className="font-bold text-slate-800 block">
                      {field.label} {field.required && <span className="text-rose-600">*</span>}
                    </label>

                    {/* Field input types */}
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleFieldChange(field.label, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#142d2a] focus:outline-hidden"
                      />
                    ) : field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleFieldChange(field.label, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#142d2a]"
                      >
                        <option value="">-- चुनें (Select) --</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : isSchoolField ? (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            required={field.required}
                            value={formData[field.label] || ''}
                            placeholder={field.placeholder || 'सहरसा या मधेपुरा का स्कूल चुनें...'}
                            className="flex-1 p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-900 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSchoolModal(field.id)}
                            className="bg-[#142d2a] hover:bg-[#1e4641] text-amber-300 px-3 py-2 rounded-lg text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>स्कूल खोजें</span>
                          </button>
                        </div>
                        {field.helpText && (
                          <p className="text-[10px] text-slate-500 mt-1">{field.helpText}</p>
                        )}
                      </div>
                    ) : field.type === 'file' ? (
                      <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-5 h-5 text-slate-400 shrink-0" />
                          <div className="flex-1">
                            <input
                              type="file"
                              disabled={uploadingField === field.label}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setUploadingField(field.label);
                                  setAttachmentError('');
                                  const res = await uploadToCloudflareR2(file, {
                                    category: 'forms',
                                    preferredFileName: `form_${activeForm.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
                                    isPrivate: true
                                  });
                                  if (res.success && res.key) {
                                    setAttachmentMap((prev) => ({
                                      ...prev,
                                      [field.label]: { url: res.url, key: res.key, name: file.name }
                                    }));
                                    handleFieldChange(field.label, `Cloudflare R2: ${file.name}`);
                                  }
                                } catch (err: any) {
                                  setAttachmentError(err.message || 'File upload failed');
                                } finally {
                                  setUploadingField(null);
                                }
                              }}
                              className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#142d2a] file:text-white hover:file:bg-[#1e4641] cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              PDF, JPG, PNG (Max 15MB - Secured with Cloudflare R2)
                            </span>
                          </div>
                        </div>
                        {uploadingField === field.label && (
                          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Uploading document to Cloudflare R2...</span>
                          </div>
                        )}
                        {attachmentMap[field.label] && (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Attached: {attachmentMap[field.label].name} (Cloudflare R2 Secured)</span>
                          </div>
                        )}
                        {attachmentError && uploadingField === null && (
                          <div className="text-[11px] text-rose-600 font-medium">
                            {attachmentError}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleFieldChange(field.label, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#142d2a] focus:outline-hidden"
                      />
                    )}

                    {field.helpText && !isSchoolField && (
                      <p className="text-[10px] text-slate-500">{field.helpText}</p>
                    )}
                  </div>
                );
              })}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#142d2a] hover:bg-[#1f443f] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>आवेदन सबमिट करें {activeForm.applicationFee > 0 ? `(₹${activeForm.applicationFee})` : ''}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCHOOL PICKER SUB-MODAL */}
      {/* ============================================================ */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#943217]" />
                <span>सहरसा एवं मधेपुरा UDISE स्कूल चयन</span>
              </h3>
              <button
                onClick={() => {
                  setShowSchoolModal(null);
                  setSchoolSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
                placeholder="स्कूल का नाम या UDISE कोड खोजें..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#142d2a]"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 text-xs">
              {OFFICIAL_SCHOOLS_LIST.filter((s) => {
                if (!schoolSearchQuery.trim()) return true;
                const q = schoolSearchQuery.toLowerCase();
                return s.name.toLowerCase().includes(q) || s.udiseCode.includes(q) || s.block.toLowerCase().includes(q);
              }).slice(0, 30).map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => {
                    if (activeForm) {
                      const field = activeForm.fields.find((f) => f.id === showSchoolModal);
                      if (field) {
                        handleFieldChange(field.label, `${sch.name} (${sch.udiseCode}) - ${sch.district}`);
                      }
                    }
                    setShowSchoolModal(null);
                    setSchoolSearchQuery('');
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50 rounded-lg border border-slate-200 hover:border-amber-400 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sch.name}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-[#142d2a] font-bold">
                      {sch.udiseCode}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Block: {sch.block}, District: {sch.district}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBMISSION CONFIRMATION SLIP MODAL */}
      {/* ============================================================ */}
      {completedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 my-8 border-2 border-[#142d2a]">
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-[#142d2a] uppercase font-serif">
                आवेदन सफलतापूर्वक सबमिट हुआ
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                E-Application Acknowledgement Receipt • BSEDRC Bihar
              </p>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Receipt / Ref No</span>
                  <span className="font-mono font-black text-[#943217] text-sm">
                    {completedSubmission.receiptNo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Submission Date</span>
                  <span className="font-semibold text-slate-800">{completedSubmission.submittedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Applicant Name</span>
                  <span className="font-bold text-slate-900 uppercase">{completedSubmission.applicantName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Payment Status</span>
                  <span className="font-bold text-emerald-700">{completedSubmission.paymentStatus} (₹{completedSubmission.amount})</span>
                </div>
              </div>

              {/* QR Code Verification */}
              <div className="p-3 bg-white rounded-lg border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142d2a] block text-xs">
                    आधिकारिक सत्यापन क्यूआर कोड (Verification QR)
                  </span>
                  <span className="text-[10px] text-slate-500 block max-w-xs mt-0.5">
                    इस QR कोड को स्कैन करके आप परिषद के पोर्टल पर इस आवेदन की स्थिति कभी भी ट्रैक कर सकते हैं।
                  </span>
                </div>
                <DynamicQRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/?tab=online-forms&ref=${completedSubmission.receiptNo}`}
                  size={72}
                />
              </div>

              {/* Form Data Summary */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                {Object.entries(completedSubmission.data).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">{k}:</span>
                    <span className="font-bold text-slate-800 text-right max-w-xs truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setCompletedSubmission(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
              >
                बंद करें (Close)
              </button>
              <button
                onClick={() => window.print()}
                className="bg-[#142d2a] hover:bg-[#1f443f] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>रसीद प्रिंट करें (Print Slip)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
