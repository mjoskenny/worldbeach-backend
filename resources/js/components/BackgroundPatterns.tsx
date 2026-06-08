import React from 'react';

// Burundian-inspired SVG patterns
export const BurundiWavePattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="burundi-waves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        {/* Lake Tanganyika wave pattern */}
        <path
          d="M0 100 Q 25 80, 50 100 T 100 100 T 150 100 T 200 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M0 120 Q 25 100, 50 120 T 100 120 T 150 120 T 200 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.2"
        />
        <path
          d="M0 140 Q 25 120, 50 140 T 100 140 T 150 140 T 200 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.15"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#burundi-waves)" />
  </svg>
);

export const BurundiDrumsPattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="burundi-drums" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
        {/* Traditional drum pattern - circular motifs */}
        <circle cx="75" cy="75" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="75" cy="75" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="75" cy="75" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        {/* Small accent circles */}
        <circle cx="15" cy="15" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        <circle cx="135" cy="135" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#burundi-drums)" />
  </svg>
);

export const BurundiBasketPattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="burundi-basket" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        {/* Traditional basket weave pattern */}
        <path
          d="M 0 0 L 100 100 M 0 20 L 80 100 M 20 0 L 100 80 M 0 40 L 60 100 M 40 0 L 100 60 M 0 60 L 40 100 M 60 0 L 100 40 M 0 80 L 20 100 M 80 0 L 100 20"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.12"
        />
        <path
          d="M 100 0 L 0 100 M 100 20 L 20 100 M 80 0 L 0 80 M 100 40 L 40 100 M 60 0 L 0 60 M 100 60 L 60 100 M 40 0 L 0 40 M 100 80 L 80 100 M 20 0 L 0 20"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.12"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#burundi-basket)" />
  </svg>
);

export const BurundiStarsPattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="burundi-stars" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Three stars representing unity, work, and progress */}
        <polygon
          points="60,20 65,35 80,35 68,45 73,60 60,50 47,60 52,45 40,35 55,35"
          fill="currentColor"
          opacity="0.15"
        />
        <polygon
          points="20,80 23,88 32,88 25,93 28,102 20,97 12,102 15,93 8,88 17,88"
          fill="currentColor"
          opacity="0.12"
        />
        <polygon
          points="100,90 103,98 112,98 105,103 108,112 100,107 92,112 95,103 88,98 97,98"
          fill="currentColor"
          opacity="0.12"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#burundi-stars)" />
  </svg>
);

export const SunburstPattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="sunburst" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        {/* Sunburst pattern inspired by Burundian sun */}
        <g opacity="0.12">
          <line x1="100" y1="100" x2="100" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="140" y2="40" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="140" y2="160" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="100" y2="170" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="60" y2="160" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="60" y2="40" stroke="currentColor" strokeWidth="1" />
        </g>
        <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#sunburst)" />
  </svg>
);

export const FloralPattern = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="floral" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
        {/* Tropical floral pattern */}
        <g opacity="0.15">
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(0 90 70)" />
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(60 90 70)" />
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(120 90 70)" />
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(180 90 70)" />
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(240 90 70)" />
          <ellipse cx="90" cy="70" rx="8" ry="15" fill="currentColor" transform="rotate(300 90 70)" />
          <circle cx="90" cy="70" r="4" fill="currentColor" />
        </g>
        <g opacity="0.1">
          <ellipse cx="20" cy="140" rx="5" ry="10" fill="currentColor" transform="rotate(0 20 140)" />
          <ellipse cx="20" cy="140" rx="5" ry="10" fill="currentColor" transform="rotate(60 20 140)" />
          <ellipse cx="20" cy="140" rx="5" ry="10" fill="currentColor" transform="rotate(120 20 140)" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#floral)" />
  </svg>
);

// Component wrappers for easy use
export const WavePatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#00B4D8]">
      <BurundiWavePattern />
    </div>
  </div>
);

export const DrumsPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#0077B6]">
      <BurundiDrumsPattern />
    </div>
  </div>
);

export const BasketPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#00B4D8]">
      <BurundiBasketPattern />
    </div>
  </div>
);

export const StarsPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#F7D9A4]">
      <BurundiStarsPattern />
    </div>
  </div>
);

export const SunburstPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#00B4D8]">
      <SunburstPattern />
    </div>
  </div>
);

export const FloralPatternBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="text-[#0077B6]">
      <FloralPattern />
    </div>
  </div>
);