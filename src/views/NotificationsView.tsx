import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  Download, 
  FileText, 
  Megaphone, 
  Tag, 
  CheckCircle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { BoardNotification } from '../types';

interface NotificationsViewProps {
  notifications: BoardNotification[];
  selectedNotification: BoardNotification | null;
  onSelectNotification: (notif: BoardNotification | null) => void;
  setCurrentTab: (tab: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  selectedNotification,
  onSelectNotification,
  setCurrentTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notifications.filter((n) => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Press & Public Notice Board</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase font-serif-title">
              Notifications, Circulars & Examination Orders
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Central notification desk for examination schedules, candidate instructions, syllabus blueprints, and board orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
              Total Circulars: {notifications.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Examination', 'Admission', 'Recruitment', 'Results', 'General Notice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-xs"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: List of circulars */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">कोई अधिसूचना उपलब्ध नहीं है (No Notifications Available)</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                वर्तमान में कोई सार्वजनिक सूचना अथवा सर्कुलर प्रकाशित नहीं है। नवीन सूचनाएं बोर्ड द्वारा जारी किए जाने पर यहाँ प्रदर्शित होंगी।
              </p>
            </div>
          ) : (
            filtered.map((notif) => {
              const isSelected = selectedNotification?.id === notif.id;
              return (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification(notif)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {notif.category}
                      </span>
                      {notif.isNew && (
                        <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-xs animate-pulse">
                          NEW
                        </span>
                      )}
                      {notif.isMarquee && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          FLASH TICKER
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{notif.date}</span>
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {notif.title}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-blue-700 font-semibold flex items-center gap-1">
                      <span>View Circular Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Circular Full Preview Document */}
        <div className="lg:col-span-5">
          {selectedNotification ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 sticky top-24">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded">
                  {selectedNotification.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedNotification.date}
                </span>
              </div>

              <div className="text-center py-2 border-b border-slate-100">
                <div className="text-[10px] text-amber-800 font-hindi font-semibold">
                  दिल्ली माध्यमिक शिक्षा एवं ग्रामीण विकास परिषद
                </div>
                <h4 className="text-xs font-black text-blue-950 uppercase font-serif-title mt-0.5">
                  BOARD OF SECONDARY EDUCATION & RURAL DEVELOPMENT COUNCIL
                </h4>
                <div className="text-[9px] text-slate-500">
                  Notification Order Ref: BSEDRC/CIR/{selectedNotification.id.toUpperCase()}
                </div>
              </div>

              <h2 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedNotification.title}
              </h2>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3">
                <p>{selectedNotification.description}</p>
                <p>
                  All concerned center superintendents, affiliated schools, students, and stakeholders are advised to note the official directives above for strict compliance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Order</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Official PDF Circular downloaded: BSEDRC_${selectedNotification.category}_Order_${selectedNotification.date}.pdf`);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              Select any circular from the left to view complete text and download official order.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
