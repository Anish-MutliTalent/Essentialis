import React from 'react';

// --- Helper: Professional Loading Spinner ---
type LoadingSpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'gold' | 'white';
  // when provided, shows determinate progress (0-100). if omitted, spinner is indeterminate.
  progress?: number | null;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = '', 
  size = 'md',
  color = 'default',
  progress = null,
}) => {
  const sizeClasses = {
    sm: { dim: 12, class: 'h-3 w-3' },
    md: { dim: 16, class: 'h-4 w-4' },
    lg: { dim: 48, class: 'h-12 w-12' }
  };

  const colorClasses = {
    default: 'text-yellow-400',
    gold: 'text-yellow-400',
    white: 'text-white'
  };

  const { dim, class: sizeClass } = sizeClasses[size];

  // Determinate circular progress using SVG stroke-dashoffset
  if (typeof progress === 'number') {
    const pct = Math.max(0, Math.min(100, progress));
    const radius = 10; // matches viewBox units
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct / 100);

    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox="0 0 24 24" className={`${colorClasses[color]}`}>
          <circle cx="12" cy="12" r={radius} strokeWidth={2.8} stroke="currentColor" className="opacity-15 text-gray-700" fill="none" />
          <circle
            cx="12"
            cy="12"
            r={radius}
            strokeWidth={2.8}
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform="rotate(-90 12 12)"
            className="transition-all duration-300"
          />
        </svg>
        <span className="sr-only">Loading {pct}%</span>
        <div className="absolute text-xs -mt-0.5 -ml-0.5 text-white/90 pointer-events-none" style={{ fontSize: Math.max(10, Math.round(dim / 4)) }}>
          {Math.round(pct)}%
        </div>
      </div>
    );
  }

  // Indeterminate fallback (original spinner)
  return (
    <svg
      className={`animate-spin ${sizeClass} ${colorClasses[color]} inline ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default LoadingSpinner;