import React from 'react';

export default function FreelanceMateLogo({
  size = 'md',
  showText = true,
  className = ''
}) {
  // Dimension presets
  const dimensions = {
    sm: { icon: 26, text: '1.05rem', badge: '0.62rem' },
    md: { icon: 34, text: '1.28rem', badge: '0.72rem' },
    lg: { icon: 42, text: '1.55rem', badge: '0.8rem' },
    xl: { icon: 54, text: '2rem', badge: '0.95rem' }
  }[size] || { icon: 34, text: '1.28rem', badge: '0.72rem' };

  return (
    <div className={`fm-brand-logo-root ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      {/* High-End Futuristic Vector Logo Icon */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fm-logo-svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.55))' }}
      >
        <defs>
          <linearGradient id="fmGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="fmGradAccent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="fmGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>
          <filter id="fmLumGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Hexagon Backdrop */}
        <polygon
          points="32,4 58,18 58,46 32,60 6,46 6,18"
          fill="url(#fmGradBack)"
          stroke="url(#fmGradMain)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Dynamic Stylized 'F' Ribbon Wing */}
        <path
          d="M20 46 V18 H44 C47 18 48 20 46 22 L42 26 H28 V32 H38 C41 32 42 34 40 36 L36 40 H28 V46 Z"
          fill="url(#fmGradMain)"
        />

        {/* Intersecting AI Neural Sparkle / Diamond Star */}
        <path
          d="M44 14 L46 21 L53 23 L46 25 L44 32 L42 25 L35 23 L42 21 Z"
          fill="#ffffff"
          filter="url(#fmLumGlow)"
        />
        <circle cx="44" cy="23" r="2.2" fill="#38bdf8" />

        {/* Diagonal Tech Matrix Grid Accent */}
        <line x1="16" y1="36" x2="22" y2="42" stroke="url(#fmGradAccent)" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="46" x2="48" y2="40" stroke="url(#fmGradAccent)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="50" r="2" fill="#a855f7" />
      </svg>

      {/* Typography Brand Name */}
      {showText && (
        <div className="fm-logo-text-wrap" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span
            className="fm-logo-title"
            style={{
              fontSize: dimensions.text,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              fontFamily: 'inherit',
              lineHeight: 1
            }}
          >
            FreelanceMate
          </span>
          <span
            className="fm-logo-badge"
            style={{
              marginLeft: '0.45rem',
              fontSize: dimensions.badge,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              color: '#ffffff',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              letterSpacing: '0.06em',
              lineHeight: 1,
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.55)',
              display: 'inline-block'
            }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
