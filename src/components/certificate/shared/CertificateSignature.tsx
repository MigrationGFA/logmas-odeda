import React from "react";

interface CertificateSignatureProps {
  signerName?: string;
  signerTitle?: string;
  organization?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

/**
 * Realistic vector handwritten signature & official title block
 */
export function CertificateSignature({
  signerName = "Hon. Akinyemi A. Odunayo",
  signerTitle = "Executive Chairman",
  organization = "Odeda Local Government",
  className = "",
  align = "left",
}: CertificateSignatureProps) {
  const alignmentClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignmentClass} ${className}`}>
      {/* Cursive vector handwritten signature stroke */}
      <div className="h-14 w-48 relative flex items-center justify-center -mb-2">
        <svg
          viewBox="0 0 220 70"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main flourish signature loops in dark forest green/black ink */}
          <path
            d="M 20 48 C 30 18, 42 12, 50 36 C 58 54, 62 10, 72 24 C 82 38, 90 28, 102 34 C 114 40, 126 18, 138 32 C 146 42, 158 20, 168 36 C 178 50, 192 18, 204 42"
            stroke="#0B3B1B"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Underline loop flourish */}
          <path
            d="M 35 52 C 75 58, 140 60, 210 46 C 170 66, 80 64, 45 56"
            stroke="#0B3B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Initial cross & dots */}
          <path d="M 40 28 L 75 32" stroke="#0B3B1B" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="108" cy="22" r="1.5" fill="#0B3B1B" />
          <circle cx="174" cy="24" r="1.5" fill="#0B3B1B" />
        </svg>
      </div>

      {/* Signature line divider */}
      <div className="w-48 h-[1.5px] bg-[#14532D] my-1 opacity-70" />

      {/* Signer Info */}
      <div className="text-[13px] font-serif font-bold text-[#14532D] tracking-wide">
        {signerName}
      </div>
      <div className="text-[11px] font-sans font-semibold text-slate-800 leading-tight">
        {signerTitle}
      </div>
      <div className="text-[10px] font-sans text-slate-600 italic leading-tight">
        {organization}
      </div>
    </div>
  );
}
