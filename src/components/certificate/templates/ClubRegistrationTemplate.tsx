import React from "react";
import { PublicCertificate } from "@/types/publicCertificate";
import { CertificateRenderer } from "../CertificateRenderer";
import { LANDSCAPE_TEMPLATE_CONFIG } from "@/config/certificateFieldConfig";

interface ClubRegistrationTemplateProps {
  certificate: PublicCertificate;
  className?: string;
}

export function ClubRegistrationTemplate({
  certificate,
  className = "",
}: ClubRegistrationTemplateProps) {
  return (
    <CertificateRenderer
      certificate={certificate}
      config={LANDSCAPE_TEMPLATE_CONFIG}
      className={className}
    />
  );
}
