import React from 'react';
import { Printer, Download, Award, ShieldCheck, QrCode, GraduationCap, CheckCircle } from 'lucide-react';
import { CertificateRecord } from '../types';
import { BiharCouncilLogo } from './BiharCouncilLogo';
import { OfficialSignature } from './OfficialSignature';

interface CertificateCardProps {
  certificate: CertificateRecord;
  onPrint?: () => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden my-6">
      {/* Action Bar (no-print) */}
      <div className="no-print bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold">
            {certificate.certificateType}: Serial No. <span className="text-amber-400 font-mono">{certificate.certificateNo}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Certificate Printable Canvas */}
      <div id="certificate-print" className="printable-area p-8 sm:p-12 bg-[#fffdfa] relative">
        <div className="border-8 border-double border-amber-900/80 p-8 sm:p-12 relative bg-[radial-gradient(#d97706_0.5px,transparent_0.5px)] [background-size:24px_24px]">
          
          {/* Inner Golden border */}
          <div className="border border-amber-500/60 p-6 sm:p-10 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
              <GraduationCap className="w-[450px] h-[450px] text-amber-900" />
            </div>

            {/* Top Serial & ISO Header */}
            <div className="flex justify-between items-center text-xs text-slate-600 mb-6">
              <div>
                <span className="font-semibold text-slate-500 block text-[10px] uppercase">Certificate Serial No.</span>
                <span className="font-mono font-bold text-amber-900 text-sm tracking-wider">{certificate.certificateNo}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Document Security Code</span>
                <div className="text-[10px] font-mono text-slate-700 font-bold">{certificate.verificationHash}</div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-500 block text-[10px] uppercase">Issue Date</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{certificate.issueDate}</span>
              </div>
            </div>

            {/* Emblem & Titles */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <BiharCouncilLogo size={80} />
              </div>

              <div className="text-sm font-bold text-[#943217] font-serif mb-1">
                बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#142d2a] uppercase tracking-tight font-serif">
                BIHAR STATE EDUCATIONAL DEVELOPMENT &amp; RESEARCH COUNCIL
              </h1>
              <div className="text-xs text-slate-700 font-medium">
                (Autonomous Council - BRSV &amp; RCT • Sahugarh, Madhepura, Bihar - 852113)
              </div>

              <div className="my-6">
                <div className="inline-block border-b-2 border-[#943217] pb-1">
                  <span className="text-lg sm:text-xl font-bold uppercase tracking-widest text-[#943217] font-serif">
                    {certificate.certificateType}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="text-center space-y-4 text-slate-800 text-sm sm:text-base leading-loose max-w-2xl mx-auto my-8">
              <p>
                This is to certify that <span className="font-bold text-blue-950 text-base sm:text-lg border-b border-slate-400 px-2 uppercase">{certificate.candidateName}</span>, 
                Son / Daughter of Shri <span className="font-bold text-slate-900 border-b border-slate-400 px-2 uppercase">{certificate.fatherName}</span> 
                and Smt. <span className="font-bold text-slate-900 border-b border-slate-400 px-2 uppercase">{certificate.motherName}</span>,
              </p>
              
              <p>
                bearing Registration Number <span className="font-mono font-bold text-blue-950 px-1 border-b border-slate-400">{certificate.studentRegNo}</span> 
                and Roll Number <span className="font-mono font-bold text-blue-950 px-1 border-b border-slate-400">{certificate.studentRollNo}</span>,
              </p>

              <p>
                has successfully passed and completed the prescribed curriculum for the <br />
                <span className="font-bold text-blue-950 text-base border-b-2 border-amber-600 px-2">{certificate.course}</span> <br />
                held in the examination session of <span className="font-bold text-slate-900">{certificate.passingYear}</span> and was placed in 
                <span className="font-bold text-emerald-800 text-base uppercase px-2"> {certificate.division}</span>.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 italic pt-2">
                This council has no objection to the candidate pursuing further education or obtaining admission to any recognized university, institution, or employment across India or abroad.
              </p>
            </div>

            {/* Bottom Signatures & QR */}
            <div className="mt-12 pt-6 border-t border-amber-300 grid grid-cols-3 gap-4 items-end">
              {/* Verification Seal */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center p-1 bg-amber-50/50 mb-1">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                  <span className="text-[7px] font-bold text-amber-900 uppercase">OFFICIAL SEAL</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 uppercase block">Council Secretariat</span>
                <span className="text-[9px] text-slate-500">Madhepura (852113), Bihar</span>
              </div>

              {/* Digital QR */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white p-1 border-2 border-amber-600 rounded flex items-center justify-center shadow-xs">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
                <span className="text-[8px] font-mono text-slate-600 mt-1 uppercase">
                  Verify at bsedrc.in
                </span>
              </div>

              {/* Chief Executive Officer Signature */}
              <div className="text-center">
                <OfficialSignature
                  officerName="Bibhishan Kumar"
                  designation="Chief Executive Officer"
                  councilSubtitle="BRSV & RCT Council, Madhepura"
                  align="center"
                  size="md"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
