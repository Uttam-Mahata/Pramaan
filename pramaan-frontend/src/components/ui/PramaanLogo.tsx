import React from 'react';
import { cn } from '@/lib/utils';

export interface PramaanLogoProps {
  variant?: 'icon' | 'horizontal' | 'vertical';
  theme?: 'light' | 'dark';
  className?: string;
  animate?: boolean;
}

export const PramaanLogo: React.FC<Readonly<PramaanLogoProps>> = ({ 
  variant = 'horizontal', 
  theme = 'light', 
  className = '',
  animate = true
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const taglineColor = isDark ? '#94A3B8' : '#64748B';

  const viewBoxes = {
    icon: "0 0 120 120",
    horizontal: "0 0 420 120",
    vertical: "0 0 200 240"
  };

  const IconGraphic = () => (
    <g>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        
        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <filter id="checkShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#10B981" floodOpacity="0.45" />
        </filter>
      </defs>

      {animate && (
        <style>
          {`
            .pramaan-draw {
              stroke-dasharray: 150;
              stroke-dashoffset: 150;
              animation: pramaanDash 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              animation-delay: 0.2s;
            }
            @keyframes pramaanDash {
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      )}

      <rect 
        x="10" y="10" width="80" height="80" rx="22" 
        fill="url(#bgGrad)" 
        transform="rotate(10 50 50)" 
      />
      
      <rect 
        x="10" y="10" width="80" height="80" rx="22" 
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" 
        transform="rotate(10 50 50)" 
      />

      <g stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
        <line x1="25" y1="35" x2="50" y2="20" />
        <line x1="50" y1="20" x2="80" y2="45" />
        <line x1="80" y1="45" x2="60" y2="80" />
        <line x1="60" y1="80" x2="25" y2="35" />
        <line x1="25" y1="35" x2="80" y2="45" strokeDasharray="2 3" opacity="0.5" />
      </g>
      <circle cx="25" cy="35" r="2.5" fill="#60A5FA" />
      <circle cx="50" cy="20" r="2.5" fill="#60A5FA" />
      <circle cx="80" cy="45" r="2.5" fill="#60A5FA" />
      <circle cx="60" cy="80" r="2.5" fill="#60A5FA" />

      <path 
        d="M 34 35 H 62 M 40 35 V 50 Q 40 58 46 58 H 56 M 56 35 V 72" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      <path 
        d="M 32 62 L 58 86 L 105 32" 
        fill="none" 
        stroke="url(#checkGrad)" 
        strokeWidth="9" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#checkShadow)"
        className={animate ? 'pramaan-draw' : ''}
      />
    </g>
  );

  return (
    <svg 
      viewBox={viewBoxes[variant]} 
      className={cn("block", className)} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === 'icon' && (
        <g transform="translate(10, 10)">
          <IconGraphic />
        </g>
      )}

      {variant === 'horizontal' && (
        <g>
          <g transform="translate(10, 10)">
            <IconGraphic />
          </g>
          <text 
            x="130" y="66" 
            fontFamily="Montserrat, system-ui, sans-serif" 
            fontWeight="800" 
            fontSize="52" 
            fill={textColor} 
            letterSpacing="-1.5"
          >
            Pramaan
          </text>
          <text 
            x="135" y="90" 
            fontFamily="Manrope, system-ui, sans-serif" 
            fontWeight="700" 
            fontSize="14" 
            fill={taglineColor} 
            letterSpacing="4"
          >
            UNDERWRITING COPILOT
          </text>
        </g>
      )}

      {variant === 'vertical' && (
        <g>
          <g transform="translate(40, 10)">
            <IconGraphic />
          </g>
          <text 
            x="100" y="180" 
            textAnchor="middle"
            fontFamily="Montserrat, system-ui, sans-serif" 
            fontWeight="800" 
            fontSize="42" 
            fill={textColor} 
            letterSpacing="-1"
          >
            Pramaan
          </text>
          <text 
            x="100" y="210" 
            textAnchor="middle"
            fontFamily="Manrope, system-ui, sans-serif" 
            fontWeight="700" 
            fontSize="12" 
            fill={taglineColor} 
            letterSpacing="3"
          >
            UNDERWRITING COPILOT
          </text>
        </g>
      )}
    </svg>
  );
};
