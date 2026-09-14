import React from 'react';
import { Printer, Download, CheckCircle, ShieldCheck, QrCode, Building, FileText, CreditCard } from 'lucide-react';
import { FeePayment } from '../types';
import { BiharCouncilLogo } from './BiharCouncilLogo';
import { OfficialSignature } from './OfficialSignature';

interface PaymentReceiptCardProps {
  payment: FeePayment;
  onPrint?: () => void;
  onClose?: () => void;
}

export const PaymentReceiptCard: React.FC<PaymentReceiptCardProps> = ({ payment, onPrint, onClose }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden my-6">
      {/* Top Action Bar (no-print) */}
      <div className="no-print bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">
            Official e-Receipt: <span className="text-amber-400 font-mono">{payment.receiptNo}</span>
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/40">
            TRANSACTION SUCCESSFUL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Receipt Slip */}
      <div id="payment-receipt-print" className="printable-area p-6 sm:p-8 bg-white relative">
        <div className="border-2 border-slate-300 p-5 sm:p-6 relative">
          
          {/* Header */}
          <div className="text-center border-b-2 border-[#142d2a] pb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <BiharCouncilLogo size={48} className="shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-bold text-[#943217] font-serif">
                  बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
                </div>
                <h2 className="text-sm sm:text-base font-black text-[#142d2a] uppercase font-serif">
                  BIHAR STATE EDUCATIONAL DEVELOPMENT &amp; RESEARCH COUNCIL
                </h2>
                <div className="text-[10px] text-slate-600">
                  BRSV &amp; RCT Autonomous Council | Sahugarh, Madhepura, Bihar (852113) | adarshbiharsiksha@gmail.com
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-emerald-600 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="inline-block bg-slate-900 text-amber-300 px-4 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              ONLINE FEE PAYMENT ACKNOWLEDGEMENT RECEIPT (e-CHALLAN)
            </div>
          </div>

          {/* Key Transaction Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-medium">Receipt No.</span>
              <span className="font-mono font-bold text-blue-950 text-xs sm:text-sm">{payment.receiptNo}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{payment.transactionId}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-medium">Payment Date & Time</span>
              <span className="font-semibold text-slate-800">{payment.paymentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-medium">Payment Mode</span>
              <span className="font-bold text-blue-800">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Candidate Details */}
          <div className="my-4 space-y-2 text-xs border-b border-slate-200 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Candidate Name</span>
                <span className="font-bold text-slate-900 text-sm uppercase">{payment.candidateName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Father's Name</span>
                <span className="font-semibold text-slate-800 uppercase">{payment.fatherName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Reg No. / App No.</span>
                <span className="font-mono font-bold text-blue-900">{payment.refNumber}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Mobile Number</span>
                <span className="font-mono text-slate-800 font-semibold">{payment.candidateMobile}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Bank Reference No.</span>
                <span className="font-mono text-slate-800 font-semibold">{payment.bankRef}</span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div className="my-4">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3 border border-slate-300">Description / Fee Head</th>
                  <th className="py-2 px-3 border border-slate-300">Reference</th>
                  <th className="py-2 px-3 border border-slate-300 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 border border-slate-300 font-medium text-slate-900">
                    {payment.purpose}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 font-mono text-slate-600">
                    {payment.refNumber}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-right font-mono font-semibold text-slate-900">
                    ₹{payment.amount.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-slate-50 text-[11px] text-slate-600">
                  <td className="py-1 px-3 border border-slate-300">Gateway Processing & Portal Maintenance Charges</td>
                  <td className="py-1 px-3 border border-slate-300 font-mono">BSEDRC-GATEWAY</td>
                  <td className="py-1 px-3 border border-slate-300 text-right font-mono">₹0.00 (Waived)</td>
                </tr>
              </tbody>
              <tfoot className="bg-blue-950 text-white font-bold">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 uppercase text-right">
                    Total Amount Paid:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm text-amber-300">
                    ₹{payment.amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes & QR Code */}
          <div className="border-t border-slate-300 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
            <div className="text-[10px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">TERMS &amp; CONDITIONS:</p>
              <p>1. Official e-receipt authenticated by BRSV &amp; RCT Autonomous Council, Madhepura.</p>
              <p>2. Keep this receipt for examination entry and future verification.</p>
              <p>3. In case of duplicate debits, refund is automatically credited within 3-5 business days.</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="p-1 bg-white border border-slate-300 rounded shadow-xs">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[9px] text-slate-500">
                <span className="font-bold text-emerald-700 block">AUTHENTICATED</span>
                <span>Scan to verify receipt</span>
                <span className="block font-mono text-slate-400">bsedrc.in/verify</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <OfficialSignature
                officerName="Bibhishan Kumar"
                designation="Chief Executive Officer"
                councilSubtitle="Autonomous Council, Madhepura"
                align="right"
                size="sm"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
