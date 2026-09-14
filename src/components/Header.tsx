import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Briefcase, 
  CreditCard, 
  Bell, 
  Lock, 
  Menu, 
  X, 
  FileCheck, 
  Calendar, 
  Filter, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  GraduationCap,
  School,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { BiharCouncilLogo } from './BiharCouncilLogo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  lang: 'EN' | 'HI';
  setLang: (lang: 'EN' | 'HI') => void;
  activeFilter?: string;
  setActiveFilter?: (filter: string) => void;
  onQuickSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  setIsAdminModalOpen,
  lang,
  setLang,
  activeFilter = 'all',
  setActiveFilter,
  onQuickSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentDateTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: lang === 'EN' ? 'Home' : 'मुख्य पृष्ठ', icon: Building2 },
    { id: 'student', label: lang === 'EN' ? 'Student Registration' : 'छात्र पंजीकरण', icon: UserCheck, badge: 'Auto Card' },
    { id: 'schools', label: lang === 'EN' ? 'School Directory' : 'विद्यालय सूची', icon: School, badge: 'UDISE' },
    { id: 'online-forms', label: lang === 'EN' ? 'Online Forms' : 'ऑनलाइन फॉर्म', icon: FileText, badge: 'Live' },
    { id: 'gallery', label: lang === 'EN' ? 'Photo Gallery' : 'फोटो गैलरी', icon: ImageIcon, badge: 'New' },
    { id: 'results', label: lang === 'EN' ? 'Results 2025' : 'परीक्षा परिणाम', icon: FileCheck, badge: 'Active' },
    { id: 'jobs', label: lang === 'EN' ? 'Recruitment Cell' : 'रोजगार भर्ती', icon: Briefcase },
    { id: 'fees', label: lang === 'EN' ? 'Online Fee' : 'शुल्क भुगतान', icon: CreditCard },
    { id: 'certificates', label: lang === 'EN' ? 'Certificates' : 'प्रमाण पत्र', icon: Award },
    { id: 'notifications', label: lang === 'EN' ? 'Circulars' : 'सूचनाएँ', icon: Bell },
  ];

  const filterOptions = [
    { id: 'all', label: lang === 'EN' ? 'All Services' : 'सभी सेवाएँ', targetTab: 'home' },
    { id: 'schools', label: lang === 'EN' ? 'Saharsa & Madhepura Schools' : 'स्कूल लिस्ट (सहरसा / मधेपुरा)', targetTab: 'schools' },
    { id: 'online-forms', label: lang === 'EN' ? 'Apply E-Forms' : 'ऑनलाइन फॉर्म आवेदन', targetTab: 'online-forms' },
    { id: 'gallery', label: lang === 'EN' ? 'Council Photo Gallery' : 'फोटो गैलरी (तस्वीरें)', targetTab: 'gallery' },
    { id: 'class10', label: lang === 'EN' ? 'Class 10th (Matric)' : 'कक्षा 10वीं (मैट्रिक)', targetTab: 'results' },
    { id: 'class6to9', label: lang === 'EN' ? 'Class 6th-9th Foundation' : 'कक्षा 6-9वीं फाउंडेशन', targetTab: 'student' },
    { id: 'regcard', label: lang === 'EN' ? 'Registration Card' : 'पंजीकरण कार्ड', targetTab: 'student' },
    { id: 'jobs', label: lang === 'EN' ? 'Job Vacancies' : 'रिक्त पद भर्ती', targetTab: 'jobs' },
    { id: 'verification', label: lang === 'EN' ? 'Certificate Verification' : 'सत्यापन', targetTab: 'certificates' },
    { id: 'fees', label: lang === 'EN' ? 'Pay Fee & Challan' : 'ई-चालान', targetTab: 'fees' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onQuickSearch) {
      onQuickSearch(searchQuery.trim());
    } else {
      // Smart route based on input
      const q = searchQuery.trim().toUpperCase();
      if (q.startsWith('BSE/') || q.startsWith('REG')) {
        setCurrentTab('student');
      } else if (/^\d{6,8}$/.test(q)) {
        setCurrentTab('results');
      } else if (q.includes('JOB') || q.includes('APP')) {
        setCurrentTab('jobs');
      } else {
        setCurrentTab('student');
      }
    }
  };

  const handleFilterClick = (filterId: string, targetTab: string) => {
    if (setActiveFilter) {
      setActiveFilter(filterId);
    }
    if (targetTab && targetTab !== currentTab) {
      setCurrentTab(targetTab);
    }
  };

  return (
    <header className="w-full bg-[#fbf8f2] border-b border-[#e5ded0] sticky top-0 z-40 shadow-sm select-none">
      {/* 1. TOP UTILITY BAR (PC and Tablet) */}
      <div className="bg-[#142d2a] text-[#d1e0dc] text-[11px] py-1.5 px-3 sm:px-6 border-b border-[#1b3d39]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-[#f59e0b] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Autonomous Educational Council &amp; Research Trust | Madhepura (Bihar)</span>
            </span>
            <span className="hidden md:inline text-emerald-800">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{currentDateTime}</span>
            </span>
          </div>

          {/* Right contacts, lang & admin */}
          <div className="flex items-center gap-3 ml-auto text-xs">
            <a 
              href="tel:+917070530080" 
              className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors font-mono"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 7070530080</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a 
              href="mailto:adarshbiharsiksha@gmail.com" 
              className="hidden lg:flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>adarshbiharsiksha@gmail.com</span>
            </a>

            {/* Language Switch */}
            <div className="flex items-center bg-[#0d211e] rounded p-0.5 border border-[#1b3d39]">
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  lang === 'EN' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => setLang('HI')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  lang === 'HI' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Matches Exact Uploaded Screenshot: Cream background, terracotta Hindi & English title, logo, hamburger) */}
      <div className="bg-[#fbf7f0] border-b-2 border-[#943217] py-2.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Council Title (Exact Match to Screenshot 1) */}
          <div 
            className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1 min-w-0" 
            onClick={() => setCurrentTab('home')}
          >
            {/* Official Circular Seal */}
            <BiharCouncilLogo size={58} className="sm:w-[68px] sm:h-[68px]" />

            {/* Title block */}
            <div className="flex flex-col justify-center min-w-0">
              {/* Hindi Main Title in Terracotta/Brick Red */}
              <h1 className="text-[#943217] font-bold text-lg sm:text-2xl md:text-3xl leading-tight font-serif tracking-tight truncate">
                बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
              </h1>
              {/* English Subtitle */}
              <h2 className="text-[#943217] font-bold text-[9px] sm:text-xs md:text-sm tracking-wider uppercase font-sans mt-0.5 truncate">
                BIHAR STATE EDUCATIONAL DEVELOPMENT &amp; RESEARCH COUNCIL
              </h2>
              {/* Council tag */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-600 mt-0.5">
                <span className="font-semibold text-[#142d2a]">BRSV &amp; RCT</span>
                <span>•</span>
                <span className="truncate">Regd. Head Office: Madhepura, Bihar (852113)</span>
              </div>
            </div>
          </div>

          {/* Quick Desktop Portal Search Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentTab('student')}
              className="hidden lg:flex items-center gap-1.5 bg-[#943217] hover:bg-[#7d2912] text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Registration Card</span>
            </button>

            {/* Mobile Hamburger Toggle (Matches Screenshot 1 Right Icon) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-[#142d2a] hover:bg-amber-100/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7 stroke-[2.5]" /> : <Menu className="w-7 h-7 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR (Desktop & Mobile Drawer) */}
      <nav className="bg-[#142d2a] text-white px-3 sm:px-6 hidden lg:block border-b border-[#1b3d39]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-200 hover:bg-[#1f423d] hover:text-amber-300'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tight ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Registration / Roll Number Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative py-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg No / Roll No..."
              className="bg-[#0f2421] text-xs text-white placeholder-slate-400 rounded-l px-3 py-1.5 w-48 focus:w-60 transition-all border border-[#234d47] focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-r font-semibold text-xs transition-colors"
              title="Search records"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </nav>

      {/* 4. RESPONSIVE QUICK FILTER & SEARCH BAR (Works on BOTH PC and Mobile!) */}
      <div className="bg-[#f0e9dc] border-b border-[#dfd6c4] px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="flex lg:hidden items-center w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reg. No. (e.g. BSE/2025/1001) or Roll No..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-l border border-slate-300 focus:outline-none focus:border-[#943217] text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="bg-[#943217] text-white px-3.5 py-1.5 rounded-r text-xs font-semibold hover:bg-[#7d2912] shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filter Chips carousel / pills (PC and Mobile friendly) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 w-full">
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#943217] uppercase shrink-0 mr-1">
              <Filter className="w-3 h-3" />
              <span>Filters:</span>
            </div>
            {filterOptions.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFilterClick(f.id, f.targetTab)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#943217] text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 hover:bg-[#e2d8c6] border border-[#d8cdb8]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. MOBILE EXPANDABLE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#142d2a] text-white border-b border-[#1b3d39] px-4 py-3 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 pb-1 mb-1 border-b border-[#1b3d39] flex items-center justify-between">
            <span>Council Navigation Menu</span>
            <span className="text-slate-400 text-[10px]">BSEDRC Bihar</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:bg-[#1b3d39]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Contact quick call in mobile drawer */}
          <div className="pt-2 mt-2 border-t border-[#1b3d39] text-[11px] text-slate-300 flex items-center justify-between">
            <a href="tel:+917070530080" className="flex items-center gap-1.5 text-amber-400">
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline: +91 7070530080</span>
            </a>
            <span className="text-slate-400">Madhepura, Bihar</span>
          </div>
        </div>
      )}
    </header>
  );
};
