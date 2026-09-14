import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Award, ExternalLink, Globe, Lock, ShieldAlert } from 'lucide-react';
import { BiharCouncilLogo } from './BiharCouncilLogo';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn?: boolean;
  setIsAdminModalOpen?: (open: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  setCurrentTab,
  isAdminLoggedIn = false,
  setIsAdminModalOpen
}) => {
  return (
    <footer className="no-print bg-[#142d2a] text-[#d6e2df] border-t-4 border-[#943217] pt-12 pb-8 text-xs font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Col 1: Logo & Mission Statement (Matches Screenshot 2) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="p-1 bg-white rounded-full shadow-md">
                <BiharCouncilLogo size={52} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight font-serif tracking-tight">
                  बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold tracking-wider block uppercase mt-0.5">
                  Bihar State Educational Development &amp; Research Council
                </span>
                <span className="text-[10px] text-emerald-300">
                  Autonomous Council | Madhepura, Bihar
                </span>
              </div>
            </div>

            {/* Exact Quote from Screenshot 2 */}
            <p className="text-[#a2bcba] text-sm leading-relaxed max-w-md font-medium italic">
              “Building an educated, confident and empowered Bihar—one student at a time.”
            </p>

            <div className="flex items-center gap-3 pt-2 text-[11px] text-emerald-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Autonomous Education Body</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>ISO 9001:2015 Standards</span>
              </div>
            </div>
          </div>

          {/* Col 2: QUICK LINKS (Matches Screenshot 2) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase border-b border-[#234540] pb-2 text-amber-300">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-[#b0c8c5]">
              <li>
                <button 
                  onClick={() => setCurrentTab('home')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> About us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('home')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Awards &amp; recognition
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('home')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Our work
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('student')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Student Registration Card
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('results')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Annual Board Results 2025
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('jobs')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Employee Job Recruitment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('payment')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Online Fee Payment &amp; e-Challan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentTab('certificates')} 
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-500">›</span> Certificate Verification Desk
                </button>
              </li>
              <li className="pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (isAdminLoggedIn) {
                      setCurrentTab('admin');
                    } else if (setIsAdminModalOpen) {
                      setIsAdminModalOpen(true);
                    }
                  }} 
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-[#1d3d38] hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold transition-all border border-[#2b5952]"
                >
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isAdminLoggedIn ? 'Admin Panel Active' : 'Admin Login (अधीक्षक लॉगिन)'}</span>
                  </span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1 rounded font-mono">
                    {isAdminLoggedIn ? 'OPEN' : 'LOGIN'}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: CONTACT (Matches Screenshot 2) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase border-b border-[#234540] pb-2 text-amber-300">
              CONTACT
            </h4>
            <div className="space-y-3 text-[#c2d7d4]">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-semibold text-white">Head Office Address:</p>
                  <p>Neha Bhawan, Near BNMV College,</p>
                  <p>Sahugarh, Madhepura, Bihar 852113</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Helpline &amp; WhatsApp:</span>
                  <a href="tel:+917070530080" className="text-white hover:text-amber-400 font-mono font-medium">
                    +91 7070530080
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Official Email:</span>
                  <a href="mailto:adarshbiharsiksha@gmail.com" className="text-white hover:text-amber-400 font-mono">
                    adarshbiharsiksha@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1 text-[11px] text-[#93b3af]">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Web Domain: bsedrc.in / bserdc.bihar</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dedicated Council Administrative Access Strip */}
        <div className="bg-[#0e211e] rounded-xl border border-[#1e423d] p-3.5 sm:p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-white font-bold text-xs uppercase tracking-wide">
                  Council Administrative Portal (परिषद प्रशासनिक लॉगिन)
                </h5>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 font-mono">
                  Council Portal Active
                </span>
              </div>
              <p className="text-[#98b8b4] text-[11px] mt-0.5">
                Restricted portal for Secretary, Examination Controller &amp; IT Administration.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isAdminLoggedIn) {
                setCurrentTab('admin');
              } else if (setIsAdminModalOpen) {
                setIsAdminModalOpen(true);
              }
            }}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              isAdminLoggedIn 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Open Council Admin Dashboard' : 'Admin Login (अधीक्षक लॉगिन)'}</span>
          </button>
        </div>

        {/* Divider line matching Screenshot 2 */}
        <div className="border-t border-[#234540] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8ea8a4]">
          <p>© 2026 Bihar State Educational Development &amp; Research Council. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hover:text-white cursor-pointer">Madhepura, Bihar</span>
            <span>•</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">RTI Disclosures</span>
            <span>•</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">Privacy &amp; Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
