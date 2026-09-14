import React, { useState } from 'react';
import { Printer, Download, CheckCircle, FileText, Copy, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Student } from '../types';

interface StudentRegistrationCardProps {
  student: Student;
  onPrint?: () => void;
  onSwitchToAdmitCard?: () => void;
}

// Format DOB to DD-MM-YYYY
function getFormattedDob(dob: string): string {
  if (!dob) return '28-06-2013';
  const clean = dob.trim().replace(/[/.]/g, '-');
  const parts = clean.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY -> DD-MM-YYYY
      return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
    }
  }
  return dob;
}

// Class details for 5th to 10th
function getClassDetails(course: string): { grade: string; roman: string } {
  if (!course) return { grade: '8th', roman: 'VIII' };
  const str = course.toString().trim();
  if (/10th|\b10\b|\bx\b|मैट्रिक|दसवीं/i.test(str)) return { grade: '10th', roman: 'X' };
  if (/9th|\b9\b|\bix\b|नवमी|नौवीं/i.test(str)) return { grade: '9th', roman: 'IX' };
  if (/8th|\b8\b|\bviii\b|आठवीं/i.test(str)) return { grade: '8th', roman: 'VIII' };
  if (/7th|\b7\b|\bvii\b|सातवीं/i.test(str)) return { grade: '7th', roman: 'VII' };
  if (/6th|\b6\b|\bvi\b|छठी|छठा/i.test(str)) return { grade: '6th', roman: 'VI' };
  if (/5th|\b5\b|\bv\b|पांचवी|पांचवा/i.test(str)) return { grade: '5th', roman: 'V' };
  return { grade: '8th', roman: 'VIII' };
}

// Strictly fixed 5 subjects for Talent Competition Registration Card (no other subjects permitted):
// हिन्दी, गणित, विज्ञान, सामाजिक विज्ञान, सामान्य ज्ञान
const FIXED_SUBJECTS_STRING = 'हिन्दी, गणित, विज्ञान, सामाजिक विज्ञान, सामान्य ज्ञान';

export const StudentRegistrationCard: React.FC<StudentRegistrationCardProps> = ({
  student,
  onPrint,
  onSwitchToAdmitCard,
}) => {
  const [showDigitalSig, setShowDigitalSig] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  const handlePrintIsolated = () => {
    if (onPrint) {
      onPrint();
      return;
    }

    const cardElement = document.getElementById('registration-card-print');
    if (!cardElement) {
      window.print();
      return;
    }

    setIsPrinting(true);

    try {
      const oldIframe = document.getElementById('bsedrc-registration-print-iframe');
      if (oldIframe) oldIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'bsedrc-registration-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        setIsPrinting(false);
        return;
      }

      const clone = cardElement.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.no-print').forEach((el) => el.remove());

      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((node) => node.outerHTML)
        .join('\n');

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Registration_Card_${(student.regNo || 'Card').replace(/[^a-zA-Z0-9_-]/g, '_')}</title>
            ${styles}
            <style>
              @page {
                size: A4 portrait;
                margin: 5mm;
              }
              *, *::before, *::after {
                box-sizing: border-box;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .isolated-print-wrapper {
                width: 100% !important;
                max-width: 820px !important;
                margin: 0 auto !important;
                padding: 2mm !important;
                background: #ffffff !important;
              }
              .no-print {
                display: none !important;
              }
            </style>
          </head>
          <body>
            <div class="isolated-print-wrapper">
              ${clone.outerHTML}
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        } finally {
          setIsPrinting(false);
          setTimeout(() => {
            iframe.remove();
          }, 4000);
        }
      }, 500);
    } catch (err) {
      console.warn('Isolated iframe print fallback:', err);
      window.print();
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    const cardElement = document.getElementById('registration-card-print');
    if (!cardElement) {
      handlePrintIsolated();
      return;
    }

    try {
      setIsGeneratingPdf(true);
      setPdfNotice('Generating Registration Card PDF...');

      const canvas = await html2canvas(cardElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const maxContentWidth = pageWidth - (margin * 2);
      const imgWidth = maxContentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const posY = imgHeight < (pageHeight - margin * 2) ? margin + 1 : margin;

      pdf.addImage(imgData, 'JPEG', margin, posY, imgWidth, imgHeight, undefined, 'FAST');
      
      const cleanReg = (student.regNo || 'Registration_Card').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanName = (student.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`Registration_Card_${cleanReg}_${cleanName}.pdf`);
      
      setPdfNotice('PDF downloaded successfully!');
      setTimeout(() => setPdfNotice(null), 3000);
    } catch (err: any) {
      console.error('Direct PDF error, falling back to print dialog:', err);
      handlePrintIsolated();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyRegNo = () => {
    navigator.clipboard.writeText(student.regNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const classInfo = getClassDetails(student.course);
  const formattedDob = getFormattedDob(student.dob);
  const subjectsString = FIXED_SUBJECTS_STRING;
  
  // Session / Registration Year
  const regYear = student.session?.trim() ? (student.session.includes('-') ? student.session.split('-')[0].trim() : student.session.trim()) : '2026';
  const sessionDisplay = student.session || '2026-27';
  const schoolName = student.schoolNameHindi || student.centerName || 'मध्य विद्यालय, अर्राहा, घैलाढ़';
  const udiseCode = student.udiseCode || (student.centerCode && /^\d+$/.test(student.centerCode) ? student.centerCode : '10110901003');
  const nationality = student.nationality || 'INDIAN';
  const gender = (student.gender || 'FEMALE').toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Action Toolbar (no-print) */}
      <div className="no-print bg-slate-900 text-white px-5 py-3 rounded-t-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div className="text-xs sm:text-sm font-semibold">
            <span>पंजीयन संख्या: </span>
            <button
              onClick={handleCopyRegNo}
              className="text-amber-400 hover:text-amber-300 font-mono font-bold ml-1 inline-flex items-center gap-1 cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
              title="Click to copy registration number"
            >
              <span>{student.regNo}</span>
              <Copy className="w-3 h-3 text-slate-400" />
            </button>
            {copied && <span className="text-[11px] text-emerald-400 ml-2 font-normal">Copied!</span>}
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/40">
            {student.status.toUpperCase()}
          </span>
          <span className="text-[11px] text-slate-300 hidden md:inline">
            सत्र: <strong className="text-white">{sessionDisplay}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {pdfNotice && (
            <span className="text-[11px] text-amber-300 font-medium px-2 py-1 bg-slate-800 rounded border border-slate-700 animate-pulse">
              {pdfNotice}
            </span>
          )}

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none bg-slate-800 px-2.5 py-1.5 rounded border border-slate-700">
            <input
              type="checkbox"
              checked={showDigitalSig}
              onChange={(e) => setShowDigitalSig(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Digital Signature</span>
          </label>

          {onSwitchToAdmitCard && (
            <button
              onClick={onSwitchToAdmitCard}
              className="flex items-center gap-1.5 bg-[#943217] hover:bg-[#7a2812] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Admit Card</span>
            </button>
          )}

          <button
            onClick={handlePrintIsolated}
            disabled={isPrinting}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Prints strictly the Registration Card"
          >
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>{isPrinting ? 'Preparing Card...' : 'Print Registration Card'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Download Registration Card as PDF file"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGeneratingPdf ? 'Creating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Registration Card Canvas */}
      <div 
        id="registration-card-print" 
        className="printable-area bg-white text-slate-900 border-x border-b border-slate-300 rounded-b-xl p-3 sm:p-7 overflow-hidden shadow-xl"
      >
        {/* Outer Black Border (Thick) */}
        <div className="border-[3px] border-black p-1 sm:p-1.5 bg-white">
          {/* Inner Black Border (Thin) */}
          <div className="border border-black bg-white relative flex flex-col justify-between min-h-[580px]">
            
            {/* Subtle Security Background Watermark Pattern for candidate section */}
            <div 
              className="absolute inset-0 pointer-events-none select-none opacity-[0.035] flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 0.75px, transparent 0.75px)',
                backgroundSize: '12px 12px',
              }}
            >
              <img
                src="/assets/images/council_official_logo.jpg"
                alt="Watermark"
                className="w-[450px] h-[450px] object-contain opacity-25"
              />
            </div>

            {/* TOP HEADER SECTION (Exact Mint/Sage Green Box as in user's image) */}
            <div className="relative bg-[#cde7dc] pt-4 sm:pt-5 px-3 sm:px-6 pb-3 text-center border-b border-black">
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-2">
                {/* Left Emblem / Logo */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-black/50 p-1 bg-white shadow-sm">
                    <img
                      src="/assets/images/council_official_logo.jpg"
                      alt="बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद्, मधेपुरा"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>

                {/* Main Header Official Text */}
                <div className="flex-1 text-center">
                  {/* Line 1: Council Title */}
                  <h1 className="text-base sm:text-2xl font-bold text-black font-hindi tracking-tight leading-snug">
                    बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद्,मधेपुरा, बिहार
                  </h1>

                  {/* Line 2: Competition Title */}
                  <h2 className="text-xs sm:text-[15px] font-bold text-black font-hindi mt-1 leading-tight">
                    प्रखंड स्तरीय राष्ट्रीय शिक्षा प्रतिभा–सह–मेधा प्रतियोगिता परीक्षा – 2026
                  </h2>

                  {/* Line 3: English Translation */}
                  <p className="text-[10px] sm:text-[11.5px] text-black font-normal mt-0.5 leading-tight">
                    (Block Level National Education Talent-Cum-Merit Competitive Examination - 2026)
                  </p>

                  {/* Line 4: Class Vth - Xth Eligibility (Exact as screenshot) */}
                  <div className="text-[11px] sm:text-[12.5px] text-black font-bold font-hindi mt-1 leading-tight">
                    (कक्षा — Vth - Xth में अध्ययनरत विद्यार्थियों के लिए)
                  </div>

                  {/* Line 5: Student Specific Class */}
                  <div className="text-[10px] sm:text-[11px] text-black font-normal leading-tight">
                    (For Student Studying in Class {classInfo.roman})
                  </div>
                </div>
              </div>

              {/* Line 6: Document Title */}
              <div className="mt-2 pt-0.5 text-center">
                <span className="text-sm sm:text-lg font-bold text-black font-hindi uppercase tracking-wide">
                  पंजीयन पत्रक (REGISTRATION CARD) - 2026
                </span>
              </div>
            </div>

            {/* CANDIDATE DETAILS SECTION (Exact 2-Column Layout) */}
            <div className="relative px-4 sm:px-10 py-5 sm:py-7 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3.5 gap-x-6 text-xs sm:text-sm font-hindi">
                
                {/* Left Column (Personal Particulars & 5 Subjects) */}
                <div className="md:col-span-7 space-y-3">
                  {/* विद्यार्थी का नाम */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">विद्यार्थी का नाम</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black uppercase tracking-wide text-sm sm:text-base">{student.name}</span>
                  </div>

                  {/* जन्म तिथि */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">जन्म तिथि</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide">{formattedDob}</span>
                  </div>

                  {/* राष्ट्रीयता */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">राष्ट्रीयता</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide uppercase">{nationality}</span>
                  </div>

                  {/* माता का नाम */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">माता का नाम</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide uppercase">{student.motherName}</span>
                  </div>

                  {/* पिता का नाम */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">पिता का नाम</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide uppercase">{student.fatherName}</span>
                  </div>

                  {/* विद्यालय का नाम */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">विद्यालय का नाम</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide">{schoolName}</span>
                  </div>

                  {/* विषय: 5 Subjects Examination */}
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 font-bold text-black shrink-0">विषय</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide leading-relaxed">
                      {subjectsString}
                    </span>
                  </div>
                </div>

                {/* Right Column (Academic, Class, Session & Registration No.) */}
                <div className="md:col-span-5 space-y-3">
                  {/* लिंग */}
                  <div className="flex items-baseline">
                    <span className="w-28 sm:w-32 font-bold text-black shrink-0">लिंग</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide uppercase">{gender}</span>
                  </div>

                  {/* वर्ग (5th to 10th) */}
                  <div className="flex items-baseline">
                    <span className="w-28 sm:w-32 font-bold text-black shrink-0">वर्ग</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide">{classInfo.grade}</span>
                  </div>

                  {/* पंजीयन वर्ष */}
                  <div className="flex items-baseline">
                    <span className="w-28 sm:w-32 font-bold text-black shrink-0">पंजीयन वर्ष</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold text-black tracking-wide">{regYear}</span>
                  </div>

                  {/* पंजीयन संख्या */}
                  <div className="flex items-baseline">
                    <span className="w-28 sm:w-32 font-bold text-black shrink-0">पंजीयन संख्या</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold font-mono text-black tracking-wide text-xs sm:text-sm bg-amber-50/50 px-1 py-0.5 rounded border border-amber-200">
                      {student.regNo}
                    </span>
                  </div>

                  {/* यू-डायस कोड */}
                  <div className="flex items-baseline pt-4 md:pt-6">
                    <span className="w-28 sm:w-32 font-bold text-black shrink-0">यू–डायस कोड</span>
                    <span className="font-bold text-black mr-2">:</span>
                    <span className="font-bold font-mono text-black tracking-wide">{udiseCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIGNATURE AREA ABOVE FOOTER */}
            <div className="relative px-6 sm:px-10 pb-2 flex items-end justify-between min-h-[60px]">
              {/* Left blank area for Physical Headmaster Stamp/Sign */}
              <div className="text-center w-48">
                {/* Physical seal space */}
              </div>

              {/* Right Controller Signature / Seal */}
              {showDigitalSig && (
                <div className="text-center w-52 flex flex-col items-center">
                  <img
                    src="/assets/images/bibhishan_signature.jpg"
                    alt="Signature of Examination Controller"
                    className="h-12 sm:h-14 w-auto object-contain mix-blend-multiply drop-shadow-xs mb-1"
                  />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">Bibhishan Kumar</span>
                  <span className="text-[9px] text-slate-600 leading-tight">Chief Executive Officer / Controller</span>
                </div>
              )}
            </div>

            {/* BOTTOM CYAN/BLUE BAR (EXACT AS SCREENSHOT) */}
            <div className="relative w-full bg-[#82d1e7] border-t border-black px-4 sm:px-8 py-2.5 sm:py-3">
              <div className="flex items-center justify-between font-bold text-black font-hindi text-xs sm:text-sm">
                <span>प्रधानाध्यापक का हस्ताक्षर</span>
                <span>परीक्षा नियंत्रक का हस्ताक्षर</span>
              </div>
            </div>

          </div>
        </div>

        {/* Verification Reference Footer Note (no-print) */}
        <div className="mt-3 text-center text-[9px] text-slate-500 font-mono no-print">
          Official Council Online Verification Reference: {student.regNo} | सत्र: {sessionDisplay} | Class {classInfo.grade} (5 subjects: हिन्दी, गणित, विज्ञान, सामाजिक विज्ञान, सामान्य ज्ञान) | BRSV &amp; RCT Madhepura (Bihar)
        </div>
      </div>
    </div>
  );
};
