import React from 'react';

interface GreenGrapeIconProps {
  className?: string;
  size?: number;
}

export const GreenGrapeIcon: React.FC<GreenGrapeIconProps> = ({
  className = 'w-6 h-6',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      style={style}
      aria-label="청포도 아이콘"
      role="img"
    >
      <defs>
        {/* Shine Muscat grape berry gradient */}
        <radialGradient
          id="greenGrapeGrad"
          cx="35%"
          cy="30%"
          r="70%"
          fx="35%"
          fy="30%"
        >
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="45%" stopColor="#84CC16" />
          <stop offset="85%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>

        {/* Back grape berry gradient (slightly darker) */}
        <radialGradient
          id="greenGrapeBackGrad"
          cx="40%"
          cy="35%"
          r="65%"
        >
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="60%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>

        {/* Leaf gradient */}
        <linearGradient id="grapeLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {/* Vine Stem & Tendril */}
      <path
        d="M16 2.5 C16 5.5, 17 7.5, 18.5 9"
        stroke="#78350F"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17.5 4 C19 3, 21 3.5, 21.5 5 C22 6.5, 20.5 7.5, 19.5 7"
        stroke="#65A30D"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Fresh Green Leaf */}
      <path
        d="M18 6.5 C23 4.5, 27.5 7.5, 26 12 C21.5 13, 19 10.5, 18 6.5 Z"
        fill="url(#grapeLeafGrad)"
      />
      <path
        d="M18.5 7 C21.5 9, 24 10.5, 25.5 11.5"
        stroke="#166534"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Back Berries (Depth) */}
      <circle cx="15.5" cy="11.5" r="3.7" fill="url(#greenGrapeBackGrad)" />
      <circle cx="10.8" cy="13.2" r="3.7" fill="url(#greenGrapeBackGrad)" />
      <circle cx="20.2" cy="13.2" r="3.7" fill="url(#greenGrapeBackGrad)" />

      {/* Mid Layer Berries */}
      <circle cx="8" cy="18.5" r="3.8" fill="url(#greenGrapeGrad)" />
      <circle cx="8" cy="17.2" r="1" fill="#FFFFFF" fillOpacity="0.45" />

      <circle cx="15.5" cy="17.8" r="4.2" fill="url(#greenGrapeGrad)" />
      <circle cx="14.8" cy="16.2" r="1.2" fill="#FFFFFF" fillOpacity="0.6" />

      <circle cx="23" cy="18.5" r="3.8" fill="url(#greenGrapeGrad)" />
      <circle cx="22.2" cy="17.2" r="1" fill="#FFFFFF" fillOpacity="0.45" />

      {/* Front / Lower Layer Berries */}
      <circle cx="11.5" cy="23.5" r="3.6" fill="url(#greenGrapeGrad)" />
      <circle cx="10.8" cy="22.2" r="0.9" fill="#FFFFFF" fillOpacity="0.5" />

      <circle cx="19.5" cy="23.5" r="3.6" fill="url(#greenGrapeGrad)" />
      <circle cx="18.8" cy="22.2" r="0.9" fill="#FFFFFF" fillOpacity="0.5" />

      {/* Bottom Tip Berry */}
      <circle cx="15.5" cy="27.8" r="3.2" fill="url(#greenGrapeGrad)" />
      <circle cx="14.9" cy="26.8" r="0.8" fill="#FFFFFF" fillOpacity="0.5" />
    </svg>
  );
};
