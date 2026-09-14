import React, { useState } from 'react';

interface BiharCouncilLogoProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'white' | 'dark';
}

export const BiharCouncilLogo: React.FC<BiharCouncilLogoProps> = ({
  className = '',
  size = 56,
  variant = 'color'
}) => {
  const [imgError, setImgError] = useState(false);
  const isWhite = variant === 'white';
  const primaryColor = isWhite ? '#ffffff' : '#142d2a'; // Deep official navy/forest
  const secondaryColor = isWhite ? '#fef08a' : '#c2410c'; // Amber / dark orange
  const bgColor = isWhite ? 'transparent' : '#ffffff';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 select-none overflow-hidden ${
        isWhite ? 'ring-2 ring-white/30' : 'shadow-xs border border-amber-900/10'
      } ${className}`}
      style={{ width: size, height: size }}
      title="बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (BRSV & RCT / BSEDRC, Madhepura, Bihar)"
    >
      {!imgError ? (
        <img
          src="/assets/images/council_official_logo.jpg"
          alt="बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद (BRSV & RCT)"
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgError(true)}
          loading="eager"
        />
      ) : (
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background circle */}
          <circle cx="100" cy="100" r="96" fill={bgColor} stroke={primaryColor} strokeWidth="4" />
          <circle cx="100" cy="100" r="91" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="100" cy="100" r="86" fill="none" stroke={primaryColor} strokeWidth="2" />

          {/* Circular text paths */}
          <defs>
            <path
              id="topTextCurve"
              d="M 28,100 A 72,72 0 1,1 172,100"
              fill="none"
            />
            <path
              id="bottomTextCurve"
              d="M 172,104 A 72,72 0 0,1 28,104"
              fill="none"
            />
          </defs>

          {/* Hindi curved text on top */}
          <text fill={primaryColor} fontSize="11.5" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#topTextCurve" startOffset="50%" textAnchor="middle">
              बिहार राज्य शैक्षणिक विकास एवं अनुसंधान परिषद
            </textPath>
          </text>

          {/* Bottom text curve */}
          <text fill={primaryColor} fontSize="11" fontWeight="bold" letterSpacing="1.2">
            <textPath href="#bottomTextCurve" startOffset="50%" textAnchor="middle">
              ★ मधेपुरा ( बिहार ) ★
            </textPath>
          </text>

          {/* Inner center badge */}
          <circle cx="100" cy="100" r="54" fill={isWhite ? 'rgba(255,255,255,0.08)' : '#fbf6ee'} stroke={secondaryColor} strokeWidth="1.5" />

          {/* Center Torch / Diya of Knowledge */}
          <g transform="translate(100, 72) scale(0.9)">
            <path
              d="M 0,-18 C -5,-10 -9,-3 0,8 C 9,-3 5,-10 0,-18 Z"
              fill="#ea580c"
            />
            <path
              d="M 0,-12 C -2,-7 -4,-2 0,5 C 4,-2 2,-7 0,-12 Z"
              fill="#facc15"
            />
            <path
              d="M -7,8 L 7,8 L 4,16 L -4,16 Z"
              fill={primaryColor}
            />
            <line x1="-10" y1="8" x2="10" y2="8" stroke={primaryColor} strokeWidth="1.5" />
          </g>

          {/* Open Book in center */}
          <g transform="translate(100, 98) scale(0.85)">
            <path
              d="M 0,4 C -12,0 -26,-2 -34,-6 L -34,14 C -26,18 -12,20 0,22 Z"
              fill={isWhite ? '#ffffff' : '#ffffff'}
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <path
              d="M 0,4 C 12,0 26,-2 34,-6 L 34,14 C 26,18 12,20 0,22 Z"
              fill={isWhite ? '#ffffff' : '#ffffff'}
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <line x1="0" y1="4" x2="0" y2="23" stroke={primaryColor} strokeWidth="2" />
          </g>

          {/* 3 Indian School Children studying illustration silhouette */}
          <g transform="translate(100, 114) scale(0.65)" fill={primaryColor}>
            <circle cx="-28" cy="-5" r="5" />
            <path d="M -36,8 C -36,2 -20,2 -20,8 L -20,16 L -36,16 Z" />
            <circle cx="0" cy="-9" r="6" />
            <path d="M -10,6 C -10,0 10,0 10,6 L 9,18 L -9,18 Z" />
            <circle cx="28" cy="-5" r="5" />
            <path d="M 20,8 C 20,2 36,2 36,8 L 36,16 L 20,16 Z" />
          </g>

          {/* BRSV & RCT Center Banner */}
          <rect
            x="44"
            y="132"
            width="112"
            height="16"
            rx="3"
            fill={primaryColor}
          />
          <text
            x="100"
            y="144"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="900"
            letterSpacing="1.2"
          >
            BRSV &amp; RCT
          </text>
        </svg>
      )}
    </div>
  );
};
