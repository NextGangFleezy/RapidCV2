import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - recreating the RapidCV document/arrow design */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Document background with rounded corners */}
          <rect
            x="2"
            y="2"
            width="20"
            height="28"
            rx="3"
            ry="3"
            fill="url(#logoGradient1)"
            stroke="url(#logoGradient2)"
            strokeWidth="1.5"
          />
          
          {/* Profile icon circle */}
          <circle
            cx="8"
            cy="8"
            r="2.5"
            fill="#1478FF"
          />
          
          {/* Horizontal lines representing text */}
          <rect x="13" y="7" width="6" height="1.5" rx="0.75" fill="#1478FF" />
          <rect x="6" y="13" width="10" height="1" rx="0.5" fill="#C44AFF" />
          <rect x="6" y="15.5" width="8" height="1" rx="0.5" fill="#C44AFF" />
          <rect x="6" y="18" width="12" height="1" rx="0.5" fill="#00D4FF" />
          <rect x="6" y="20.5" width="9" height="1" rx="0.5" fill="#00D4FF" />
          
          {/* Upward trending arrow */}
          <path
            d="M18 24 L26 16 L30 20 L22 28 L18 24 Z"
            fill="url(#arrowGradient)"
            stroke="none"
          />
          <path
            d="M24 14 L28 14 L28 18"
            stroke="url(#arrowGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F8FF" />
              <stop offset="100%" stopColor="#E6F3FF" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1478FF" />
              <stop offset="50%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#C44AFF" />
            </linearGradient>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C44AFF" />
              <stop offset="100%" stopColor="#FF6B9D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-gradient leading-none`}>
            RapidCV
          </span>
          {size === 'lg' && (
            <span className="text-sm text-muted-foreground font-medium">
              Built for the Job You Want
            </span>
          )}
        </div>
      )}
    </div>
  );
}