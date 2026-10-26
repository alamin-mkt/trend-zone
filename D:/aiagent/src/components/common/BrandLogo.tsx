import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
  size = 'md',
}) => {
  const isDarkBg = variant === 'light'; // Light text for dark backgrounds (e.g. Footer, Admin sidebar)

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group transition-transform hover:scale-[1.01] ${className}`}
    >
      {/* Trend Zone TZ Icon */}
      <div className="flex-shrink-0">
        <svg
          viewBox="0 0 110 80"
          className={size === 'sm' ? 'w-9 h-7' : size === 'lg' ? 'w-16 h-12' : 'w-12 h-9'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* T in Navy (or White on dark bg) with Arrow Cutout */}
          <path
            d="M5 6 H64 V21 H45 V74 H24 V21 H5 Z"
            fill={isDarkBg ? '#FFFFFF' : '#0E1B2E'}
          />
          {/* Arrow pointing up-right */}
          <path
            d="M24 74 L46 41 L53 46 L35 74 Z"
            fill={isDarkBg ? '#FFFFFF' : '#0E1B2E'}
          />
          <polygon
            points="40,34 66,41 49,54"
            fill={isDarkBg ? '#FFFFFF' : '#0E1B2E'}
          />

          {/* Z in Trend Zone Vibrant Orange (white on light/dark-bg variant) */}
          <path
            d="M58 6 H105 V21 L77 59 H105 V74 H52 V59 L80 21 H58 Z"
            fill={isDarkBg ? '#FFFFFF' : '#FF5722'}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none font-extrabold font-sans">
          <span
            className={`text-xl sm:text-2xl tracking-wider ${
              isDarkBg ? 'text-white' : 'text-[#0E1B2E]'
            }`}
          >
            TREND
          </span>
          <span className={`text-xl sm:text-2xl tracking-wider ml-1.5 ${isDarkBg ? 'text-white' : 'text-[#FF5722]'}`}>
            ZONE
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
              isDarkBg ? 'text-white/80' : 'text-gray-500'
            }`}
          >
            Trendy Products • Better Life
          </span>
        )}
      </div>
    </Link>
  );
};
