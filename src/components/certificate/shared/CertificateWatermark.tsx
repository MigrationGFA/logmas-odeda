import React from "react";
import { NigerianCoatOfArms } from "./CertificateEmblems";

export function CertificateWatermark({
  showSkyline = false,
  className = "",
}: {
  showSkyline?: boolean;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Central faded Coat of Arms Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.045] scale-150">
        <NigerianCoatOfArms className="w-96 h-96" />
      </div>

      {/* Subtle background security grid / rosette mesh */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(#15803d 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Optional bottom municipal building skyline for Portrait Origin Certificate */}
      {showSkyline && (
        <div className="absolute bottom-10 left-0 right-0 h-28 opacity-[0.06] flex items-end justify-center">
          <svg viewBox="0 0 1000 120" className="w-full h-full" fill="#14532D">
            {/* Municipal Secretariat building silhouette */}
            <path d="M 0 120 L 50 120 L 50 80 L 120 80 L 120 120 L 160 120 L 160 60 L 220 60 L 220 120 L 280 120 L 280 40 L 320 20 L 360 40 L 360 120 L 420 120 L 420 70 L 480 70 L 480 120 L 520 120 L 520 30 L 560 10 L 600 30 L 600 120 L 660 120 L 660 65 L 720 65 L 720 120 L 780 120 L 780 85 L 850 85 L 850 120 L 920 120 L 920 50 L 970 50 L 970 120 L 1000 120 Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
