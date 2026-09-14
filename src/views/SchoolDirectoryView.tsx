import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  GraduationCap, 
  School, 
  Filter, 
  Database,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_SCHOOLS_LIST, DISTRICT_SUMMARY } from '../data/schoolsData';
import { SchoolInfo } from '../types';

interface SchoolDirectoryViewProps {
  onSelectSchoolForRegistration?: (school: SchoolInfo) => void;
}

export const SchoolDirectoryView: React.FC<SchoolDirectoryViewProps> = ({
  onSelectSchoolForRegistration,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedUdise, setCopiedUdise] = useState<string | null>(null);

  const handleCopyUdise = (udise: string) => {
    navigator.clipboard.writeText(udise);
    setCopiedUdise(udise);
    setTimeout(() => setCopiedUdise(null), 2000);
  };

  const filteredSchools = useMemo(() => {
    return OFFICIAL_SCHOOLS_LIST.filter((school) => {
      // District filter
      if (selectedDistrict !== 'All' && school.district !== selectedDistrict) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && school.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = school.name.toLowerCase().includes(query);
        const matchUdise = school.udiseCode.toLowerCase().includes(query);
        const matchBlock = school.block.toLowerCase().includes(query);
        const matchDist = school.district.toLowerCase().includes(query);
        return matchName || matchUdise || matchBlock || matchDist;
      }
      return true;
    });
  }, [searchTerm, selectedDistrict, selectedCategory]);

  const categories = [
    'All',
    'High School / +2',
    'Middle School',
    'Public / Private School',
    'Girls School',
    'Madarsa / Sanskrit'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#142d2a] to-[#1e4641] text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ministry of Education • UDISE+ Official Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-serif tracking-tight text-amber-300">
            विद्यालय निर्देशिका एवं यू-डाइस कोड खोज (School Directory)
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed">
            सहरसा एवं मधेपुरा जिले के सभी मान्यता प्राप्त माध्यमिक, उच्च माध्यमिक, मध्य विद्यालय, कस्तूरबा बालिका विद्यालय एवं सीबीएसई/आईसीएसई पब्लिक स्कूलों की आधिकारिक सूची। अपने स्कूल का 11-अंकों का UDISE कोड आसानी से खोजें।
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-xs">
            <div className="bg-black/25 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Saharsa District</span>
              <span className="text-lg font-black text-amber-300">1,842 Schools</span>
              <span className="text-[9px] text-slate-400 block">Kahra, Mahishi, Simri Bakhtiyarpur</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Madhepura Block</span>
              <span className="text-lg font-black text-amber-300">300 Schools</span>
              <span className="text-[9px] text-slate-400 block">Sahugadh, Bhirkhi, Sukhasan</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Verified Data Source</span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" /> UDISE+ Official
              </span>
              <span className="text-[9px] text-slate-400 block">National School Census Directory</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <School size={220} />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="स्कूल का नाम या 11 अंकों का UDISE कोड टाइप करें (e.g. 10111202922 या Sahugadh)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#142d2a] focus:bg-white transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* District Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#142d2a] focus:outline-hidden"
            >
              <option value="All">All Districts / सभी जिले</option>
              <option value="Madhepura">मधेपुरा (Madhepura Block - 300)</option>
              <option value="Saharsa">सहरसा (Saharsa District - 1,842)</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0 text-[11px]">
            <Filter className="w-3.5 h-3.5" /> श्रेणी:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#142d2a] text-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'सभी स्कूल (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-600">
        <span className="font-semibold">
          कुल मिले स्कूल: <strong className="text-slate-950 font-bold text-sm">{filteredSchools.length}</strong>
        </span>
        <span className="text-[11px] text-slate-500">
          Source: Official UDISE+ Directorate of Education, Bihar
        </span>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => {
          const isCopied = copiedUdise === school.udiseCode;

          return (
            <div
              key={school.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#142d2a] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    school.category === 'High School / +2'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : school.category === 'Girls School'
                      ? 'bg-rose-100 text-rose-900 border border-rose-200'
                      : school.category === 'Madarsa / Sanskrit'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {school.category}
                  </span>

                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {school.district}
                  </span>
                </div>

                {/* School Name */}
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#943217] transition-colors line-clamp-2">
                  {school.name}
                </h3>

                {/* Block & Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Block: <strong>{school.block}</strong>, Dist: {school.district}</span>
                </div>

                {school.address && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {school.address}
                  </p>
                )}
              </div>

              {/* UDISE Strip & Selection Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">UDISE Code</span>
                    <span className="font-mono font-black text-[#142d2a] text-sm tracking-wider">
                      {school.udiseCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyUdise(school.udiseCode)}
                    className="flex items-center gap-1 text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-300 text-slate-700 hover:text-[#943217] hover:border-[#943217] transition-colors cursor-pointer"
                    title="Copy UDISE Code"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {onSelectSchoolForRegistration && (
                  <button
                    onClick={() => onSelectSchoolForRegistration(school)}
                    className="w-full bg-[#142d2a] hover:bg-[#1f443f] text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>पंजीयन फॉर्म में यह स्कूल चुनें</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSchools.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">कोई स्कूल नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            "{searchTerm}" से मेल खाता हुआ कोई स्कूल नहीं मिला। कृपया स्कूल का दूसरा नाम या 11-अंकों का UDISE कोड डालकर पुनः प्रयास करें।
          </p>
        </div>
      )}

    </div>
  );
};
