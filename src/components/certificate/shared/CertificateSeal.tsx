import React from "react";

interface CertificateSealProps {
  size?: number;
  className?: string;
  showRibbons?: boolean;
}

/**
 * Ornate Metallic Gold Foil Serrated Seal with Hanging Green Ribbons
 * Accurately reproduces the official local government embossed seal.
 */
export function CertificateSeal({
  size = 140,
  className = "",
  showRibbons = true,
}: CertificateSealProps) {
  const points = 36;
  const outerRadius = 58;
  const innerRadius = 52;
  const center = 65;

  // Generate 36-point starburst serrated edge path
  let starPath = "";
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    starPath += (i === 0 ? "M " : "L ") + x + " " + y + " ";
  }
  starPath += "Z";

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size * (showRibbons ? 1.3 : 1)}
        viewBox="0 0 130 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#AA771C" />
            <stop offset="75%" stopColor="#F6E27A" />
            <stop offset="100%" stopColor="#9B6B17" />
          </linearGradient>

          <radialGradient id="sealCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="60%" stopColor="#DFBA48" />
            <stop offset="90%" stopColor="#A4741E" />
            <stop offset="100%" stopColor="#69480C" />
          </radialGradient>

          <linearGradient id="ribbonGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#0B341B" />
          </linearGradient>

          <linearGradient id="ribbonGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="50%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#0B341B" />
          </linearGradient>

          <filter id="sealShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3F2904" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Hanging Emerald Green Ribbons */}
        {showRibbons && (
          <g id="hanging-ribbons">
            {/* Left Ribbon */}
            <path
              d="M 44 95 L 30 148 L 44 140 L 58 148 L 54 95 Z"
              fill="url(#ribbonGradLeft)"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />
            <path d="M 44 95 L 44 140" stroke="#CA8A04" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

            {/* Right Ribbon */}
            <path
              d="M 76 95 L 72 148 L 86 140 L 100 148 L 86 95 Z"
              fill="url(#ribbonGradRight)"
              stroke="#D4AF37"
              strokeWidth="1.2"
            />
            <path d="M 86 95 L 86 140" stroke="#CA8A04" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          </g>
        )}

        {/* 36-Point Serrated Starburst Gold Body */}
        <g filter="url(#sealShadow)">
          <path d={starPath} fill="url(#goldSheen)" stroke="#85530B" strokeWidth="1" />
        </g>

        {/* Concentric Embossed Rings */}
        <circle cx={center} cy={center} r="48" fill="url(#sealCenterGlow)" stroke="#FFF3B0" strokeWidth="1.5" />
        <circle cx={center} cy={center} r="44" fill="none" stroke="#784C07" strokeWidth="1" strokeDasharray="2 1.5" />
        <circle cx={center} cy={center} r="34" fill="#FDF7DF" stroke="#85530B" strokeWidth="1.5" />

        {/* Arc Text: ODEDA LOCAL GOVERNMENT */}
        <path id="sealArcTop" d="M 28 65 A 37 37 0 0 1 102 65" fill="none" />
        <text fill="#4A2F03" fontSize="6.5" fontWeight="900" letterSpacing="1.2">
          <textPath href="#sealArcTop" startOffset="50%" textAnchor="middle">
            ODEDA LOCAL GOVT
          </textPath>
        </text>

        {/* Arc Text: OGUN STATE NIGERIA */}
        <path id="sealArcBottom" d="M 102 65 A 37 37 0 0 1 28 65" fill="none" />
        <text fill="#4A2F03" fontSize="6.5" fontWeight="900" letterSpacing="1.2">
          <textPath href="#sealArcBottom" startOffset="50%" textAnchor="middle">
            ★ OGUN STATE ★
          </textPath>
        </text>

        {/* Center Shield & Eagle / Official Star Emblem */}
        <g transform={`translate(${center - 18}, ${center - 18})`}>
          <path
            d="M 6 6 L 30 6 L 30 20 C 30 28, 18 34, 18 34 C 18 34, 6 28, 6 20 Z"
            fill="#0D3B1E"
            stroke="#9B6B17"
            strokeWidth="1.2"
          />
          {/* Silver Y on shield */}
          <path
            d="M 6 6 L 15 15 L 15 32 L 21 32 L 21 15 L 30 6 L 26 6 L 18 13 L 10 6 Z"
            fill="#F6E27A"
          />
          {/* Star above shield */}
          <polygon
            points="18,0 20,4 24,4 21,7 22,11 18,8 14,11 15,7 12,4 16,4"
            fill="#991B1B"
          />
        </g>
      </svg>
    </div>
  );
}
