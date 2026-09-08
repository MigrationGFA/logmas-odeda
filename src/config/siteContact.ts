/**
 * Centralized Contact Configuration for Odeda Local Government (LOGMAS)
 * Update phone numbers, emails, addresses, and office hours here.
 * Changes here are reflected across all public marketing and citizen-facing pages.
 */

export const SITE_CONTACT = {
  // Primary Public Contact Information
  phone: "+234 80 333 789 71",
  phoneRaw: "+2348033378971",
  phoneTel: "tel:+2348033378971",
  
  // Secondary / Helpline numbers if needed
  altPhone: "+234 803 373 3155",
  altPhoneRaw: "+2348033733155",
  emergencyPhone: "112",

  // Email Addresses
  email: "info@odedalga.com",
  emailMailto: "mailto:info@odedalga.com",
  supportEmail: "support@odedalga.com",
  chairmanEmail: "chairman@odedalga.com",
  revenueEmail: "revenue@odedalga.com",

  // Physical Location & Secretariat
  councilName: "Odeda Local Government",
  lgaName: "Odeda LGA",
  state: "Ogun State",
  country: "Nigeria",
  secretariatAddress: "LGA Secretariat, Abeokuta–Ibadan Expressway, Odeda, Ogun State",
  shortAddress: "LGA Secretariat, Odeda, Ogun State",

  // Operating Hours
  officeHours: "Monday – Friday: 8:00 AM – 5:00 PM",
  operatingDays: "Mon – Fri, 8am – 5pm",
  weekendHours: "Closed (Emergency & online services active 24/7)",

  // Online & Portal
  portalUrl: "https://www.odedalga.com",
  helpdeskTitle: "Odeda Council Citizens Helpdesk",

  // Social Channels
  socials: {
    facebook: "https://facebook.com/odedalga",
    twitter: "https://x.com/odedalga",
    instagram: "https://instagram.com/odedalga",
    youtube: "https://youtube.com/@odedalga",
  },
} as const;

export type SiteContact = typeof SITE_CONTACT;
