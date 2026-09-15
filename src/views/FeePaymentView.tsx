import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Smartphone, 
  Building, 
  Receipt,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { FeePayment, Student } from '../types';
import { PaymentReceiptCard } from '../components/PaymentReceiptCard';

interface FeePaymentViewProps {
  students: Student[];
  payments: FeePayment[];
  onOpenPaymentModal: (purpose: any, amount: number, refNo: string, name: string, father: string, mobile: string) => void;
}

export const FeePaymentView: React.FC<FeePaymentViewProps> = ({
  students,
  payments,
  onOpenPaymentModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pay' | 'receipts'>('pay');

  // Payment Form
  const [feePurpose, setFeePurpose] = useState<FeePayment['purpose']>('Annual Board Exam Fee');
  const [candidateRef, setCandidateRef] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [candidateMobile, setCandidateMobile] = useState('');
  
  // Custom Receipt Search
  const [searchReceiptNo, setSearchReceiptNo] = useState('');
  const [foundReceipt, setFoundReceipt] = useState<FeePayment | null>(null);
  const [searchError, setSearchError] = useState('');

  // Auto fee amount lookup
  const getFeeAmount = (purpose: FeePayment['purpose']): number => {
    switch (purpose) {
      case 'Registration Fee':
        return 25;
      case 'Annual Board Exam Fee':
        return 1250;
      case 'Migration Certificate':
        return 400;
      case 'Duplicate Marksheet':
        return 350;
      case 'Re-evaluation Fee':
        return 500;
      case 'Job Application Fee':
        return 450;
      default:
        return 500;
    }
  };

  const handleSelectStudent = (reg: string) => {
    const s = students.find((st) => st.regNo === reg);
    if (s) {
      setCandidateRef(s.regNo);
      setCandidateName(s.name);
      setFatherName(s.fatherName);
      setCandidateMobile(s.mobile);
    }
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getFeeAmount(feePurpose);
    onOpenPaymentModal(
      feePurpose,
      amount,
      candidateRef || 'BSE-' + Math.floor(1000 + Math.random() * 9000),
      candidateName,
      fatherName,
      candidateMobile
    );
  };

  const handleReceiptSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchReceiptNo.trim().toLowerCase();
    if (!clean) return;

    const found = payments.find(
      (p) =>
        p.receiptNo.toLowerCase().includes(clean) ||
        p.transactionId.toLowerCase().includes(clean) ||
        p.refNumber.toLowerCase().includes(clean)
    );

    if (found) {
      setFoundReceipt(found);
      setSearchError('');
    } else {
      setFoundReceipt(null);
      setSearchError(`No payment receipt found for "${searchReceiptNo}". Please verify your Receipt No or Transaction ID.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Digital Treasury Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Online Fee Payment & e-Challan Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Pay Examination Fee, Registration Fee, Migration, or verify & print instant e-Challan receipts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('pay')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'pay'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Pay Online Fee</span>
            </button>

            <button
              onClick={() => setActiveSubTab('receipts')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'receipts'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Verify Receipt / Challan</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Pay Fee Form */}
      {activeSubTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Payment Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-blue-950 uppercase">
                Initiate Fee Transaction
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant UPI QR Code, Google Pay, PhonePe, Paytm, and Netbanking enabled.
              </p>
            </div>

            <form onSubmit={handleInitiatePayment} className="space-y-4 text-xs">

              {/* Fee Head */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Purpose / Fee Head *</label>
                <select
                  value={feePurpose}
                  onChange={(e) => setFeePurpose(e.target.value as any)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Annual Board Exam Fee">Annual Board Exam Fee (₹1,250.00)</option>
                  <option value="Registration Fee">Student Registration Fee (₹25.00)</option>
                  <option value="Migration Certificate">Migration Certificate Fee (₹400.00)</option>
                  <option value="Duplicate Marksheet">Duplicate Marksheet Hardcopy (₹350.00)</option>
                  <option value="Re-evaluation Fee">Marks Re-evaluation / Scrutiny (₹500.00)</option>
                  <option value="Job Application Fee">Recruitment Application Fee (₹450.00)</option>
                </select>
              </div>

              {/* Student Quick Fill Chips */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                <span className="text-[11px] text-slate-600 block mb-1 font-semibold">
                  Quick Auto-Fill From Registered Student:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {students.slice(0, 4).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStudent(st.regNo)}
                      className="bg-white hover:bg-blue-900 hover:text-white text-blue-950 px-2.5 py-1 rounded text-[11px] font-mono border border-blue-200 transition-colors"
                    >
                      {st.regNo} ({st.name.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Registration No. / Application No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSE/2025/1001"
                    value={candidateRef}
                    onChange={(e) => setCandidateRef(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AARAV SHARMA"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. RAJESH SHARMA"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 uppercase"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number for SMS Receipt *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile"
                    value={candidateMobile}
                    onChange={(e) => setCandidateMobile(e.target.value)}
                    className="w-full bg-white p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Amount Summary Box */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between border-2 border-amber-500">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">TOTAL PAYABLE FEE</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    ₹{getFeeAmount(feePurpose)}.00
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero transaction charges on UPI & Rupay Debit Cards</span>
              </div>
            </form>
          </div>

          {/* Right: Fee Schedule Guidelines */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3 text-xs">
              <h3 className="font-bold text-blue-950 uppercase border-b border-slate-100 pb-2">
                Official Fee Tariff 2024-2025
              </h3>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Registration (Class 10th/12th):</span>
                  <span className="font-mono font-bold text-slate-900">₹25</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Annual Board Examination:</span>
                  <span className="font-mono font-bold text-slate-900">₹1,250</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Migration Certificate:</span>
                  <span className="font-mono font-bold text-slate-900">₹400</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Duplicate Marksheet / Slip:</span>
                  <span className="font-mono font-bold text-slate-900">₹350</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span>Answer Script Scrutiny / Re-check:</span>
                  <span className="font-mono font-bold text-slate-900">₹500</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>e-Challan Note:</strong> Keep the generated transaction reference number for all future communications and admit card issuance.
              </div>
            </div>

            {/* Official Razorpay Gateway status card */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                    R
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Razorpay Gateway API</span>
                    <span className="text-[10px] text-slate-400 font-mono">v1 /orders integration</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Official payment aggregator integration with Razorpay. Transactions are cryptographically verified with HMAC SHA-256 signatures.
              </p>

              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 font-semibold">
                <span className="bg-slate-50 p-1.5 rounded-md border border-slate-200/80 text-center">
                  UPI &amp; Dynamic QR
                </span>
                <span className="bg-slate-50 p-1.5 rounded-md border border-slate-200/80 text-center">
                  RuPay / Visa / Master
                </span>
                <span className="bg-slate-50 p-1.5 rounded-md border border-slate-200/80 text-center">
                  100+ Indian Banks
                </span>
                <span className="bg-slate-50 p-1.5 rounded-md border border-slate-200/80 text-center">
                  Instant e-Challan Slip
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Verify Receipt / Challan */}
      {activeSubTab === 'receipts' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">
                  Verify & Reprint Official Payment e-Receipt
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Enter Receipt No (e.g. BSE-REC-2025-9832), Transaction ID, or Candidate Reg No.
                </p>
              </div>

              <form onSubmit={handleReceiptSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. BSE-REC-2025-9832 or BSE/2025/1001"
                  value={searchReceiptNo}
                  onChange={(e) => setSearchReceiptNo(e.target.value)}
                  className="flex-1 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify Receipt</span>
                </button>
              </form>
            </div>
          </div>

          {searchError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs">
              {searchError}
            </div>
          )}

          {foundReceipt && (
            <div className="space-y-4">
              <PaymentReceiptCard payment={foundReceipt} />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
