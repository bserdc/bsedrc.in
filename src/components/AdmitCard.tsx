import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  FileText,
  User,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Student } from '../types';
import { BiharCouncilLogo } from './BiharCouncilLogo';
import { DynamicQRCode } from './DynamicQRCode';
import { OfficialSignature } from './OfficialSignature';

interface AdmitCardProps {
  student: Student;
  onSwitchToRegCard?: () => void;
}

export const AdmitCard: React.FC<AdmitCardProps> = ({
  student,
  onSwitchToRegCard,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate full live verification URL that when scanned loads this exact admit card
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?tab=student&doc=admit-card&regNo=${encodeURIComponent(student.regNo)}`
    : `https://bsedrc.in/?tab=student&doc=admit-card&regNo=${encodeURIComponent(student.regNo)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  // Mock Exam Schedule based on subjects
  const getExamDates = () => {
    const baseDates = [
      { date: '17-02-2025', day: 'Monday', time: '09:30 AM - 12:45 PM (Shift 1)' },
      { date: '18-02-2025', day: 'Tuesday', time: '09:30 AM - 12:45 PM (Shift 1)' },
      { date: '19-02-2025', day: 'Wednesday', time: '09:30 AM - 12:45 PM (Shift 1)' },
      { date: '20-02-2025', day: 'Thursday', time: '09:30 AM - 12:45 PM (Shift 1)' },
      { date: '21-02-2025', day: 'Friday', time: '09:30 AM - 12:45 PM (Shift 1)' },
      { date: '22-02-2025', day: 'Saturday', time: '09:30 AM - 12:45 PM (Shift 1)' },
    ];

    return student.subjects.map((sub, idx) => ({
      ...sub,
      date: baseDates[idx % baseDates.length].date,
      day: baseDates[idx % baseDates.length].day,
      time: baseDates[idx % baseDates.length].time,
    }));
  };

  const schedule = getExamDates();

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Admit Card Active &amp; Verified</span>
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Reg: {student.regNo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToRegCard && (
            <button
              onClick={onSwitchToRegCard}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#943217]" />
              <span>View Registration Card</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="bg-[#142d2a] hover:bg-[#1b3d39] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Print Admit Card</span>
          </button>
          <button
            onClick={handleDownload}
            className="bg-[#943217] hover:bg-[#7a2812] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Admit Card Certificate Layout */}
      <div 
        ref={cardRef}
        className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border-4 border-[#142d2a] relative overflow-hidden print:p-4 print:border-2 print:shadow-none print:m-0"
        id="official-admit-card"
      >
        {/* Watermark Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <BiharCouncilLogo size={420} />
        </div>

        {/* Decorative Borders */}
        <div className="border-2 border-[#943217] p-5 sm:p-6 rounded-xl relative bg-[#fdfcf9]/80 backdrop-blur-xs">
          
          {/* Header Section */}
          <div className="text-center border-b-2 border-[#142d2a] pb-4 relative">
            <div className="flex items-center justify-between gap-2 mb-2">
              
              {/* Left: Official Council Logo */}
              <BiharCouncilLogo size={68} className="shrink-0" />

              {/* Center: Official Council Name & Details */}
              <div className="flex-1 px-2">
                <div className="text-xs sm:text-sm font-bold text-[#943217] font-serif tracking-wide">
                  बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
                </div>
                <h1 className="text-sm sm:text-lg font-black tracking-tight text-[#142d2a] uppercase font-serif">
                  BIHAR STATE EDUCATIONAL DEVELOPMENT &amp; RESEARCH COUNCIL
                </h1>
                <div className="text-[10px] sm:text-xs text-slate-700 font-semibold">
                  Autonomous Council (BRSV &amp; RCT) • Registered Office: Sahugarh, Madhepura, Bihar (852113)
                </div>
                <div className="text-[10px] text-slate-500">
                  Autonomous Educational Board &amp; Research Trust • Helpline: +91 7070530080 | Portal: bsedrc.in
                </div>
              </div>

              {/* Right: Security & Hall Ticket Badge */}
              <div className="w-16 h-16 rounded-xl border-2 border-emerald-700 p-1 bg-white shadow-xs shrink-0 flex flex-col items-center justify-center text-emerald-800 text-center">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
                <span className="text-[7px] font-black uppercase mt-0.5">VALID 2025</span>
              </div>
            </div>

            {/* Title Banner */}
            <div className="inline-block bg-[#142d2a] text-amber-300 px-6 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-md mt-1">
              ANNUAL BOARD EXAMINATION 2025 • E-ADMIT CARD / प्रवेश पत्र
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-1">
              ACADEMIC SESSION: <span className="text-[#142d2a] font-bold">{student.session}</span> • {student.course}
            </div>
          </div>

          {/* Key Candidate Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 bg-amber-500/10 p-3 rounded-lg border border-amber-300/40 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Roll Number / क्रमांक</span>
              <span className="font-mono font-black text-[#943217] text-sm sm:text-base">
                {student.rollNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Registration No. / पंजीयन संख्या</span>
              <span className="font-mono font-bold text-[#142d2a] text-xs sm:text-sm">
                {student.regNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Course / कक्षा</span>
              <span className="font-bold text-slate-800 text-xs">
                {student.course}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Stream / संकाय</span>
              <span className="font-bold text-[#943217] text-xs">
                {student.stream}
              </span>
            </div>
          </div>

          {/* Candidate Bio & Details with Photo + Dynamic QR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2 border-b border-slate-200">
            
            {/* Left: Bio Data Information */}
            <div className="md:col-span-8 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Candidate Name / परीक्षार्थी का नाम</span>
                  <span className="font-bold text-slate-900 text-sm uppercase">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Mother's Name / माता का नाम</span>
                  <span className="font-semibold text-slate-800 uppercase">{student.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Father's Name / पिता का नाम</span>
                  <span className="font-semibold text-slate-800 uppercase">{student.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Date of Birth / जन्म तिथि</span>
                  <span className="font-mono font-semibold text-slate-800">{student.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Gender &amp; Category / लिंग एवं श्रेणी</span>
                  <span className="font-semibold text-slate-800">{student.gender} • {student.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Candidate Type / कोटि</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px]">
                    REGULAR / नियमित
                  </span>
                </div>
              </div>

              {/* School / Center Information */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">School / College / विद्यालय का नाम</span>
                  <span className="font-bold text-[#142d2a] text-xs uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#943217] shrink-0" />
                    <span>{student.centerName || 'Dr. Ram Manohar Lohiya High School Sahugadh, Madhepura'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-medium">Examination Center / परीक्षा केंद्र</span>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200 text-[#142d2a] font-bold text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#943217] shrink-0" />
                    <span>{student.examCenter || 'Center No. 104 - BNMV College Examination Center, Sahugarh, Madhepura (852113)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Photo, Signature and Scannable Dynamic QR Code */}
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center justify-center gap-3">
              
              {/* Candidate Photo & Signature */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-32 border-2 border-[#142d2a] bg-slate-100 rounded overflow-hidden shadow-xs relative">
                  <img
                    src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-mono">
                    PHOTO ATTESTED
                  </div>
                </div>
                {/* Candidate Signature Box */}
                <div className="w-28 h-8 border border-slate-400 bg-white mt-1 flex items-center justify-center px-1">
                  <span className="font-serif italic text-xs text-slate-800 font-bold">
                    {student.name.split(' ')[0]} Kumar
                  </span>
                </div>
                <span className="text-[8px] text-slate-500 uppercase mt-0.5">Candidate Signature</span>
              </div>

              {/* Real Scannable QR Code */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <DynamicQRCode
                  value={verificationUrl}
                  size={96}
                  label="Scan to Open Admit Card"
                  subLabel="Instant Portal Verification"
                />
              </div>

            </div>

          </div>

          {/* Exam Timetable & Subject Schedule */}
          <div className="my-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-[#142d2a] uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#943217]" />
                <span>Examination Schedule &amp; Subject Details / विषय एवं परीक्षा कार्यक्रम</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Total Papers: {student.subjects.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-[#142d2a] text-amber-300 uppercase text-[10px]">
                  <tr>
                    <th className="py-1.5 px-2 border border-slate-300 text-center">S.No</th>
                    <th className="py-1.5 px-2 border border-slate-300">Date &amp; Day</th>
                    <th className="py-1.5 px-2 border border-slate-300">Timing &amp; Shift</th>
                    <th className="py-1.5 px-2 border border-slate-300">Sub. Code</th>
                    <th className="py-1.5 px-3 border border-slate-300">Subject Name</th>
                    <th className="py-1.5 px-2 border border-slate-300 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {schedule.map((item, idx) => (
                    <tr key={item.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                      <td className="py-1.5 px-2 border border-slate-300 text-center font-bold">{idx + 1}</td>
                      <td className="py-1.5 px-2 border border-slate-300 font-mono font-semibold text-slate-900">
                        {item.date} ({item.day.slice(0, 3)})
                      </td>
                      <td className="py-1.5 px-2 border border-slate-300 text-slate-700 font-medium">
                        {item.time}
                      </td>
                      <td className="py-1.5 px-2 border border-slate-300 font-mono font-bold text-[#943217]">
                        {item.code}
                      </td>
                      <td className="py-1.5 px-3 border border-slate-300 font-bold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-1.5 px-2 border border-slate-300 text-center text-slate-400 font-mono text-[9px]">
                        _______________
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Examination Instructions */}
          <div className="border-t border-slate-200 pt-2.5 my-2">
            <span className="font-bold text-[#943217] text-[10px] uppercase block mb-1">
              Important Instructions for Candidates / परीक्षार्थियों के लिए महत्वपूर्ण निर्देश:
            </span>
            <ol className="list-decimal list-inside text-[9px] text-slate-700 space-y-0.5 leading-tight">
              <li>परीक्षार्थियों को परीक्षा केंद्र पर परीक्षा प्रारंभ होने से कम से कम 30 मिनट पूर्व उपस्थित होना अनिवार्य है। (Reporting time: 09:00 AM).</li>
              <li>प्रवेश पत्र (Admit Card) के बिना किसी भी परिस्थिति में परीक्षा कक्ष में प्रवेश की अनुमति नहीं दी जाएगी।</li>
              <li>परीक्षा भवन में मोबाइल फोन, स्मार्ट वॉच, कैलकुलेटर अथवा अन्य किसी भी प्रकार के इलेक्ट्रॉनिक उपकरण ले जाना सख्त मना है।</li>
              <li>उत्तर पुस्तिका पर अपना रोल नंबर, विषय कोड एवं ओएमआर शीट सावधानीपूर्वक भरें।</li>
              <li>प्रवेश पत्र पर दिए गए QR Code को स्कैन करके ऑनलाइन प्रामाणिकता की जांच किसी भी समय की जा सकती है।</li>
            </ol>
          </div>

          {/* Official Signatures & Verification Seal Footer */}
          <div className="border-t-2 border-[#142d2a] pt-4 mt-3 grid grid-cols-3 gap-3 items-end text-center">
            
            {/* Left: Center Superintendent */}
            <div>
              <div className="w-24 h-8 mx-auto border-b border-dashed border-slate-400 mb-1"></div>
              <span className="text-[10px] font-bold text-slate-800 uppercase block">
                Center Superintendent
              </span>
              <span className="text-[8px] text-slate-500">
                Seal &amp; Signature
              </span>
            </div>

            {/* Middle: Live Scan verification box */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-emerald-800 font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                • DIGITAL E-ADMIT CARD •
              </span>
              <span className="text-[7px] text-slate-500 mt-0.5">
                Ref: BSEDRC/AC/{student.session}/{student.rollNo}
              </span>
            </div>

            {/* Right: Chief Executive Officer */}
            <div className="flex justify-center md:justify-end">
              <OfficialSignature
                officerName="Bibhishan Kumar"
                designation="Chief Executive Officer"
                councilSubtitle="BRSV & RCT Council, Madhepura"
                align="center"
                size="sm"
              />
            </div>

          </div>

          {/* Barcode Strip */}
          <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex flex-wrap items-center justify-between text-[8px] text-slate-500 font-mono">
            <span>BARCODE: *{student.rollNo}*{student.regNo.replace(/[^a-zA-Z0-9]/g, '')}*</span>
            <span>OFFICIAL SECURE E-HALL TICKET • BSEDRC BIHAR</span>
            <span className="text-emerald-700 font-bold">VERIFIED BY COUNCIL CLOUD SERVER</span>
          </div>

        </div>
      </div>
    </div>
  );
};
