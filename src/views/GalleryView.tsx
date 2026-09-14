import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  gallery: GalleryItem[];
  isAdminLoggedIn?: boolean;
  onOpenAdminModal?: () => void;
  onGoToAdminGallery?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  gallery,
  isAdminLoggedIn = false,
  onOpenAdminModal,
  onGoToAdminGallery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Awards & Distribution',
    'Science & Tech',
    'Examination',
    'Sports & Cultural',
    'Campus Life',
  ];

  const categoryHindiMap: Record<string, string> = {
    'All': 'सभी फोटो',
    'Awards & Distribution': 'पुरस्कार वितरण व सम्मान',
    'Science & Tech': 'विज्ञान एवं नवाचार',
    'Examination': 'परीक्षा केंद्र व्यवस्था',
    'Sports & Cultural': 'खेलकूद व सांस्कृतिक',
    'Campus Life': 'परिसर एवं छात्र जीवन',
  };

  const filteredGallery = gallery.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) || 
      (item.titleHindi && item.titleHindi.toLowerCase().includes(q)) || 
      (item.caption && item.caption.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const activeImage = activeImageIndex !== null ? filteredGallery[activeImageIndex] : null;

  const handleNext = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % filteredGallery.length);
  };

  const handlePrev = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#142d2a] via-[#1a3834] to-[#0f211f] text-white p-6 sm:p-8 rounded-2xl shadow-md border-b-4 border-[#943217] relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/40">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>आधिकारिक फोटो एवं मीडिया गैलरी • Official Gallery</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-serif tracking-tight">
              शैक्षणिक एवं पाठ्यक्रमेतर गतिविधियाँ गैलरी
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (कक्षा 6ठी से 10वीं तक): वार्षिक पुरस्कार वितरण, परीक्षा केंद्र निरीक्षण, बाल विज्ञान प्रदर्शनी, खेलकूद प्रतियोगिता एवं स्मार्ट कक्षाओं के यादगार दृश्य।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-300 block font-mono">
                {gallery.length}
              </span>
              <span className="text-[11px] text-slate-200 uppercase font-semibold">
                कुल तस्वीरें (Total Photos)
              </span>
            </div>

            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={onGoToAdminGallery}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>गैलरी प्रबंध (Admin Manager)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="bg-white/15 hover:bg-white/25 text-amber-300 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login to Upload</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls: Search & Category Pills */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="फोटो खोजें (Search title or event)..."
              className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 rounded-lg text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#142d2a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            प्रदर्शित: <span className="font-bold text-slate-900">{filteredGallery.length}</span> फोटो
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? gallery.length 
              : gallery.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#142d2a] text-amber-300 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{categoryHindiMap[cat] || cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Photo Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">कोई फोटो नहीं मिली (No Photos Found)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            आपके द्वारा चुने गए वर्ग या खोज शब्द "{searchQuery}" के लिए कोई तस्वीर उपलब्ध नहीं है। कृपया फ़िल्टर रीसेट करें।
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs text-[#943217] font-bold hover:underline"
          >
            सभी फोटो देखें (View All Photos)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveImageIndex(idx)}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
            >
              {/* Image Container with Zoom & Badge */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                  <span className="text-[11px] font-medium flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>पूर्ण आकार देखें</span>
                  </span>
                </div>

                {/* Category Badge */}
                <span className="absolute top-2.5 left-2.5 bg-[#142d2a]/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {item.category}
                </span>

                {item.featured && (
                  <span className="absolute top-2.5 right-2.5 bg-[#943217] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>प्रमुख (Featured)</span>
                  </span>
                )}
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#943217] transition-colors">
                    {item.titleHindi || item.title}
                  </h3>

                  {item.titleHindi && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {item.title}
                    </p>
                  )}
                </div>

                {item.caption && (
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 border-t border-slate-100 mt-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
          onClick={() => setActiveImageIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[95vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#943217] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {activeImage.category}
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  {activeImage.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeImage.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  title="Open full image in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Original</span>
                </a>
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 hover:text-white text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh]">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain select-none"
              />

              {/* Prev / Next buttons */}
              {filteredGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Caption */}
            <div className="p-4 sm:p-5 bg-slate-950 text-white space-y-1.5 border-t border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base sm:text-lg font-bold text-amber-300">
                  {activeImage.titleHindi || activeImage.title}
                </h2>
                <span className="text-xs text-slate-400 shrink-0 font-mono">
                  {(activeImageIndex || 0) + 1} / {filteredGallery.length}
                </span>
              </div>

              {activeImage.titleHindi && (
                <p className="text-xs text-slate-300 font-medium">
                  {activeImage.title}
                </p>
              )}

              {activeImage.caption && (
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {activeImage.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Council Notice on Foundation Scope (Class 6 to 10 Only) */}
      <div className="bg-[#fcf8f0] p-4 sm:p-5 rounded-xl border border-amber-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold text-[#943217] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>परिषद कार्यक्षेत्र अधिसूचना (Jurisdiction Notice)</span>
          </div>
          <p className="text-slate-600">
            बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद विशेष रूप से <strong>कक्षा 6ठी से 10वीं तक (Middle & Secondary Foundation)</strong> के लिए संचालित है। उच्चतर माध्यमिक (11वीं व 12th) के कार्यक्रम इसमें शामिल नहीं हैं।
          </p>
        </div>

        {isAdminLoggedIn && (
          <button
            type="button"
            onClick={onGoToAdminGallery}
            className="px-4 py-2 bg-[#142d2a] hover:bg-[#1e4641] text-amber-300 font-bold rounded-lg shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>गैलरी में नई तस्वीर अपलोड करें</span>
          </button>
        )}
      </div>

    </div>
  );
};
