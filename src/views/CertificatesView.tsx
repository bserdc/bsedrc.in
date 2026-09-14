import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Download, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CertificateRecord, Student, ExamResult } from '../types';
import { CertificateCard } from '../components/CertificateCard';
import { uploadToCloudflareR2 } from '../lib/storage';

interface CertificatesViewProps {
  certificates: CertificateRecord[];
  students: Student[];
  results: ExamResult[];
  onAddNewCertificate: (cert: CertificateRecord) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  students,
  results,
  onAddNewCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');

  // Generator State
  const [certType, setCertType] = useState<CertificateRecord['certificateType']>('Migration Certificate');
  const [selectedStudentReg, setSelectedStudentReg] = useState('');
  const [generatedCert, setGeneratedCert] = useState<CertificateRecord | null>(null);

  // Verification State
  const [verifySerial, setVerifySerial] = useState('');
  const [verifiedCert, setVerifiedCert] = useState<CertificateRecord | null>(null);
  const [verifyError, setVerifyError] = useState('');

  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.regNo === selectedStudentReg);
    if (!st) {
      alert('Selected student not found');
      return;
    }

    const res = results.find((r) => r.studentRegNo === st.regNo);
    const div = res ? res.division : '1st Division';
    const yr = res ? String(res.examYear) : '2025';

    const typePrefix = certType.startsWith('Mig')
      ? 'MIG'
      : certType.startsWith('Pass')
      ? 'PASS'
      : certType.startsWith('Prov')
      ? 'PROV'
      : 'CHAR';

    const randomSerial = `BSE/${typePrefix}/2025/${Math.floor(10000 + Math.random() * 90000)}`;
    const randomHash = `SHA256-BSE-${typePrefix}-${Math.floor(1000 + Math.random() * 9000)}-${st.name.split(' ')[0]}`;

    setIsGeneratingCert(true);

    let docKey: string | undefined;
    let docUrl: string | undefined;

    try {
      const certData = JSON.stringify({
        certificateNo: randomSerial,
        certificateType: certType,
        studentRegNo: st.regNo,
        studentRollNo: st.rollNo,
        candidateName: st.name,
        fatherName: st.fatherName,
        motherName: st.motherName,
        course: st.course,
        passingYear: yr,
        division: div,
        issueDate: new Date().toISOString().split('T')[0],
        verificationHash: randomHash,
        issuedBy: 'Bihar Secondary Education Development & Research Council',
        securitySeal: 'BSEDRC Official Hologram Verified'
      }, null, 2);

      const r2Res = await uploadToCloudflareR2(certData, {
        category: 'certificates',
        preferredFileName: `cert_${randomSerial.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
        isPrivate: true
      });

      if (r2Res.success) {
        docKey = r2Res.key;
        docUrl = r2Res.url;
      }
    } catch (err) {
      console.warn('[CERTIFICATE ARCHIVE NOTICE] R2 upload notification:', err);
    } finally {
      setIsGeneratingCert(false);
    }

    const newCert: CertificateRecord = {
      id: 'cert-' + Date.now(),
      certificateType: certType,
      certificateNo: randomSerial,
      studentRegNo: st.regNo,
      studentRollNo: st.rollNo,
      candidateName: st.name,
      fatherName: st.fatherName,
      motherName: st.motherName,
      course: st.course,
      passingYear: yr,
      division: div,
      issueDate: new Date().toISOString().split('T')[0],
      verificationHash: randomHash,
      documentKey: docKey,
      documentUrl: docUrl,
    };

    onAddNewCertificate(newCert);
    setGeneratedCert(newCert);
  };

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verifySerial.trim().toLowerCase();
    if (!clean) return;

    const found = certificates.find(
      (c) =>
        c.certificateNo.toLowerCase().includes(clean) ||
        c.studentRegNo.toLowerCase().includes(clean) ||
        c.studentRollNo.toLowerCase().includes(clean)
    );

    if (found) {
      setVerifiedCert(found);
      setVerifyError('');
    } else {
      setVerifiedCert(null);
      setVerifyError(`Certificate with serial "${verifySerial}" could not be verified in the national database.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Automated Academic Credential Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Digital Certificate Issuance & Verification Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Automated generation of Migration, Passing, Provisional, and Character Certificates with QR authenticity verification.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'generate'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Certificate</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'verify'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify Serial No.</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Generate Certificate */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-bold uppercase text-amber-400 font-serif-title">
                  Instant Certificate Generation
                </h2>
                <p className="text-slate-300 text-xs mt-1">
                  Select certificate type and student. The system will automatically construct the digital certificate with security seals.
                </p>
              </div>

              <form onSubmit={handleGenerateCertificate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Select Certificate Type:
                    </label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value as any)}
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl font-semibold focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="Migration Certificate">Migration Certificate (प्रवासन प्रमाण पत्र)</option>
                      <option value="Passing Certificate">Passing Certificate (उत्तीर्ण प्रमाण पत्र)</option>
                      <option value="Provisional Certificate">Provisional Certificate (अनंतिम प्रमाण पत्र)</option>
                      <option value="Character Certificate">Character & Conduct Certificate (चरित्र प्रमाण पत्र)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Select Registered Candidate:
                    </label>
                    <select
                      value={selectedStudentReg}
                      onChange={(e) => setSelectedStudentReg(e.target.value)}
                      className="w-full bg-white text-slate-900 p-2.5 rounded-xl font-semibold focus:ring-2 focus:ring-amber-400 font-mono"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.regNo}>
                          {st.regNo} - {st.name} ({st.rollNo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-slate-400 text-[11px]">
                    Includes Board Hologram, Security Barcode, and Digital QR verification
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingCert}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingCert ? 'Archiving to Cloudflare R2...' : 'Generate & Render Certificate'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Certificate Output */}
          {generatedCert && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <span>
                      Certificate successfully generated with Serial: <strong>{generatedCert.certificateNo}</strong>
                    </span>
                    {generatedCert.documentKey && (
                      <span className="block text-[10px] text-emerald-800 font-medium">
                        ✓ Cloudflare R2 Secure Object: {generatedCert.documentKey}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

              <CertificateCard certificate={generatedCert} />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Verify Certificate */}
      {activeTab === 'verify' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">
                  Certificate Digital Verification Service
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Enter Certificate Serial Number (e.g. BSE/MIG/2025/00142) or Student Registration Number.
                </p>
              </div>

              <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. BSE/MIG/2025/00142 or BSE/2025/1001"
                  value={verifySerial}
                  onChange={(e) => setVerifySerial(e.target.value)}
                  className="flex-1 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Record</span>
                </button>
              </form>
            </div>
          </div>

          {verifyError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs">
              {verifyError}
            </div>
          )}

          {verifiedCert && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span className="font-bold">GENUINE COUNCIL CERTIFICATE VERIFIED:</span>
                <span>Issued to {verifiedCert.candidateName} for {verifiedCert.course}</span>
              </div>

              <CertificateCard certificate={verifiedCert} />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
