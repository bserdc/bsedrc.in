import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';
import { BoardNotification } from '../types';

interface MarqueeTickerProps {
  notifications: BoardNotification[];
  onSelectNotification: (notif: BoardNotification) => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  notifications,
  onSelectNotification,
}) => {
  const marqueeItems = notifications.filter((n) => n.isMarquee);

  if (marqueeItems.length === 0) {
    return (
      <div className="bg-amber-50/80 border-b border-amber-200/80 py-1.5 px-4 overflow-hidden flex items-center shadow-xs">
        <div className="flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs shrink-0 shadow-xs uppercase tracking-wider">
          <Megaphone className="w-3.5 h-3.5 text-slate-900" />
          <span>OFFICIAL NOTICE / सूचना</span>
        </div>
        <div className="relative w-full overflow-hidden ml-4">
          <div className="text-xs font-medium text-slate-600 truncate">
            बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (BRSV &amp; RCT) — आधिकारिक पोर्टल पर वर्तमान में कोई नई सार्वजनिक अधिसूचना सक्रिय नहीं है।
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-4 overflow-hidden flex items-center shadow-xs">
      <div className="flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs shrink-0 shadow-xs uppercase tracking-wider">
        <Megaphone className="w-3.5 h-3.5 animate-bounce text-slate-900" />
        <span>LATEST ALERTS / ताजा सूचना</span>
      </div>

      <div className="relative w-full overflow-hidden ml-4">
        <div className="flex items-center space-x-12 whitespace-nowrap animate-marquee">
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectNotification(item)}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 hover:text-blue-700 cursor-pointer transition-colors"
            >
              {item.isNew && (
                <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs animate-pulse tracking-wide">
                  NEW
                </span>
              )}
              <span>{item.title}</span>
              <ArrowRight className="w-3 h-3 text-amber-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
