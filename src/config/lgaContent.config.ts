import { LGA_CONFIG } from "@/config/lga.config";
import chairmanPhoto from "@/assets/chairman.jpg";

// NOTE: LGA-flavoured marketing content (stats, testimonials, ward map, careers,
// gallery, investment, tourism) is defined once in `LGA_CONFIG.content`
// (src/config/lga.config.ts). Edit it there — this module only re-exports it.

export const STATS = [
  { label: "Land Area", value: LGA_CONFIG.content.stats.landArea, trend: LGA_CONFIG.content.stats.landAreaTrend },
  { label: "Established", value: String(LGA_CONFIG.identity.establishedYear), trend: LGA_CONFIG.identity.state },
  { label: "Primary Economic Sector", value: LGA_CONFIG.content.stats.primarySector, trend: LGA_CONFIG.content.stats.primarySectorTrend },
];

export const SERVICES = [
  {
    icon: "FileBadge",
    title: "State of Origin",
    desc: `Apply, pay and download your ${LGA_CONFIG.identity.name} LGA indigene certificate online with QR verification.`,
    color: "primary",
  },
  {
    icon: "Sprout",
    title: "Farmers Registration",
    desc: "Register agricultural holdings, poultry, livestock, and crop farmlands.",
    color: "success",
  },
  {
    icon: "Truck",
    title: "Haulage & Transit Fees",
    desc: "Haulage operators can settle granite, timber, and produce haulage fees online.",
    color: "info",
  },
  {
    icon: "Home",
    title: "Tenement Rate",
    desc: "Assess, view, and pay property rates for residential and commercial premises.",
    color: "warning",
  },
  {
    icon: "Pickaxe",
    title: "Quarry Fees & Permits",
    desc: "Obtain operating permits and pay extraction levies for quarry sites.",
    color: "gold",
  },
  {
    icon: "MessageSquare",
    title: "Complaints & Feedback",
    desc: `Raise concerns directly with ${LGA_CONFIG.identity.fullName} council officers.`,
    color: "primary",
  },
];


export const TESTIMONIALS = LGA_CONFIG.content.testimonials;

export const NEWS = LGA_CONFIG.content.news;

export interface ApplicationRecord {
  id: string;
  applicant: string;
  dob: string;
  gender: "Male" | "Female";
  address: string;
  lga: string;
  ward: string;
  phone: string;
  email: string;
  photoUrl?: string;
  type: string;
  serviceId?: string;
  status: "pending" | "review" | "approved" | "declined" | "returned_for_correction";
  paymentStatus: "paid" | "unpaid";
  receiptNumber?: string;
  amount: number;
  date: string;
  history: { date: string; event: string }[];
  remarks?: string;
}

export const APPLICATIONS: ApplicationRecord[] = [
  {
    id: "APP-ODE-9821",
    applicant: "Adebayo Ogunleye",
    dob: "1988-04-12",
    gender: "Male",
    address: "15 the LGA Secretariat Road",
    lga: "the LGA",
    ward: "the LGA",
    phone: "+2348012345678",
    email: "adebayo@example.com",
    type: "State of Origin",
    serviceId: "certificate_of_origin",
    status: "pending",
    paymentStatus: "paid",
    receiptNumber: "RCT-20260508-ODE1",
    amount: 3500,
    date: "2026-05-08",
    history: [
      { date: "2026-05-08", event: "Application submitted" },
      { date: "2026-05-08", event: "Payment confirmed (N3,500)" },
    ],
  },
  {
    id: "APP-ODE-9820",
    applicant: "Obantoko Progressive Club",
    dob: "1992-11-03",
    gender: "Female",
    address: "8 Obantoko Express Way",
    lga: "the LGA",
    ward: "Obantoko",
    phone: "+2348022345678",
    email: "obantokoclub@example.com",
    type: "Certificate of Club Registration",
    serviceId: "club_registration",
    status: "approved",
    paymentStatus: "paid",
    receiptNumber: "RCT-20260507-ODE2",
    amount: 15000,
    date: "2026-05-07",
    history: [
      { date: "2026-05-07", event: "Application submitted" },
      { date: "2026-05-07", event: "Inspection completed" },
      { date: "2026-05-07", event: "Approved by LGA Admin" },
    ],
  },
];

export const LEADERSHIP = [
  {
    name: LGA_CONFIG.leadership.chairman.name,
    role: LGA_CONFIG.leadership.chairman.title,
    bio: `Leading ${LGA_CONFIG.identity.fullName} with a vision for purposeful, people-centred governance, digital transformation, agricultural empowerment, and infrastructure growth across all ${LGA_CONFIG.wards.length} wards.`,
    initials: LGA_CONFIG.leadership.chairman.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "WA",
    accent: "primary",
    image: chairmanPhoto,
    party: "All Progressives Congress (APC)",
    email: LGA_CONFIG.contact.email,
  },
  {
    name: "Hon. Dr. Nosiru Yaya",
    role: "Vice Chairman",
    bio: `Overseeing social development, health, and women empowerment initiatives in ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "VC",
    accent: "gold",
    email: `vicechairman@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },
  {
    name: "Hon. Adebayo Oyekunle",
    role: "Secretary to Local Government",
    bio: "Coordinates council administration and inter-departmental policy implementation.",
    initials: "SLG",
    accent: "info",
    email: `secretary@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },
  {
    name: LGA_CONFIG.leadership.headOfLocalGovAdmin?.name || "Head of Local Government Administration",
    role: "HOLGA",
    bio: `Directs civil service operations and public administration in ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "HL",
    accent: "success",
    email: `holga@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },

  {
    //lets fo auditor
    name: "Mrs. Modupe Adeyanju",
    role: "Internal Auditor",
    bio: `Oversees internal audit functions and ensures financial compliance in ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "IA",
    accent: "danger",
    email: `auditor@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },

  //next is dir of finance
  {
    name: "Mrs. Ganiyat Sanni",
    role: "Director of Finance",
    bio: `Oversees financial management and budgeting in ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "DF",
    accent: "warning",
    email: `finance@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },

  //next is head general services and administration department
  {
    name: "Mrs Motunrayo Akpoduado",
    role: "Head of General Services and Administration",
    bio: `Leads the General Services and Administration department in ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "HGS",
    accent: "info",
    email: `generalservices@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },

  //Leader of the legislators
  {
    name: "Hon. Osunnowo Azeez",
    role: "Leader of the Legislators",
    bio: `Heads the legislative arm of ${LGA_CONFIG.identity.formalTitle}.`,
    initials: "LL",
    accent: "primary",
    email: `legislators@${LGA_CONFIG.contact.email.split("@")[1] || "lga.gov.ng"}`,
  },
];

export const WARDS_INFO = LGA_CONFIG.content.wardsInfo;

export const CAREERS = LGA_CONFIG.content.careers;

export const DEPARTMENTS = [
  { name: "General Services and Administration", head: "HOD General Services", icon: "Building", desc: "Oversees general administration and municipal services." },
  { name: "Finance and Supply", head: "HOD Finance", icon: "Calculator", desc: "Manages public finance, revenue, and procurement." },
  { name: "Works", head: "HOD Works", icon: "Hammer", desc: "Responsible for infrastructure development and maintenance." },
  { name: "Community Development, Social Welfare, Tourism and Youth", head: "HOD Community Development", icon: "People", desc: "Promotes social welfare, tourism, and youth engagement." },
  { name: "Agriculture and Food Security", head: "HOD Agriculture", icon: "Sprout", desc: "Supports local farmers, livestock, and food security initiatives." },
  { name: "Budget, Planning, Research and Statistics", head: "HOD Budget", icon: "ChartBar", desc: "Handles budget planning, research, and statistical analysis." },
  { name: "Information, Public Relations, Education and Sports", head: "HOD Information", icon: "Newspaper", desc: "Manages public relations, education, and sports programs." },
  { name: "Water Supply and Environmental Sanitation", head: "HOD Water Supply", icon: "Water", desc: "Ensures clean water supply and environmental sanitation." },
  { name: "Primary Health Care", head: "HOD Health", icon: "HeartPulse", desc: "Provides primary healthcare services to the community." },
];

export const DOWNLOADS = [
  { id: "1", title: `${LGA_CONFIG.identity.formalTitle} Revenue Bye-Law 2026`, type: "Legal & Gazette", size: "2.4 MB", file: "bye-law-2026.pdf" },
  { id: "2", title: "Tenement Rate Assessment Guidelines", type: "Rates & Taxes", size: "1.1 MB", file: "tenement-guidelines.pdf" },
  { id: "3", title: "Quarry & Mining Operations Guidelines", type: "Environmental & Mining", size: "1.8 MB", file: "quarry-guidelines.pdf" },
  { id: "4", title: "State of Origin Application Form PDF", type: "Civic Services", size: "850 KB", file: "origin-form.pdf" },
];

export const FAQS = [
  { question: `How do I apply for State of Origin in ${LGA_CONFIG.identity.formalTitle}?`, answer: "Navigate to Services Catalogue, select State of Origin, fill in ancestral details, upload required documents, and complete online payment." },
  { question: `What is the fee for Tenement Rate in ${LGA_CONFIG.identity.name}?`, answer: "Tenement rates vary based on property classification (Residential, Commercial, Industrial). You can calculate and pay directly on the portal." },
  { question: "How do haulage drivers pay transit fees?", answer: "Haulage drivers or dispatch officers generate instant transit passes via the Haulage Fees service page and present the QR receipt at inspection points." },
  { question: "Can I verify an issued certificate?", answer: `Yes, all ${LGA_CONFIG.identity.formalTitle} certificates and licences contain a unique QR code and verification token that can be verified online instantly.` },
];

export const GALLERY = LGA_CONFIG.content.gallery;

export const INVEST_OPPS = LGA_CONFIG.content.investOpps;

export const TOURISM = LGA_CONFIG.content.tourism;
