/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OdedaService {
  id: string;
  name: string;
  category: "Certificates" | "Community & Agriculture" | "Rates & Levies" | "Licences & Permits" | "Urban Development";
  description: string;
  revenueHead: string;
  processingTime: string;
  feeType: "fixed" | "variable" | "tiered";
  defaultFee: number;
  feeDescription: string;
  requiresInspection: boolean;
  requiresAssessment: boolean;
  requiresTreasuryApproval: boolean;
  requiresLgaApproval: boolean;
  supportsCertificate: boolean;
  supportsLicence: boolean;
  supportsRenewal: boolean;
  requiresPayment: boolean;
  requiredDocuments: string[];
  icon: string;
  color: string;
}

export const ODEDA_SERVICES: OdedaService[] = [
  {
    id: "certificate_of_origin",
    name: "Certificate of Origin",
    category: "Certificates",
    description: "Official indigene certificate issued to born residents and descendants of Odeda Local Government Area.",
    revenueHead: "1001 - Certificate Fees",
    processingTime: "1 - 2 Business Days",
    feeType: "fixed",
    defaultFee: 3500,
    feeDescription: "₦3,500 statutory application and issuing fee",
    requiresInspection: false,
    requiresAssessment: false,
    requiresTreasuryApproval: false,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: false,
    requiresPayment: true,
    requiredDocuments: [
      "Passport Photograph (red background)",
      "National Identity Card / NIN Slip",
      "Birth Certificate / Sworn Declaration of Age",
      "Letter of Identification from Family Head or Baale"
    ],
    icon: "FileBadge",
    color: "primary"
  },
  {
    id: "club_registration",
    name: "Certificate of Club Registration",
    category: "Certificates",
    description: "Official registration and certification for social, sports, cultural, and youth clubs operating in Odeda LGA.",
    revenueHead: "1002 - Organization Fees",
    processingTime: "3 - 5 Business Days",
    feeType: "fixed",
    defaultFee: 15000,
    feeDescription: "₦15,000 annual registration and certificate fee",
    requiresInspection: true,
    requiresAssessment: false,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Club Constitution / Rules",
      "Minutes of Inaugural Meeting",
      "List of Executive Members & Contacts",
      "Passport Photographs of President & Secretary",
      "Proof of Secretariat / Meeting Venue Address"
    ],
    icon: "Users",
    color: "gold"
  },
  {
    id: "cda_registration",
    name: "Certificate of Community Development Association Registration",
    category: "Community & Agriculture",
    description: "Registration and formal recognition of Community Development Associations (CDAs) in Odeda LGA wards.",
    revenueHead: "1003 - Community Dev Head",
    processingTime: "3 - 5 Business Days",
    feeType: "fixed",
    defaultFee: 10000,
    feeDescription: "₦10,000 community registration fee",
    requiresInspection: true,
    requiresAssessment: false,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "CDA Constitution & By-Laws",
      "Inaugural Meeting Minutes & Attendance Sheet",
      "List of Executive Members with Phone Numbers",
      "Community Boundary Map / Sketch",
      "Letter of Support from Ward Development Committee"
    ],
    icon: "Building2",
    color: "info"
  },
  {
    id: "farmers_registration",
    name: "Certificate of Farmers Registration",
    category: "Community & Agriculture",
    description: "Formal registration and identification certificate for crop, livestock, and poultry farmers across Odeda LGA.",
    revenueHead: "1004 - Agricultural Services",
    processingTime: "2 - 3 Business Days",
    feeType: "fixed",
    defaultFee: 5000,
    feeDescription: "₦5,000 agricultural registration fee",
    requiresInspection: true,
    requiresAssessment: false,
    requiresTreasuryApproval: false,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Passport Photograph of Applicant",
      "Means of Identification (NIN / Voter Card)",
      "Farm Location GPS Coordinates or Sketch",
      "Proof of Land Ownership or Tenancy Agreement",
      "Cooperative / Farmers Association Card (if applicable)"
    ],
    icon: "Sprout",
    color: "success"
  },
  {
    id: "environmental_sanitation",
    name: "Certificate of Environmental Sanitation Compliance",
    category: "Certificates",
    description: "Mandatory environmental sanitation and public health compliance certificate for commercial & industrial premises.",
    revenueHead: "1005 - Health & Sanitation",
    processingTime: "3 - 5 Business Days",
    feeType: "tiered",
    defaultFee: 20000,
    feeDescription: "₦15,000 - ₦50,000 depending on facility size and category",
    requiresInspection: true,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Facility Layout & Sanitation Plan",
      "Waste Management / Disposal Contract Evidence",
      "Pest Control & Fumigation Certificate",
      "Photographs of Waste Storage & Toilet Facilities"
    ],
    icon: "ShieldCheck",
    color: "warning"
  },
  {
    id: "tenement_rate",
    name: "Tenement Rate",
    category: "Rates & Levies",
    description: "Annual statutory property rate levied on residential, commercial, and industrial property owners in Odeda LGA.",
    revenueHead: "2001 - Tenement & Property Rates",
    processingTime: "1 - 2 Business Days",
    feeType: "variable",
    defaultFee: 25000,
    feeDescription: "Assessed based on annual rental value, property classification, and location ward",
    requiresInspection: true,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: false,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Property Ownership Document / Survey Plan",
      "Building Elevation Photographs",
      "Previous Year Tenement Clearance (for renewals)",
      "Valid ID of Property Owner / Agent"
    ],
    icon: "Home",
    color: "primary"
  },
  {
    id: "haulage_fees",
    name: "Haulage Fees",
    category: "Rates & Levies",
    description: "Levy on heavy-duty haulage vehicles, granite, sand, timber, and agricultural produce transport through Odeda LGA.",
    revenueHead: "2002 - Haulage & Transit Head",
    processingTime: "Instant / Same Day",
    feeType: "tiered",
    defaultFee: 10000,
    feeDescription: "₦5,000 - ₦25,000 per trip or monthly operator permit based on truck tonnage",
    requiresInspection: false,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: false,
    supportsCertificate: false,
    supportsLicence: true,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Vehicle Registration Papers",
      "Driver's Licence",
      "Waybill / Load Manifest",
      "Quarry or Loading Point Dispatch Note"
    ],
    icon: "Truck",
    color: "info"
  },
  {
    id: "liquor_licence",
    name: "Liquor Licence Fees",
    category: "Licences & Permits",
    description: "Annual statutory licence authorizing retail or wholesale sale of alcoholic beverages within Odeda LGA jurisdiction.",
    revenueHead: "2003 - Excise & Trade Licences",
    processingTime: "3 - 5 Business Days",
    feeType: "tiered",
    defaultFee: 25000,
    feeDescription: "₦20,000 - ₦60,000 based on hotel, bar, or distributor category",
    requiresInspection: true,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: false,
    supportsLicence: true,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Business Premises Tenancy Agreement / C of O",
      "CAC Business Registration Documents",
      "Environmental Sanitation Compliance Certificate",
      "Valid ID of Business Proprietor"
    ],
    icon: "Beer",
    color: "warning"
  },
  {
    id: "viewing_centre_licence",
    name: "Viewing Centre Licence Fee",
    category: "Licences & Permits",
    description: "Annual permit and safety licence for commercial football viewing centres and game arcades in Odeda LGA.",
    revenueHead: "2004 - Entertainment & Sports",
    processingTime: "2 - 4 Business Days",
    feeType: "fixed",
    defaultFee: 15000,
    feeDescription: "₦15,000 annual viewing centre licence fee",
    requiresInspection: true,
    requiresAssessment: false,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: false,
    supportsLicence: true,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Premises Location Sketch & Photos",
      "Fire Extinguisher & Safety Equipment Receipt",
      "Passport Photograph & ID of Operator",
      "Tenancy Agreement or Approval Letter"
    ],
    icon: "Tv",
    color: "gold"
  },
  {
    id: "quarry_permit",
    name: "Quarry Fees and Permits",
    category: "Licences & Permits",
    description: "Annual operating permit, environmental fee, and stone/granite extraction licence for quarry operators in Odeda LGA.",
    revenueHead: "2005 - Mining & Natural Resources",
    processingTime: "5 - 7 Business Days",
    feeType: "variable",
    defaultFee: 150000,
    feeDescription: "₦150,000 base fee plus per-tonnage extraction assessment",
    requiresInspection: true,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: false,
    supportsLicence: true,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Federal Mining Cadastre Lease / Quarry Licence",
      "State Ministry of Environment EIA Approval",
      "Community Host Agreement (MOU)",
      "Site Survey Plan & GPS Coordinates",
      "CAC Certificate of Incorporation"
    ],
    icon: "Pickaxe",
    color: "primary"
  },
  {
    id: "street_naming",
    name: "Street Naming and Property Numbering",
    category: "Urban Development",
    description: "Formal approval, naming, and property house numbering registration for streets and estates in Odeda LGA.",
    revenueHead: "3001 - Urban Planning Head",
    processingTime: "7 - 10 Business Days",
    feeType: "fixed",
    defaultFee: 100000,
    feeDescription: "₦100,000 for street naming approval; ₦5,000 per property number plate",
    requiresInspection: true,
    requiresAssessment: true,
    requiresTreasuryApproval: true,
    requiresLgaApproval: true,
    supportsCertificate: true,
    supportsLicence: false,
    supportsRenewal: false,
    requiresPayment: true,
    requiredDocuments: [
      "Formal Application Letter with Justification",
      "CDA Resolution or Residents Consent List",
      "Street Location Map & Layout Diagram",
      "Applicant Identification & Contact Details"
    ],
    icon: "MapPin",
    color: "info"
  },
  {
    id: "kiosk_licence",
    name: "Kiosk Licence",
    category: "Licences & Permits",
    description: "Annual trading permit for temporary kiosks, roadside containers, and mobile sales booths in Odeda LGA.",
    revenueHead: "3002 - Micro Trade Permits",
    processingTime: "1 - 2 Business Days",
    feeType: "fixed",
    defaultFee: 8000,
    feeDescription: "₦8,000 annual kiosk licence fee",
    requiresInspection: true,
    requiresAssessment: false,
    requiresTreasuryApproval: false,
    requiresLgaApproval: true,
    supportsCertificate: false,
    supportsLicence: true,
    supportsRenewal: true,
    requiresPayment: true,
    requiredDocuments: [
      "Kiosk & Placement Site Photograph",
      "Landowner or Market Committee Consent Letter",
      "Passport Photograph of Operator",
      "Valid ID Card"
    ],
    icon: "Store",
    color: "success"
  }
];

export function getOdedaServiceById(id: string): OdedaService | undefined {
  return ODEDA_SERVICES.find((s) => s.id === id);
}

export interface ServiceFeeConfig {
  serviceId: string;
  serviceName: string;
  category: string;
  revenueHead: string;
  fee: number;
  status: "active" | "inactive";
  lastUpdated: string;
}

export function getInitialServiceFeeConfigs(): ServiceFeeConfig[] {
  return ODEDA_SERVICES.map((s) => ({
    serviceId: s.id,
    serviceName: s.name,
    category: s.category,
    revenueHead: s.revenueHead,
    fee: s.defaultFee,
    status: "active",
    lastUpdated: "2026-08-16",
  }));
}

export function getServiceFeeConfigs(): ServiceFeeConfig[] {
  if (typeof window === "undefined") {
    return getInitialServiceFeeConfigs();
  }
  try {
    const raw = localStorage.getItem("odeda_service_fee_configs");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const initial = getInitialServiceFeeConfigs();
        return initial.map((init) => {
          const found = parsed.find((p: any) => p.serviceId === init.serviceId);
          return found
            ? {
                ...init,
                fee: typeof found.fee === "number" ? found.fee : init.fee,
                status: found.status === "inactive" ? "inactive" : "active",
                lastUpdated: found.lastUpdated || init.lastUpdated,
              }
            : init;
        });
      }
    }
  } catch (e) {
    console.error("Error loading service fee configs", e);
  }
  const initial = getInitialServiceFeeConfigs();
  try {
    localStorage.setItem("odeda_service_fee_configs", JSON.stringify(initial));
  } catch {}
  return initial;
}

export function getConfiguredFeeForService(serviceId: string): number {
  const configs = getServiceFeeConfigs();
  const found = configs.find((c) => c.serviceId === serviceId);
  if (found && typeof found.fee === "number") {
    return found.fee;
  }
  const svc = getOdedaServiceById(serviceId);
  return svc ? svc.defaultFee : 0;
}

export function saveServiceFeeConfig(
  serviceId: string,
  fee: number,
  status: "active" | "inactive"
): ServiceFeeConfig[] {
  const current = getServiceFeeConfigs();
  const updated = current.map((item) => {
    if (item.serviceId === serviceId) {
      return {
        ...item,
        fee: Math.max(0, Number(fee)),
        status,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    }
    return item;
  });

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("odeda_service_fee_configs", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("odeda:service-fees-change", { detail: updated }));
    } catch (e) {
      console.error("Error saving service fee configs", e);
    }
  }
  return updated;
}

export function toggleServiceFeeStatus(serviceId: string): ServiceFeeConfig[] {
  const current = getServiceFeeConfigs();
  const target = current.find((c) => c.serviceId === serviceId);
  const newStatus = target?.status === "active" ? "inactive" : "active";
  return saveServiceFeeConfig(serviceId, target ? target.fee : 0, newStatus);
}

export function resetServiceFeeToDefault(serviceId: string): ServiceFeeConfig[] {
  const svc = getOdedaServiceById(serviceId);
  if (!svc) return getServiceFeeConfigs();
  return saveServiceFeeConfig(serviceId, svc.defaultFee, "active");
}
