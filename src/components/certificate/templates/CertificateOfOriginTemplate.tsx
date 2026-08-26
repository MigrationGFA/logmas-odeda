import React from "react";
import { PublicCertificate } from "@/types/publicCertificate";
import { CertificateRenderer } from "../CertificateRenderer";
import { PORTRAIT_TEMPLATE_CONFIG } from "@/config/certificateFieldConfig";

interface CertificateOfOriginTemplateProps {
  certificate: PublicCertificate;
  className?: string;
}

export function CertificateOfOriginTemplate({
  certificate,
  className = "",
}: CertificateOfOriginTemplateProps) {
  return (
    <CertificateRenderer
      certificate={certificate}
      config={PORTRAIT_TEMPLATE_CONFIG}
      className={className}
    />
  );
}
