import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export default function Logo({ className = "w-8 h-8", size }: LogoProps) {
  const finalStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={finalStyle}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="logo-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="1.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients */}
        <linearGradient id="db-blue-grad" x1="20" y1="25" x2="55" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f3ff" />
          <stop offset="100%" stopColor="#0055ff" />
        </linearGradient>

        <linearGradient id="db-purple-grad" x1="45" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bc13fe" />
          <stop offset="100%" stopColor="#7b00ff" />
        </linearGradient>

        <linearGradient id="db-lightning-grad" x1="30" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#00f3ff" />
          <stop offset="100%" stopColor="#00a2ff" />
        </linearGradient>

        <linearGradient id="db-circle-grad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f3ff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#bc13fe" />
        </linearGradient>
      </defs>

      {/* Outer Circle with Glowing Border */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="url(#db-circle-grad)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        fill="none" 
        opacity="0.85"
        filter="url(#logo-glow)"
      />

      <g filter="url(#logo-glow)">
        {/* Stylized letter 'D' (Left half of the interlocking logo) */}
        <path 
          d="M 23 27 
             L 45 27 
             C 52.5 27, 57 32, 57 41 
             C 57 46, 54 50, 48.5 52 
             L 38 52 
             L 38 61 
             L 23 61 
             Z 
             M 38 38 
             L 38 43 
             L 42 43 
             C 44 43, 46 42, 46 40.5 
             C 46 39, 44 38, 42 38 
             Z" 
          fill="url(#db-blue-grad)" 
          opacity="0.95"
        />

        {/* Stylized letter 'B' (Right half of the interlocking logo, offset slightly and intersecting) */}
        <path 
          d="M 45 39
             L 63 39
             C 68.5 39, 72 41.5, 72 45.5
             C 72 48.5, 70 51, 65.5 52
             C 71 53, 73.5 56, 73.5 60.5
             C 73.5 65.5, 69.5 69, 62.5 69
             L 45 69
             Z
             M 56 46
             L 61 46
             C 62.5 46, 63.5 45.5, 63.5 44.5
             C 63.5 43.5, 62.5 43, 61 43
             L 56 43
             Z
             M 56 61
             L 61.5 61
             C 63 61, 64.5 60.5, 64.5 59
             C 64.5 57.5, 63 57, 61.5 57
             L 56 57
             Z" 
          fill="url(#db-purple-grad)" 
          opacity="0.95"
        />
      </g>

      {/* Central lightning bolt slicing diagonally and glowing intensely */}
      <path 
        d="M 73 18 
           L 44 48 
           L 62 48 
           L 27 82 
           L 54 52 
           L 36 52 
           Z" 
        fill="url(#db-lightning-grad)" 
        stroke="#ffffff"
        strokeWidth="0.5"
        filter="url(#logo-glow-strong)"
      />
    </svg>
  );
}
