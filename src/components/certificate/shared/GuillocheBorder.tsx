import React from "react";

/**
 * Rosette Corner Motif for Guilloche Security Borders
 */
export function RosetteCorner({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rosetteGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="60%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#854D0E" />
        </radialGradient>
      </defs>
      {/* Outer scalloped ring */}
      <circle cx="50" cy="50" r="46" stroke="#166534" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" stroke="#CA8A04" strokeWidth="1" strokeDasharray="3 2" />
      
      {/* 8 Intersecting Petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={50 + 20 * Math.cos((i * Math.PI) / 4)}
          cy={50 + 20 * Math.sin((i * Math.PI) / 4)}
          r="20"
          stroke="#15803D"
          strokeWidth="0.8"
          fill="none"
          opacity="0.7"
        />
      ))}
      
      {/* Center Medallion */}
      <circle cx="50" cy="50" r="14" fill="url(#rosetteGold)" stroke="#166534" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="8" fill="#14532D" />
      <circle cx="50" cy="50" r="3" fill="#FFF2A3" />
    </svg>
  );
}

/**
 * Full-frame Guilloche Security Border (used in Portrait Origin Certificate)
 */
export function GuillocheBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-full h-full p-4 ${className}`}>
      {/* Outer Fine Pinstripe */}
      <div className="absolute inset-2 border-[1.5px] border-[#166534] pointer-events-none" />
      
      {/* Main Intricate Pattern Border */}
      <div className="absolute inset-3.5 border-4 border-[#14532D] pointer-events-none" />
      
      {/* Inner Scalloped / Lathe-work Border */}
      <div className="absolute inset-5 border-[1.5px] border-[#CA8A04] pointer-events-none" />
      <div className="absolute inset-6 border border-[#166534]/50 pointer-events-none" />

      {/* 4 Corner Rosettes */}
      <div className="absolute top-2 left-2 pointer-events-none z-10">
        <RosetteCorner className="w-12 h-12" />
      </div>
      <div className="absolute top-2 right-2 pointer-events-none z-10">
        <RosetteCorner className="w-12 h-12" />
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none z-10">
        <RosetteCorner className="w-12 h-12" />
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none z-10">
        <RosetteCorner className="w-12 h-12" />
      </div>

      {/* Border Corner Ornamental Wings */}
      <div className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}

/**
 * Geometric Corner Wing / Ribbon Accents (used in Landscape Club Certificate)
 */
export function GeometricCornerRibbon({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const transform =
    position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
      ? "scaleY(-1)"
      : position === "bottom-right"
      ? "scale(-1)"
      : "none";

  return (
    <svg
      viewBox="0 0 160 160"
      className="w-24 h-24 sm:w-28 sm:h-28 pointer-events-none select-none"
      style={{ transform }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Triangle Wing 1 (Deep Forest Green) */}
      <polygon points="0,0 160,0 0,160" fill="#0D3B1E" opacity="0.95" />
      
      {/* Strip 2 (Gold Metallic) */}
      <polygon points="0,0 140,0 0,140" fill="#CA8A04" />
      
      {/* Strip 3 (Mid Green) */}
      <polygon points="0,0 120,0 0,120" fill="#15803D" />
      
      {/* Strip 4 (Light Gold Accent) */}
      <polygon points="0,0 100,0 0,100" fill="#FACC15" />
      
      {/* Strip 5 (Deep Pine Green) */}
      <polygon points="0,0 80,0 0,80" fill="#0F4224" />

      {/* Decorative Diagonal Pinstripes */}
      <line x1="0" y1="150" x2="150" y2="0" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
      <line x1="0" y1="130" x2="130" y2="0" stroke="#FFF" strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="70" x2="70" y2="0" stroke="#FFF" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
