import React from 'react';
import { 
  Search, 
  Award, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Bell, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Building2, 
  CheckCircle, 
  Calendar,
  GraduationCap,
  Sparkles,
  Download,
  BookOpen,
  School,
  ExternalLink,
  MapPin,
  Phone,
  UserCheck
} from 'lucide-react';
import { Student, BoardNotification, JobVacancy } from '../types';
import { BiharCouncilLogo } from '../components/BiharCouncilLogo';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  notifications: BoardNotification[];
  vacancies: JobVacancy[];
  students: Student[];
  onSelectNotification: (notif: BoardNotification) => void;
  onSearchRegCard: (regNo: string) => void;
  activeFilter?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  notifications,
  vacancies,
  students,
  onSelectNotification,
  onSearchRegCard,
  activeFilter = 'all',
}) => {
  const [quickRegInput, setQuickRegInput] = React.useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRegInput.trim()) return;
    onSearchRegCard(quickRegInput.trim());
    setCurrentTab('student');
  };

  // Filter notifications if filter is active
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'class10') return n.title.includes('10th') || n.title.includes('Matric') || n.category === 'Examination';
    if (activeFilter === 'class12') return n.title.includes('12th') || n.title.includes('Senior') || n.category === 'Results';
    if (activeFilter === 'jobs') return n.category === 'Recruitment' || n.title.toLowerCase().includes('job') || n.title.toLowerCase().includes('vacancy');
    return true;
  });

  return (
    <div className="space-y-8 pb-14 font-sans select-none">
      
      {/* 1. HERO BANNER WITH STUDENTS & QUICK REG SEARCH */}
      <section className="bg-gradient-to-b from-[#142d2a] via-[#102422] to-[#0c1c1a] text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-[#943217] relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Council Intro & Instant Registration Card Lookup */}
            <div className="md:col-span-7 space-y-4 text-left w-full">
              
              {/* Official Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (BRSV &amp; RCT)</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-900/60 text-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-700/60 font-mono">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Madhepura, Bihar (852113)</span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase font-serif">
                बिहार राज्य शैक्षणिक विकास एवं <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                  अनुसंधान परिषद (BSEDRC)
                </span>
              </h1>

              {/* Authentic Bihar Motto */}
              <p className="text-amber-200/90 text-sm italic font-medium">
                “Building an educated, confident and empowered Bihar—one student at a time.”
              </p>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed w-full">
                Official centralized portal for auto-populated Student Registration Cards, Classes 6th to 10th Foundation &amp; Board Marksheets, Employee Job Recruitment, Online Fee Payment, and Cryptographic Digital Certificates.
              </p>

              {/* Instant Search Box for Registration Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/20 shadow-2xl w-full">
                <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Search Candidate Registration Card / पंजीयन खोजें</span>
                </div>
                
                <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter Registration No. (e.g. BSE/2025/1001 or 1001)"
                    value={quickRegInput}
                    onChange={(e) => setQuickRegInput(e.target.value)}
                    className="flex-1 bg-white text-slate-900 px-3.5 py-2.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-[#943217] hover:bg-[#7a2812] text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <span>View Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => setCurrentTab('student')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Student Registration Card</span>
                </button>
                <button
                  onClick={() => setCurrentTab('results')}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Board Results 2025</span>
                </button>
                <button
                  onClick={() => setCurrentTab('jobs')}
                  className="bg-[#1b3d39] hover:bg-[#234d47] text-slate-200 border border-[#2b5e57] font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Job Recruitment ({vacancies.length})</span>
                </button>
              </div>
            </div>

            {/* Right Column: Authentic Indian School Students & Quick Action Grid */}
            <div className="md:col-span-5 space-y-3.5 w-full mt-4 md:mt-0">
              
              {/* Featured Students Image Showcase */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
                <img
                  src="/assets/images/bihar_student_gathering_1789140582732.jpg"
                  alt="Bihar school students gathering in Madhepura"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit mb-1">
                    Bihar Rural &amp; Secondary Education Mission
                  </span>
                  <h3 className="text-white font-serif font-bold text-sm sm:text-base leading-tight">
                    Empowering Every Student with Digital Records &amp; Certified Education
                  </h3>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    BRSV &amp; RCT Autonomous Council, Sahugarh, Madhepura (Bihar)
                  </p>
                </div>
              </div>

              {/* 4 Quick Access Service Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* 1. Student Reg Card */}
                <div
                  onClick={() => setCurrentTab('student')}
                  className="bg-[#fbf7f0] text-slate-900 p-3 rounded-xl shadow-md border border-[#dfd6c4] hover:border-[#943217] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#943217]/10 text-[#943217] flex items-center justify-center mb-2 group-hover:bg-[#943217] group-hover:text-white transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">
                    Registration Card
                  </h4>
                  <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-1">
                    Auto-fill &amp; download card
                  </p>
                </div>

                {/* 2. Marksheets */}
                <div
                  onClick={() => setCurrentTab('results')}
                  className="bg-[#fbf7f0] text-slate-900 p-3 rounded-xl shadow-md border border-[#dfd6c4] hover:border-[#943217] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-2 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">
                    Board Results 2025
                  </h4>
                  <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-1">
                    Class 6th-10th division &amp; marks
                  </p>
                </div>

                {/* 3. Job Vacancies */}
                <div
                  onClick={() => setCurrentTab('jobs')}
                  className="bg-[#fbf7f0] text-slate-900 p-3 rounded-xl shadow-md border border-[#dfd6c4] hover:border-[#943217] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">
                    Recruitment Cell
                  </h4>
                  <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-1">
                    Teacher &amp; Staff applications
                  </p>
                </div>

                {/* 4. Fee Payment */}
                <div
                  onClick={() => setCurrentTab('fees')}
                  className="bg-[#fbf7f0] text-slate-900 p-3 rounded-xl shadow-md border border-[#dfd6c4] hover:border-[#943217] transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">
                    Fee &amp; e-Challan
                  </h4>
                  <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-1">
                    UPI QR, Cards &amp; Net Banking
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS & KEY COUNCIL METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fbf8f2] rounded-xl shadow-xs border border-[#e5ded0] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="border-r border-[#e5ded0] last:border-0">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#142d2a] block font-mono">
              {students.length * 125}+
            </span>
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Enrolled Students
            </span>
          </div>
          <div className="border-r border-[#e5ded0] last:border-0">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#943217] block font-mono">
              100%
            </span>
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              QR Verified Records
            </span>
          </div>
          <div className="border-r border-[#e5ded0] last:border-0">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 block font-mono">
              {vacancies.reduce((acc, v) => acc + v.vacancies, 0)}+
            </span>
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Recruitment Posts
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 block font-mono">
              Madhepura
            </span>
            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Council Head Office
            </span>
          </div>
        </div>
      </section>

      {/* 3. STUDENTS & BIHAR EDUCATION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#943217] pb-2">
          <div>
            <span className="text-[11px] font-bold text-[#943217] uppercase tracking-wider block">
              Secondary &amp; Higher Secondary Students &amp; Academic Initiatives
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#142d2a]">
              ग्रामीण एवं माध्यमिक शिक्षा विकास मिशन (Bihar Education Initiatives)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab('gallery')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#943217] hover:text-white hover:bg-[#943217] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-300 shadow-xs transition-colors cursor-pointer"
            >
              <span>संपूर्ण फोटो गैलरी देखें (View All Photos)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline">
              BSEDRC • BRSV &amp; RCT Madhepura
            </span>
          </div>
        </div>

        {/* 4 Image Gallery Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Gallery Card 1: School Assembly */}
          <div className="bg-white rounded-xl overflow-hidden border border-[#e5ded0] shadow-xs hover:shadow-md transition-all group">
            <div className="h-40 overflow-hidden relative">
              <img
                src="/assets/images/bihar_school_assembly_1789140559004.jpg"
                alt="Utkramit School assembly in Chausa Madhepura Bihar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-[#142d2a]/90 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                उत्क्रमित +2 विद्यालय तियर टोला
              </span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                Universal Secondary Education
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ensuring equitable, standardized Class 6th to 10th curricula for every student across Bihar.
              </p>
            </div>
          </div>

          {/* Gallery Card 2: Teachers & Delegation */}
          <div className="bg-white rounded-xl overflow-hidden border border-[#e5ded0] shadow-xs hover:shadow-md transition-all group">
            <div className="h-40 overflow-hidden relative">
              <img
                src="/assets/images/madhepura_school_teachers_1789140526358.jpg"
                alt="Madhepura school teachers and council delegation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-[#943217]/90 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                मध्य विद्यालय जगजीवन आश्रम मधेपुरा
              </span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                Academic Excellence &amp; Delegation
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Educational review, digital student registration, and examination curriculum standards.
              </p>
            </div>
          </div>

          {/* Gallery Card 3: Art Award Ceremony */}
          <div className="bg-white rounded-xl overflow-hidden border border-[#e5ded0] shadow-xs hover:shadow-md transition-all group">
            <div className="h-40 overflow-hidden relative">
              <img
                src="/assets/images/girl_art_award_ceremony_1789140696861.jpg"
                alt="Girl student receiving art award and medal in Bihar ceremony"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-emerald-800/90 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                राज्य स्तरीय कला प्रतिभा सम्मान
              </span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                Student Talent &amp; Innovation Award
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Recognizing extraordinary artistic talent, fine arts, and academic excellence with council medals.
              </p>
            </div>
          </div>

          {/* Gallery Card 4: Merit Felicitation */}
          <div className="bg-white rounded-xl overflow-hidden border border-[#e5ded0] shadow-xs hover:shadow-md transition-all group">
            <div className="h-40 overflow-hidden relative">
              <img
                src="/assets/images/bihar_student_awards_1789140543552.jpg"
                alt="Bihar girl student merit award ceremony"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-amber-600/90 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                वार्षिक मेधा सम्मान एवं शील्ड वितरण
              </span>
            </div>
            <div className="p-3.5 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                Merit &amp; Digital Credentials
              </h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Instant generation of tamper-proof marksheets, passing certificates, and scholarships.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. NOTICE BOARD & ACTIVE RECRUITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Latest Notifications & Press Releases */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#142d2a] pb-2">
              <h2 className="text-base sm:text-lg font-bold text-[#142d2a] uppercase tracking-tight flex items-center gap-2 font-serif">
                <Bell className="w-5 h-5 text-[#943217]" />
                <span>Notice Board &amp; Circulars / आधिकारिक सूचनाएँ</span>
              </h2>
              <button
                onClick={() => setCurrentTab('notifications')}
                className="text-xs font-semibold text-[#943217] hover:text-[#7a2812] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-[#e5ded0] text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    वर्तमान में कोई नई सूचना प्रकाशित नहीं है (No Active Circulars)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    परिषद द्वारा नवीनतम आदेश एवं सूचनाएँ जारी होने पर यहाँ प्रदर्शित की जाएँगी।
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onSelectNotification(notif)}
                    className="bg-white p-4 rounded-xl border border-[#e5ded0] hover:border-[#943217] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#142d2a]/10 text-[#142d2a] text-[10px] font-bold px-2 py-0.5 rounded">
                          {notif.category}
                        </span>
                        {notif.isNew && (
                          <span className="bg-[#943217] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-xs">
                            NEW
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{notif.date}</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#943217] transition-colors">
                        {notif.title}
                      </h4>
                      <p className="text-slate-600 text-xs line-clamp-1">
                        {notif.description}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-[#943217] shrink-0 flex items-center gap-1 self-end sm:self-center">
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Recruitment Alert */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-2">
              <h2 className="text-base sm:text-lg font-bold text-[#142d2a] uppercase tracking-tight flex items-center gap-2 font-serif">
                <Briefcase className="w-5 h-5 text-emerald-700" />
                <span>Recruitment Alert</span>
              </h2>
              <button
                onClick={() => setCurrentTab('jobs')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>All Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {vacancies.slice(0, 3).map((vac) => (
                <div
                  key={vac.id}
                  onClick={() => setCurrentTab('jobs')}
                  className="bg-white p-4 rounded-xl border border-[#e5ded0] hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {vac.postCode}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {vac.vacancies} Posts
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {vac.title}
                  </h4>
                  
                  <div className="text-[11px] text-slate-600">
                    <div>Pay Scale: <span className="font-semibold text-slate-800">{vac.payScale}</span></div>
                    <div>Last Date: <span className="font-semibold text-rose-700">{vac.lastDate}</span></div>
                  </div>

                  <button className="w-full mt-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors cursor-pointer">
                    Apply Online (Fee: ₹{vac.applicationFee})
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. CONTACT & COUNCIL SECRETARIAT CALLOUT (Matches Screenshot 2 Contact Info) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#142d2a] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#1b3d39] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Council Head Office &amp; Secretariat
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
            </h3>
            <p className="text-[#c2d7d4] text-xs sm:text-sm leading-relaxed">
              Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar 852113. For candidate registration verification, exam queries, or affiliation assistance, contact our helpline.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-amber-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +91 7070530080
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                adarshbiharsiksha@gmail.com
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('student')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Search Registration Card</span>
            </button>
            <button
              onClick={() => setCurrentTab('certificates')}
              className="bg-[#1b3d39] hover:bg-[#234d47] text-white border border-[#2b5e57] font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verify Certificates</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
