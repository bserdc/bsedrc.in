import React from 'react';
import { Printer, Download, Award, CheckCircle, ShieldCheck, QrCode, GraduationCap } from 'lucide-react';
import { ExamResult } from '../types';
import { BiharCouncilLogo } from './BiharCouncilLogo';
import { OfficialSignature } from './OfficialSignature';

interface MarksheetCardProps {
  result: ExamResult;
  onPrint?: () => void;
}

export const MarksheetCard: React.FC<MarksheetCardProps> = ({ result, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden my-6">
      {/* Top Action Bar (no-print) */}
      <div className="no-print bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold">
            Official Statement of Marks: Roll No. <span className="text-amber-400 font-mono">{result.rollNo}</span>
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/40">
            RESULT: {result.resultStatus} ({result.division.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet</span>
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

      {/* Printable Marksheet Sheet */}
      <div id="marksheet-print" className="printable-area p-6 sm:p-8 bg-white relative">
        <div className="border-4 border-double border-amber-800/80 p-5 sm:p-7 relative bg-amber-50/10 [background-image:radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <Award className="w-96 h-96 text-blue-950" />
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-[#943217]/60 pb-4 relative">
            <div className="flex items-center justify-between gap-3 mb-2">
              {/* Official Seal Emblem Left */}
              <BiharCouncilLogo size={64} className="shrink-0" />

              {/* Council Name */}
              <div className="flex-1 px-2">
                <div className="text-xs sm:text-sm font-bold text-[#943217] font-serif">
                  बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
                </div>
                <h2 className="text-sm sm:text-lg font-black tracking-tight text-[#142d2a] uppercase font-serif">
                  BIHAR STATE EDUCATIONAL DEVELOPMENT &amp; RESEARCH COUNCIL
                </h2>
                <div className="text-[10px] sm:text-xs text-slate-700 font-semibold">
                  Autonomous Educational Council (BRSV &amp; RCT) • Sahugarh, Madhepura, Bihar (852113)
                </div>
                <div className="text-[10px] text-slate-500">
                  Autonomous Educational Research Council | ISO 9001:2015 Standards | Helpline: +91 7070530080
                </div>
              </div>

              {/* Verified Emblem Right */}
              <div className="w-16 h-16 rounded-full border-2 border-amber-600 p-1 bg-white shadow-xs shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#142d2a] flex flex-col items-center justify-center text-amber-300 text-[8px] font-bold text-center">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <span className="text-[7px]">ORIGINAL</span>
                </div>
              </div>
            </div>

            {/* Title Bar */}
            <div className="inline-block bg-blue-950 text-amber-300 px-8 py-1 rounded text-xs sm:text-sm font-bold tracking-widest uppercase shadow-sm">
              STATEMENT OF MARKS / अंक तालिका
            </div>
            <div className="text-xs text-blue-950 font-bold mt-1.5 uppercase">
              {result.course} - {result.session} (EXAMINATION YEAR: {result.examYear})
            </div>
          </div>

          {/* Student Credentials Strip */}
          <div className="my-4 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Candidate Name</span>
                <span className="font-bold text-slate-900 text-sm uppercase">{result.candidateName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Roll Number</span>
                <span className="font-mono font-black text-blue-950 text-sm">{result.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Registration No.</span>
                <span className="font-mono font-bold text-blue-900 text-xs">{result.studentRegNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Stream / Group</span>
                <span className="font-bold text-slate-800 text-xs">{result.stream}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Father's Name</span>
                <span className="font-semibold text-slate-800 uppercase">{result.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase font-medium">Mother's Name</span>
                <span className="font-semibold text-slate-800 uppercase">{result.motherName}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-[10px] block uppercase font-medium">School / Study Center</span>
                <span className="font-semibold text-slate-800 text-xs">{result.centerCode} - {result.centerName}</span>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-blue-950 text-white uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-2.5 border border-slate-300">Code</th>
                  <th className="py-2 px-3 border border-slate-300">Subject Name</th>
                  <th className="py-2 px-2 border border-slate-300 text-center" colSpan={2}>Theory Marks</th>
                  <th className="py-2 px-2 border border-slate-300 text-center" colSpan={2}>Practical / IA</th>
                  <th className="py-2 px-2 border border-slate-300 text-center" colSpan={2}>Total Marks</th>
                  <th className="py-2 px-2 border border-slate-300 text-center">Grade</th>
                  <th className="py-2 px-2 border border-slate-300 text-center">Status</th>
                </tr>
                <tr className="bg-blue-900 text-[9px] text-amber-200">
                  <th className="border border-slate-400"></th>
                  <th className="border border-slate-400"></th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Max</th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Obt</th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Max</th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Obt</th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Max</th>
                  <th className="py-1 px-1 border border-slate-400 text-center">Obt</th>
                  <th className="border border-slate-400"></th>
                  <th className="border border-slate-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {result.subjects.map((sub, idx) => (
                  <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-1.5 px-2.5 border border-slate-300 font-mono font-bold text-blue-900">{sub.code}</td>
                    <td className="py-1.5 px-3 border border-slate-300 font-medium text-slate-800">{sub.name}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono text-slate-600">{sub.theoryMax}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono font-bold text-slate-900">{sub.theoryObt}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono text-slate-600">{sub.practicalMax || '-'}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono font-bold text-slate-900">{sub.practicalObt || '-'}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono text-slate-600">{sub.totalMax}</td>
                    <td className="py-1.5 px-1 border border-slate-300 text-center font-mono font-extrabold text-blue-950">{sub.totalObt}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-amber-700">{sub.grade}</td>
                    <td className="py-1.5 px-2 border border-slate-300 text-center font-bold text-emerald-700">{sub.status}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900">
                <tr>
                  <td colSpan={6} className="py-2 px-3 border border-slate-300 text-right uppercase text-xs">
                    Grand Total Marks:
                  </td>
                  <td className="py-2 px-1 border border-slate-300 text-center font-mono text-xs">
                    {result.totalMax}
                  </td>
                  <td className="py-2 px-1 border border-slate-300 text-center font-mono text-sm text-blue-950 font-black">
                    {result.totalObt}
                  </td>
                  <td colSpan={2} className="py-2 px-2 border border-slate-300 text-center text-xs text-emerald-800">
                    {result.percentage.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Result Summary Banner */}
          <div className="bg-amber-100/70 border-2 border-amber-300 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs my-3">
            <div>
              <span className="text-slate-600 font-medium block text-[11px] uppercase">Final Result / परिणाम</span>
              <span className="text-base font-black text-emerald-700 tracking-wide">
                {result.resultStatus} - {result.division.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-600 font-medium block text-[11px] uppercase">Aggregate Percentage</span>
              <span className="text-base font-bold text-blue-950 font-mono">
                {result.percentage.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-slate-600 font-medium block text-[11px] uppercase">Date of Declaration</span>
              <span className="font-semibold text-slate-800 font-mono">
                {result.issueDate}
              </span>
            </div>
          </div>

          {/* Footer & Security Signatures */}
          <div className="border-t-2 border-slate-300 pt-3 mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-xs">
            <div className="sm:col-span-2 text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 block">GRADING SCALE:</span>
              <span>A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), C2 (41-50), D (33-40). Minimum qualifying marks: 33% aggregate in each subject.</span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded border border-slate-200">
              <div className="w-14 h-14 bg-white p-1 border border-slate-300 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase text-center">
                Digital Marksheet QR
              </span>
            </div>

            {/* Signature */}
            <div className="text-center sm:text-right">
              <OfficialSignature
                officerName="Bibhishan Kumar"
                designation="Chief Executive Officer"
                councilSubtitle="BRSV & RCT Autonomous Council, Madhepura"
                align="right"
                size="md"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
