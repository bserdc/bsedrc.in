import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  GraduationCap, 
  Printer, 
  ShieldCheck, 
  FileText,
  CreditCard
} from 'lucide-react';
import { ExamResult } from '../types';
import { MarksheetCard } from '../components/MarksheetCard';

interface ResultPortalViewProps {
  results: ExamResult[];
  onOpenPaymentModal: (purpose: any, amount: number, refNo: string, name: string, father: string, mobile: string) => void;
}

export const ResultPortalView: React.FC<ResultPortalViewProps> = ({
  results,
  onOpenPaymentModal,
}) => {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [rollInput, setRollInput] = useState('');
  const [regInput, setRegInput] = useState('');
  const [matchedResult, setMatchedResult] = useState<ExamResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollInput.trim();
    const cleanReg = regInput.trim().toLowerCase();

    if (!cleanRoll && !cleanReg) {
      setErrorMsg('Please enter either Roll Number or Registration Number.');
      setMatchedResult(null);
      return;
    }

    const found = results.find((r) => {
      const matchRoll = cleanRoll ? r.rollNo === cleanRoll : true;
      const matchReg = cleanReg ? r.studentRegNo.toLowerCase().includes(cleanReg) : true;
      return matchRoll && matchReg;
    });

    if (found) {
      setMatchedResult(found);
      setErrorMsg('');
    } else {
      setMatchedResult(null);
      setErrorMsg(`No examination result found for Roll No: "${cleanRoll}" / Reg: "${cleanReg}". Please check your admit card details.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Annual Board Examination Results 2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Online Marksheet & Result Verification System
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Official verification portal for Secondary (Class 10th) & Foundation (Class 6th to 9th) Annual Examinations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-300">
              Classes 6th to 10th Results Live
            </span>
          </div>
        </div>
      </div>

      {/* Result Search Console */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black uppercase text-amber-400 font-serif-title">
              Check Examination Result / परीक्षा परिणाम देखें (कक्षा 6 से 10वीं)
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Select class and enter your Examination Roll Number as printed on your Admit Card.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Examination</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white text-slate-900 p-2.5 rounded-xl font-medium focus:ring-2 focus:ring-amber-400"
                >
                  <option value="All">All Examinations (Class 6th to 10th)</option>
                  <option value="10th">Secondary Examination (Class 10th)</option>
                  <option value="9th">Secondary Foundation (Class 9th)</option>
                  <option value="8th">Middle Foundation (Class 8th)</option>
                  <option value="7th">Middle Foundation (Class 7th)</option>
                  <option value="6th">Middle Foundation (Class 6th)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Enter Roll Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 2510101"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  className="w-full bg-white text-slate-900 p-2.5 rounded-xl font-mono font-bold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Registration No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BSE/2025/1001"
                  value={regInput}
                  onChange={(e) => setRegInput(e.target.value)}
                  className="w-full bg-white text-slate-900 p-2.5 rounded-xl font-mono focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ml-auto"
              >
                <Search className="w-4 h-4" />
                <span>Get Marksheet</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold block">Result Record Not Found</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Marksheet Display */}
      {matchedResult && (
        <div className="space-y-4">
          <MarksheetCard result={matchedResult} />

          {/* Post-Result Student Actions */}
          <div className="no-print bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Need Re-checking or Duplicate Marksheet?
              </h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Students can apply online for marks scrutiny, re-evaluation, or official physical hardcopy dispatch.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  onOpenPaymentModal(
                    'Re-evaluation Fee',
                    500,
                    matchedResult.rollNo,
                    matchedResult.candidateName,
                    matchedResult.fatherName,
                    '9811000000'
                  )
                }
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Apply Re-Evaluation (₹500)</span>
              </button>

              <button
                onClick={() =>
                  onOpenPaymentModal(
                    'Duplicate Marksheet',
                    350,
                    matchedResult.rollNo,
                    matchedResult.candidateName,
                    matchedResult.fatherName,
                    '9811000000'
                  )
                }
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Order Hardcopy (₹350)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
