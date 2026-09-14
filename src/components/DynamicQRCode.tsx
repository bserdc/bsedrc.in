import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, Copy, Check, QrCode } from 'lucide-react';

interface DynamicQRCodeProps {
  value: string;
  size?: number;
  label?: string;
  subLabel?: string;
  showLink?: boolean;
  className?: string;
}

export const DynamicQRCode: React.FC<DynamicQRCodeProps> = ({
  value,
  size = 128,
  label,
  subLabel,
  showLink = false,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (value) {
      QRCode.toDataURL(
        value,
        {
          width: size * 2, // higher resolution for crisp printing
          margin: 1,
          color: {
            dark: '#142d2a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        (err, url) => {
          if (!err && isMounted && url) {
            setDataUrl(url);
          }
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [value, size]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className="bg-white p-1.5 rounded-lg border-2 border-slate-800 shadow-sm relative group"
        style={{ width: size + 12, height: size + 12 }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Official Council Scannable QR Code"
            width={size}
            height={size}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <QrCode className="w-8 h-8 animate-pulse" />
          </div>
        )}

        {/* Quick test overlay button on hover */}
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          title="Open verification link in new tab"
          className="absolute inset-0 bg-[#142d2a]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-lg text-[10px] font-bold gap-1 p-1 text-center"
        >
          <ExternalLink className="w-4 h-4 text-amber-300" />
          <span>Test Scan</span>
        </a>
      </div>

      {label && (
        <span className="text-[10px] font-bold text-slate-800 mt-1 uppercase text-center tracking-tight">
          {label}
        </span>
      )}

      {subLabel && (
        <span className="text-[8px] text-slate-500 font-mono text-center">
          {subLabel}
        </span>
      )}

      {showLink && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600 max-w-xs">
          <span className="truncate font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {value}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[#943217] hover:text-[#7a2812] shrink-0 cursor-pointer p-0.5"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
