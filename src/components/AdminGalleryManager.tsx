import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Upload, 
  ExternalLink, 
  CheckCircle, 
  X, 
  Calendar, 
  Tag, 
  Sparkles, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { GalleryItem } from '../types';
import { uploadToCloudflareR2 } from '../lib/storage';

interface AdminGalleryManagerProps {
  gallery: GalleryItem[];
  onAddNewGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onUpdateGalleryItem: (item: GalleryItem) => void;
}

export const AdminGalleryManager: React.FC<AdminGalleryManagerProps> = ({
  gallery,
  onAddNewGalleryItem,
  onDeleteGalleryItem,
  onUpdateGalleryItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [titleHindi, setTitleHindi] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Awards & Distribution');
  const [imageUrl, setImageUrl] = useState('');
  const [imageKey, setImageKey] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [caption, setCaption] = useState('');
  const [featured, setFeatured] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: GalleryItem['category'][] = [
    'Awards & Distribution',
    'Science & Tech',
    'Examination',
    'Sports & Cultural',
    'Campus Life',
    'Annual Function',
  ];

  // Quick preset sample images suitable for Bihar schools/councils
  const samplePresets = [
    {
      label: 'Classroom & Students',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Science Lab Experiment',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Library & Learning',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Academic Felicitation',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Cultural Stage Event',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Sports & Athletics',
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setTitleHindi('');
    setCategory('Awards & Distribution');
    setImageUrl('');
    setImageKey('');
    setIsUploading(false);
    setDate(new Date().toISOString().split('T')[0]);
    setCaption('');
    setFeatured(false);
    setErrorMsg('');
    setUploadFeedback('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setTitleHindi(item.titleHindi || '');
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setImageKey(item.imageKey || '');
    setIsUploading(false);
    setDate(item.date);
    setCaption(item.caption || '');
    setFeatured(Boolean(item.featured));
    setErrorMsg('');
    setUploadFeedback('');
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB. Please choose a smaller file.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');
      setUploadFeedback(`Uploading "${file.name}" to Cloudflare R2...`);

      const res = await uploadToCloudflareR2(file, {
        category: 'gallery',
        preferredFileName: `gallery_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
        isPrivate: false
      });

      if (res.success && res.url) {
        setImageUrl(res.url);
        setImageKey(res.key);
        setUploadFeedback(`✓ Uploaded to Cloudflare R2: ${res.key}`);
      } else {
        setErrorMsg('Upload failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo to Cloudflare R2.');
      setUploadFeedback('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide an English or general photo title.');
      return;
    }
    if (!imageUrl.trim()) {
      setErrorMsg('Please select an image file or provide an image URL.');
      return;
    }

    if (editingItem) {
      // Update
      const updated: GalleryItem = {
        ...editingItem,
        title: title.trim(),
        titleHindi: titleHindi.trim() || undefined,
        category,
        imageUrl: imageUrl.trim(),
        imageKey: imageKey || editingItem.imageKey || undefined,
        date,
        caption: caption.trim() || undefined,
        featured,
      };
      onUpdateGalleryItem(updated);
    } else {
      // Add new
      const newItem: GalleryItem = {
        id: 'gal-' + Date.now(),
        title: title.trim(),
        titleHindi: titleHindi.trim() || undefined,
        category,
        imageUrl: imageUrl.trim(),
        imageKey: imageKey || undefined,
        date,
        caption: caption.trim() || undefined,
        featured,
      };
      onAddNewGalleryItem(newItem);
    }

    setIsModalOpen(false);
  };

  const filteredGallery = gallery.filter((item) => {
    const matchCat = selectedCat === 'All' || item.category === selectedCat;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.titleHindi && item.titleHindi.toLowerCase().includes(q)) ||
      (item.caption && item.caption.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#943217] text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
                परिषद फोटो गैलरी प्रबंधन (Photo Gallery Manager)
              </h2>
              <p className="text-xs text-slate-500">
                वेबसाइट पर प्रकाशित होने वाली तस्वीरों को अपलोड, संपादित व हटाएँ (Upload, Edit &amp; Delete Photos)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ नई फोटो जोड़ें (Upload New Photo)</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="फोटो खोजें (Search title)..."
              className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#943217]"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 p-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
          >
            <option value="All">सभी वर्ग (All Categories)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 font-medium self-end sm:self-center">
          कुल तस्वीरें: <strong className="text-slate-900">{gallery.length}</strong> (फ़िल्टर में: {filteredGallery.length})
        </div>
      </div>

      {/* Gallery Cards Table/Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">कोई फोटो नहीं मिली (No Photos Found)</h4>
          <p className="text-xs text-slate-500">
            गैलरी खाली है या फ़िल्टर में कोई परिणाम नहीं है। "+ नई फोटो जोड़ें" बटन दबाकर नई तस्वीर जोड़ें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>

                {item.featured && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>प्रमुख</span>
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-1 line-clamp-1">
                    {item.titleHindi || item.title}
                  </h4>

                  {item.titleHindi && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.title}
                    </p>
                  )}

                  {item.caption && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    title="Preview Image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>देखें</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors text-[11px] flex items-center gap-1 font-semibold"
                      title="Edit details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>संपादित</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`क्या आप इस तस्वीर को हटाना चाहते हैं?\n"${item.titleHindi || item.title}"`)) {
                          onDeleteGalleryItem(item.id);
                        }
                      }}
                      className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-[11px] flex items-center gap-1 font-semibold"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएँ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#943217] text-white flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase">
                  {editingItem ? 'फोटो विवरण संपादित करें (Edit Photo)' : 'नई फोटो अपलोड करें (Upload Photo)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Photo Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Academic Award Ceremony 2025"
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#943217]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    शीर्षक (हिन्दी - Optional)
                  </label>
                  <input
                    type="text"
                    value={titleHindi}
                    onChange={(e) => setTitleHindi(e.target.value)}
                    placeholder="उदा. वार्षिक शैक्षणिक पुरस्कार वितरण समारोह"
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#943217]"
                  />
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category (श्रेणी) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Date of Event (दिनांक) *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Image Source Options: Local File or URL */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  तस्वीर स्रोत (Image Source) - फ़ाइल चुनें या वेब लिंक दर्ज करें
                </span>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-lg border border-slate-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#943217]" />
                    <span>डिवाइस से फोटो चुनें (Upload from Device)</span>
                  </button>

                  <span className="text-slate-400 self-center text-[11px] font-bold sm:px-1">
                    या (OR)
                  </span>

                  <input
                    type="url"
                    placeholder="Paste Image URL (https://...)"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setUploadFeedback('');
                    }}
                    className="flex-1 bg-white p-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                {uploadFeedback && (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadFeedback}</span>
                  </div>
                )}

                {/* Quick Sample Image Presets */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
                    नमूना तस्वीरें (Quick Presets):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setUploadFeedback(`Selected preset: ${preset.label}`);
                        }}
                        className="bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 text-[10px] font-medium px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview Box */}
                {imageUrl && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-bold block">
                      तस्वीर पूर्वावलोकन (Preview):
                    </span>
                    <div className="h-32 rounded-lg overflow-hidden border border-slate-300 bg-slate-950 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={() => setErrorMsg('Failed to load image preview. Please verify URL or file.')}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  विवरण / Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="कार्यक्रम अथवा विद्यार्थियों से संबंधित विवरण दर्ज करें..."
                  className="w-full bg-slate-50 p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-[#943217] w-4 h-4"
                  />
                  <span className="font-bold text-slate-900 text-xs">
                    गैलरी में मुख्य तस्वीर के रूप में दर्शाएँ (Mark as Featured Photo)
                  </span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  {editingItem ? 'अपडेट करें (Save Changes)' : 'तस्वीर प्रकाशित करें (Publish to Gallery)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW LIGHTBOX */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800">
              <span className="font-bold text-xs text-amber-300">
                {previewItem.titleHindi || previewItem.title}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] bg-black flex items-center justify-center p-2">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[58vh] max-w-full object-contain"
              />
            </div>
            <div className="p-4 text-xs bg-slate-950 space-y-1">
              <p className="text-slate-300">{previewItem.caption || previewItem.title}</p>
              <div className="text-slate-500 text-[11px] flex items-center gap-3 pt-1">
                <span>Category: {previewItem.category}</span>
                <span>Date: {previewItem.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
