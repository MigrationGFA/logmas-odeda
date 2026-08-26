/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicCertificate } from "@/types/publicCertificate";
import { MasterTemplateType } from "./certificateTemplateMap";

/**
 * ============================================================================
 * OFFICIAL CERTIFICATE FONT REGISTRY
 * ============================================================================
 * You can easily switch any field's typography by referencing one of these
 * curated fonts or typing any standard/custom font family name directly.
 */
export const CERTIFICATE_FONTS = {
  // Classical Roman Government Display Serifs
  CINZEL: "'Cinzel', 'Trajan Pro', 'Times New Roman', serif",
  CINZEL_DECORATIVE: "'Cinzel Decorative', 'Cinzel', serif",
  PLAYFAIR: "'Playfair Display', 'Georgia', serif",
  CORMORANT: "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
  EB_GARAMOND: "'EB Garamond', 'Garamond', serif",
  LIBRE_BASKERVILLE: "'Libre Baskerville', 'Baskerville', 'Times New Roman', serif",
  TIMES_CLASSIC: "'Times New Roman', 'Times', 'Baskerville', serif",

  // Crisp Official Sans-Serif Typefaces
  ALBERT_SANS: "'Albert Sans', 'Segoe UI', system-ui, sans-serif",
  MONTSERRAT: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  CALIBRI_OFFICIAL: "'Calibri', 'Arial', sans-serif",

  // Security / Monospace & Certificate Numbering
  JETBRAINS_MONO: "'JetBrains Mono', 'Courier New', Courier, monospace",
  COURIER_PRIME: "'Courier Prime', 'Courier New', Courier, monospace",

  // Formal Script & Calligraphy
  GREAT_VIBES: "'Great Vibes', cursive",
  PINYON_SCRIPT: "'Pinyon Script', cursive",
};

/**
 * Individual field layout and typography specification
 */
export interface CertificateFieldDefinition {
  key: string;
  label?: string;
  x: number; // Horizontal position in % (0 - 100)
  y: number; // Vertical position in % (0 - 100)
  width?: number; // Maximum width in % (0 - 100) to prevent overflow
  height?: number; // Optional height in %
  textAlign?: "left" | "center" | "right";
  
  // TYPOGRAPHY (Easily editable per field)
  fontFamily?: string;
  fontSize?: string; // Container query width (e.g. "1.2cqw", "0.95cqw") or px
  fontWeight?: number | string; // e.g. 400, 600, 700, 900
  letterSpacing?: string; // e.g. "0.05em", "0.15em", "normal"
  lineHeight?: string; // e.g. "1.2", "1.4"
  color?: string; // e.g. "#0D3B1E", "#1E293B", "#FFFFFF"
  textTransform?: "uppercase" | "capitalize" | "lowercase" | "none";
  fontStyle?: "normal" | "italic";
  maxLines?: number;
  
  // Custom Dynamic Value Extractor
  format?: (certificate: PublicCertificate) => string;
}

/**
 * Master Template Layout Configuration
 */
export interface MasterCertificateConfig {
  id: MasterTemplateType;
  name: string;
  orientation: "landscape" | "portrait";
  aspectRatio: string;
  minHeight: string;
  backgroundImage: string;
  defaultTitle: string;
  
  // Template-level typography defaults
  templateDefaults: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number | string;
    color: string;
    lineHeight: string;
  };

  // QR Code coordinates matching the blank template's box
  qrCode: {
    x: number;
    y: number;
    width: number;
    height: number;
    padding?: number;
  };

  // Field dictionary
  fields: Record<string, CertificateFieldDefinition>;
}

/**
 * ============================================================================
 * 1. MASTER PORTRAIT TEMPLATE CONFIGURATION (Certificate of Origin & Permits)
 * Background Artwork: /certificates/templates/origin-template.jpg
 * ============================================================================
 */
export const PORTRAIT_TEMPLATE_CONFIG: MasterCertificateConfig = {
  id: "portrait",
  name: "Official Portrait Certificate (Origin & Statutory Permits)",
  orientation: "portrait",
  aspectRatio: "1 / 1.414", // A4 Portrait Aspect Ratio
  minHeight: "1050px",
  backgroundImage: "/certificates/templates/origin-template.jpg",
  defaultTitle: "CERTIFICATE OF ORIGIN",

  templateDefaults: {
    fontFamily: CERTIFICATE_FONTS.CORMORANT,
    fontSize: "0.92cqw",
    fontWeight: 600,
    color: "#1E293B",
    lineHeight: "1.3",
  },

  qrCode: {
    x: 13.0,
    y: 76.5,
    width: 14.2,
    height: 9.8,
    padding: 3,
  },

  fields: {
    // ------------------------------------------------------------------------
    // TOP HEADER SECTION
    // ------------------------------------------------------------------------
    councilTitle: {
      key: "councilTitle",
      x: 50.0,
      y: 8.5,
      width: 65.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CINZEL,
      fontSize: "1.8cqw",
      fontWeight: 900,
      letterSpacing: "0.08em",
      color: "#0D3B1E", // Deep forest government green
      textTransform: "uppercase",
      format: () => "ODEDA LOCAL GOVERNMENT",
    },

    councilSubtitle: {
      key: "councilSubtitle",
      x: 50.0,
      y: 11.5,
      width: 50.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.MONTSERRAT,
      fontSize: "0.85cqw",
      fontWeight: 800,
      letterSpacing: "0.16em",
      color: "#15803D",
      textTransform: "uppercase",
      format: () => "OGUN STATE, NIGERIA",
    },

    councilAddress: {
      key: "councilAddress",
      x: 50.0,
      y: 13.8,
      width: 60.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.72cqw",
      fontWeight: 500,
      letterSpacing: "0.02em",
      color: "#475569",
      format: () => "P.M.B. 01, Ita Oshin, Odeda, Ogun State. • info@odeda.ogunstate.gov.ng",
    },

    // Top Right Certificate Number
    certificateNumber: {
      key: "certificateNumber",
      x: 76.5,
      y: 20.5,
      width: 34.0,
      textAlign: "right",
      fontFamily: CERTIFICATE_FONTS.JETBRAINS_MONO,
      fontSize: "0.95cqw",
      fontWeight: 700,
      letterSpacing: "0.05em",
      color: "#0D3B1E",
      format: (c) => `Certificate No: ${c.certificateNumber || "ODE/CERT/2026/001"}`,
    },

    // ------------------------------------------------------------------------
    // CERTIFICATE TITLE IN GREEN RIBBON BANNER
    // ------------------------------------------------------------------------
    certificateTitle: {
      key: "certificateTitle",
      x: 50.0,
      y: 33.0,
      width: 55.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CINZEL,
      fontSize: "1.55cqw",
      fontWeight: 900,
      letterSpacing: "0.09em",
      color: "#FFFFFF",
      textTransform: "uppercase",
      format: (c) => c.service.name?.toUpperCase() || "CERTIFICATE OF ORIGIN",
    },

    // Certifying Preamble Paragraph
    certifyingIntro: {
      key: "certifyingIntro",
      x: 50.0,
      y: 38.2,
      width: 74.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CORMORANT,
      fontSize: "0.95cqw",
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "1.4",
      letterSpacing: "0.01em",
      color: "#1E293B",
      format: () =>
        "This is to certify that the goods / individual described below originated from Odeda Local Government Area, Ogun State, Nigeria and that they are produced, manufactured or recognized in this area.",
    },

    // ------------------------------------------------------------------------
    // TABULAR BIODATA / FIELD ROWS (y: 44.0% to 68.0%)
    // ------------------------------------------------------------------------
    // Row 1: Name of Applicant
    nameOfApplicantLabel: {
      key: "nameOfApplicantLabel",
      x: 18.0,
      y: 44.0,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Name of Applicant",
    },
    nameOfApplicantColon: {
      key: "nameOfApplicantColon",
      x: 48.0,
      y: 44.0,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    nameOfApplicantValue: {
      key: "nameOfApplicantValue",
      x: 51.0,
      y: 44.0,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.CINZEL,
      fontSize: "1.08cqw",
      fontWeight: 900,
      letterSpacing: "0.03em",
      color: "#0D3B1E",
      textTransform: "uppercase",
      format: (c) => c.certificateData?.nameOfApplicant || c.applicant.name || "Adebayo Olawale Babatunde",
    },

    // Row 2: Address
    addressLabel: {
      key: "addressLabel",
      x: 18.0,
      y: 47.3,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Address",
    },
    addressColon: {
      key: "addressColon",
      x: 48.0,
      y: 47.3,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    addressValue: {
      key: "addressValue",
      x: 51.0,
      y: 47.3,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.86cqw",
      fontWeight: 600,
      lineHeight: "1.25",
      color: "#1E293B",
      format: (c) => c.certificateData?.address || c.applicant.address || "Ward 7 (Itesi / Camp), Odeda LGA, Ogun State",
    },

    // Row 3: Description of Goods / Activity
    descriptionOfGoodsLabel: {
      key: "descriptionOfGoodsLabel",
      x: 18.0,
      y: 50.8,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Description of Goods",
    },
    descriptionOfGoodsColon: {
      key: "descriptionOfGoodsColon",
      x: 48.0,
      y: 50.8,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    descriptionOfGoodsValue: {
      key: "descriptionOfGoodsValue",
      x: 51.0,
      y: 50.8,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.88cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.descriptionOfGoods || "General Merchandise / Indigene Verification Record",
    },

    // Row 4: Country of Destination
    countryOfDestinationLabel: {
      key: "countryOfDestinationLabel",
      x: 18.0,
      y: 54.2,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Country of Destination",
    },
    countryOfDestinationColon: {
      key: "countryOfDestinationColon",
      x: 48.0,
      y: 54.2,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    countryOfDestinationValue: {
      key: "countryOfDestinationValue",
      x: 51.0,
      y: 54.2,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.88cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.countryOfDestination || "Nigeria",
    },

    // Row 5: Purpose
    purposeLabel: {
      key: "purposeLabel",
      x: 18.0,
      y: 57.6,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Purpose",
    },
    purposeColon: {
      key: "purposeColon",
      x: 48.0,
      y: 57.6,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    purposeValue: {
      key: "purposeValue",
      x: 51.0,
      y: 57.6,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.88cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.purpose || "For Documentation / Official Use",
    },

    // Row 6: Ward
    wardLabel: {
      key: "wardLabel",
      x: 18.0,
      y: 61.0,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Ward",
    },
    wardColon: {
      key: "wardColon",
      x: 48.0,
      y: 61.0,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    wardValue: {
      key: "wardValue",
      x: 51.0,
      y: 61.0,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.88cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.ward || c.applicant.ward || "Ward 7 (Itesi / Camp)",
    },

    // Row 7: Date of Issue
    dateOfIssueLabel: {
      key: "dateOfIssueLabel",
      x: 18.0,
      y: 64.4,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Date of Issue",
    },
    dateOfIssueColon: {
      key: "dateOfIssueColon",
      x: 48.0,
      y: 64.4,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    dateOfIssueValue: {
      key: "dateOfIssueValue",
      x: 51.0,
      y: 64.4,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#1E293B",
      format: (c) => c.certificateData?.dateOfIssue || "21st August, 2026",
    },

    // Row 8: Valid Until
    validUntilLabel: {
      key: "validUntilLabel",
      x: 18.0,
      y: 67.8,
      width: 30.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 600,
      color: "#334155",
      format: () => "Valid Until",
    },
    validUntilColon: {
      key: "validUntilColon",
      x: 48.0,
      y: 67.8,
      width: 3.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: () => ":",
    },
    validUntilValue: {
      key: "validUntilValue",
      x: 51.0,
      y: 67.8,
      width: 34.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: (c) => c.certificateData?.validUntil || c.validUntil || "21st August, 2027",
    },

    // ------------------------------------------------------------------------
    // STATUTORY NOTICE & SIGNATURE SECTION
    // ------------------------------------------------------------------------
    statutoryLawNotice: {
      key: "statutoryLawNotice",
      x: 50.0,
      y: 72.2,
      width: 68.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CORMORANT,
      fontSize: "0.78cqw",
      fontWeight: 600,
      fontStyle: "italic",
      lineHeight: "1.25",
      color: "#1E293B",
      format: (c) =>
        c.certificateData?.statutoryLawNotice ||
        "This Certificate is issued in accordance with the provisions of the Local Government (Establishment) Law of Ogun State, 2006 and other applicable laws.",
    },

    // Chairman Signer Name (above Executive Chairman)
    signerName: {
      key: "signerName",
      x: 74.0,
      y: 81.8,
      width: 25.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CORMORANT,
      fontSize: "1.0cqw",
      fontWeight: 700,
      letterSpacing: "0.03em",
      color: "#0D3B1E",
      format: (c) => c.issuer.name || "Hon. Akinyemi A. Odunayo",
    },

    signerTitle: {
      key: "signerTitle",
      x: 74.0,
      y: 85.5,
      width: 25.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.MONTSERRAT,
      fontSize: "0.78cqw",
      fontWeight: 700,
      letterSpacing: "0.05em",
      color: "#334155",
      format: (c) => c.issuer.title || "Executive Chairman, Odeda Local Government",
    },
  },
};

/**
 * ============================================================================
 * 2. MASTER LANDSCAPE TEMPLATE CONFIGURATION (Club Registration & CDAs)
 * Background Artwork: /certificates/templates/club-registration-template.jpg
 * ============================================================================
 */
export const LANDSCAPE_TEMPLATE_CONFIG: MasterCertificateConfig = {
  id: "landscape",
  name: "Official Landscape Certificate (Club & CDA Registration)",
  orientation: "landscape",
  aspectRatio: "1.414 / 1", // A4 Landscape Aspect Ratio
  minHeight: "750px",
  backgroundImage: "/certificates/templates/club-registration-template.jpg",
  defaultTitle: "CERTIFICATE OF CLUB REGISTRATION",

  templateDefaults: {
    fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
    fontSize: "0.95cqw",
    fontWeight: 600,
    color: "#1E293B",
    lineHeight: "1.3",
  },

  qrCode: {
    x: 78.4,
    y: 73.8,
    width: 7.8,
    height: 11.0,
    padding: 2,
  },

  fields: {
    // Top Right Certificate Number
    certificateNumber: {
      key: "certificateNumber",
      x: 88.2,
      y: 8.6,
      width: 17.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.JETBRAINS_MONO,
      fontSize: "0.95cqw",
      fontWeight: 700,
      letterSpacing: "0.04em",
      color: "#0D3B1E",
      format: (c) => c.certificateNumber || c.certificateData?.registrationNo || "ODLG/CR/2026/CLB/00123",
    },

    // Top Right Date of Issue
    dateOfIssue: {
      key: "dateOfIssue",
      x: 88.2,
      y: 14.5,
      width: 17.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.92cqw",
      fontWeight: 700,
      color: "#1E293B",
      format: (c) => c.certificateData?.dateOfRegistration || c.certificateData?.dateOfIssue || "21st August, 2026",
    },

    // Green Ribbon Certificate Title Banner
    certificateTitle: {
      key: "certificateTitle",
      x: 50.0,
      y: 34.0,
      width: 65.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CINZEL,
      fontSize: "1.65cqw",
      fontWeight: 900,
      letterSpacing: "0.08em",
      color: "#FFFFFF",
      textTransform: "uppercase",
      format: (c) => c.service.name?.toUpperCase() || "CERTIFICATE OF CLUB REGISTRATION",
    },

    // Prominent Centered Club Name (under "This is to certify that")
    clubName: {
      key: "clubName",
      x: 50.0,
      y: 45.6,
      width: 60.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CINZEL,
      fontSize: "1.65cqw",
      fontWeight: 900,
      letterSpacing: "0.04em",
      color: "#0D3B1E",
      textTransform: "uppercase",
      format: (c) => c.certificateData?.clubName || c.applicant.name || "Youth Empowerment Club",
    },

    // ------------------------------------------------------------------------
    // LEFT COLUMN FIELDS (x: 25.8%, y: 58.2% to 71.0%)
    // ------------------------------------------------------------------------
    // Left Col Row 1: Club Name Line Value
    clubNameField: {
      key: "clubNameField",
      x: 25.8,
      y: 58.2,
      width: 18.5,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.98cqw",
      fontWeight: 700,
      color: "#0D3B1E",
      format: (c) => c.certificateData?.clubName || c.applicant.name || "Youth Empowerment Club",
    },

    // Left Col Row 2: Registration No. Line Value
    registrationNumber: {
      key: "registrationNumber",
      x: 25.8,
      y: 62.5,
      width: 18.5,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.JETBRAINS_MONO,
      fontSize: "0.95cqw",
      fontWeight: 700,
      letterSpacing: "0.04em",
      color: "#1E293B",
      format: (c) => c.certificateData?.registrationNo || c.certificateNumber || "ODLG/CR/2026/CLB/00123",
    },

    // Left Col Row 3: Category Line Value
    category: {
      key: "category",
      x: 25.8,
      y: 66.8,
      width: 18.5,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.95cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.category || c.service.category || "Community Development",
    },

    // Left Col Row 4: Date of Registration Line Value
    dateOfRegistration: {
      key: "dateOfRegistration",
      x: 25.8,
      y: 71.0,
      width: 18.5,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.95cqw",
      fontWeight: 600,
      color: "#1E293B",
      format: (c) => c.certificateData?.dateOfRegistration || c.certificateData?.dateOfIssue || "21st August, 2026",
    },

    // ------------------------------------------------------------------------
    // RIGHT COLUMN FIELDS (x: 68.2%, y: 58.2% to 70.8%)
    // ------------------------------------------------------------------------
    // Right Col Row 1: Address Line Value
    address: {
      key: "address",
      x: 68.2,
      y: 58.2,
      width: 20.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.90cqw",
      fontWeight: 600,
      lineHeight: "1.2",
      color: "#1E293B",
      format: (c) => c.certificateData?.address || c.applicant.address || "Odeda LGA, Ogun State, Nigeria",
    },

    // Right Col Row 2: Objectives Line Value
    objectives: {
      key: "objectives",
      x: 68.2,
      y: 62.5,
      width: 20.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.ALBERT_SANS,
      fontSize: "0.85cqw",
      fontWeight: 600,
      lineHeight: "1.2",
      color: "#1E293B",
      format: (c) => c.certificateData?.objectives || "Youth Development, Skill Acquisition, Community Service",
    },

    // Right Col Row 3: Validity Line Value
    validity: {
      key: "validity",
      x: 68.2,
      y: 70.8,
      width: 20.0,
      textAlign: "left",
      fontFamily: CERTIFICATE_FONTS.LIBRE_BASKERVILLE,
      fontSize: "0.95cqw",
      fontWeight: 700,
      color: "#1E293B",
      format: (c) => c.certificateData?.validity || c.validUntil || "21st August, 2028",
    },

    // Signer Name above Executive Chairman (Bottom Left)
    signerName: {
      key: "signerName",
      x: 21.8,
      y: 83.2,
      width: 18.0,
      textAlign: "center",
      fontFamily: CERTIFICATE_FONTS.CORMORANT,
      fontSize: "1.0cqw",
      fontWeight: 700,
      letterSpacing: "0.03em",
      color: "#0D3B1E",
      format: (c) => c.issuer.name || "Hon. Akinyemi A. Odunayo",
    },
  },
};

/**
 * MASTER TEMPLATES DICTIONARY
 */
export const MASTER_CERTIFICATE_CONFIGS: Record<MasterTemplateType, MasterCertificateConfig> = {
  portrait: PORTRAIT_TEMPLATE_CONFIG,
  landscape: LANDSCAPE_TEMPLATE_CONFIG,
};

/**
 * Helper to fetch configuration for a specific master template
 */
export function getMasterTemplateConfig(template: MasterTemplateType): MasterCertificateConfig {
  return MASTER_CERTIFICATE_CONFIGS[template] || PORTRAIT_TEMPLATE_CONFIG;
}
