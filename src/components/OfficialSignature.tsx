import React from 'react';

interface OfficialSignatureProps {
  className?: string;
  showTitle?: boolean;
  title?: string;
  officerName?: string;
  designation?: string;
  councilSubtitle?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const OfficialSignature: React.FC<OfficialSignatureProps> = ({
  className = '',
  showTitle = true,
  officerName = 'Bibhishan Kumar',
  designation = 'Chief Executive Officer',
  councilSubtitle = 'BRSV & RCT Autonomous Council, Madhepura',
  align = 'center',
  size = 'md'
}) => {
  const alignClass = align === 'left' ? 'text-left items-start' : align === 'right' ? 'text-right items-end' : 'text-center items-center';
  const dividerAlign = align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto';

  const imgHeight = size === 'sm' ? 'h-9' : size === 'lg' ? 'h-14' : 'h-11';

  return (
    <div className={`inline-flex flex-col ${alignClass} ${className}`}>
      {/* Signature Image with Multiply Blend for seamless transparent background */}
      <div className="relative flex items-center justify-center overflow-hidden mb-0.5">
        <img
          src="/assets/images/bibhishan_signature.jpg"
          alt="Signature of Bibhishan Kumar"
          className={`${imgHeight} max-w-[140px] object-contain mix-blend-multiply filter contrast-125`}
          onError={(e) => {
            // Fallback to signature.png or stylized SVG if image load fails
            (e.target as HTMLImageElement).src = '/signature.png';
          }}
        />
      </div>

      {showTitle && (
        <>
          <div className={`w-28 h-0.5 bg-blue-900 ${dividerAlign} mb-1 opacity-80`} />
          <div className="font-serif italic font-bold text-blue-950 text-xs tracking-wide">
            {officerName}
          </div>
          <span className="text-[10px] font-bold text-slate-800 uppercase block tracking-wider">
            {designation}
          </span>
          {councilSubtitle && (
            <span className="text-[8px] text-slate-500 block">
              {councilSubtitle}
            </span>
          )}
        </>
      )}
    </div>
  );
};
