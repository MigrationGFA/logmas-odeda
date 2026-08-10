import { api } from "../lib/api";

// Types based on your controller
export type PaymentMethod =
  | "cash"
  | "pos"
  | "bank_transfer"
  | "online"
  | "virtual_account";
export type InvoiceStatus =
  | "sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "cancelled";
export type PermitStatus = "pending_payment" | "issued" | "expired" | "revoked";

export interface Ward {
  id: string;
  name: string;
  code: string;
}

export interface BusinessInvoice {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: InvoiceStatus;
    createdAt: string;
}

export interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  address: string;
  phone: string;
  email?: string;
  cacNumber?: string;
  category: string;
  description?: string;
  isActive: boolean;
  wardId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  ward?: Ward;
  invoices?: BusinessInvoice[];
  permits?: {
    id: string;
    validTo: string;
    status: PermitStatus;
  }[];
}

export interface BusinessesResponse {
  data: Business[];
  meta: {
    total: number;
    wardId: string;
  };
}

export interface CreateBusinessData {
  businessName: string;
  ownerName: string;
  address: string;
  phone: string;
  email?: string;
  cacNumber?: string;
  category: string;
  description?: string;
  wardId: string;
}

export interface GenerateInvoiceData {
  // ── Business Details ──────────────────────────────────────────
  businessId?: string;
  businessName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  wardId?: string;
  businessCategory?: string;

  // ── Invoice Details ───────────────────────────────────────────
  categoryId: string;
  levyConfigId?: string;
  description?: string;
  overrideAmount?: number;
  quantity: number;
  dueDate: string;

  // ── Notifications ─────────────────────────────────────────────
  // notifyEmail?: boolean;
  // notifySms?: boolean;
  // notifyWhatsapp?: boolean;
}
export interface Invoice {
  id: string;
  invoiceNumber: string;
  categoryId: string;
  description: string;
  subtotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  business?: {
    id: string;
    businessName: string;
    ownerName: string;
    phone: string;
  };
  levyConfig?: {
    name: string;
    billingCycle: string;
  };
  payments?: Payment[];
  receipt?: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
  };
  permit?: {
    id: string;
    permitNumber: string;
    status: PermitStatus;
  };
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: string;
  reference: string;
  narration?: string;
  confirmedAt: string;
  createdAt: string;
}

export interface RecordPaymentData {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  narration?: string;
}

export interface PaymentResponse {
  payment: Payment;
  invoice: Invoice;
  receipt?: {
    id: string;
    receiptNumber: string;
    verificationCode: string;
    qrToken: string;
    amountPaid: number;
    issuedAt: string;
  };
  message: string;
}

export interface IssuePermitData {
  invoiceId: string;
  permitType: string;
  categoryId: string;
  businessId: string;
  validFrom?: string;
}

export interface Permit {
  id: string;
  permitNumber: string;
  verificationCode: string;
  qrToken: string;
  status: PermitStatus;
  validFrom: string;
  validTo: string;
  businessId: string;
  issuedById: string;
  createdAt: string;
  business?: {
    id: string;
    businessName: string;
    ownerName: string;
    address: string;
  };
  issuedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ReceiptVerificationResponse {
  valid: boolean;
  receiptNumber: string;
  amountPaid: number;
  issuedAt: string;
  levyType: string;
  issuedBy: string;
  business?: {
    name: string;
    owner: string;
    address: string;
  };
  issuingAuthority: string;
}

export interface CollectionItem {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  createdAt: string;
  business?: {
    id: string;
    businessName: string;
    ownerName: string;
    phone: string;
  };
  payments?: Payment[];
  receipt?: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
  };
  permit?: {
    id: string;
    permitNumber: string;
    status: PermitStatus;
  };
}

export interface CollectionsResponse {
  data: CollectionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalInvoiced: number;
    totalCollected: number;
    totalTransactions: number;
    date: string;
  };
}

export interface CollectionSummaryResponse {
  today: {
    collected: number;
    invoiced: number;
    transactions: number;
  };
  allTime: {
    collected: number;
    invoiced: number;
    transactions: number;
  };
  byCategory: Array<{
    category: string;
    collected: number;
    transactions: number;
  }>;
}

export interface WardPermit {
  id: string;
  permitNumber: string;
  status: PermitStatus;
  validFrom: string;
  validTo: string;
  outstanding: number;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  category: string;
  businessId: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceStatus: InvoiceStatus | null;
  fee: number;
  permitType: string;
}

export interface WardPermitsResponse {
  permits: WardPermit[];
  stats: {
    dailyCollections: number;
    inspectedShops: number;
    wardId: string;
    wardName: string;
  };
}

export interface DemandNoticeData {
  permitId: string;
}

export interface ViolationData {
  businessId?: string;
  businessName?: string;
  address?: string;
  wardId: string;
  description: string;
  severity?: "minor" | "major" | "critical";
}

export interface Violation {
  id: string;
  businessId: string | null;
  businessName: string | null;
  address: string | null;
  wardId: string;
  description: string;
  severity: string;
  status: string;
  loggedById: string;
  createdAt: string;
  business?: { businessName: string; address: string };
  ward?: { name: string };
  loggedBy?: { firstName: string; lastName: string };
}

// Service functions
export const fieldOfficerService = {
  // Business Registration
  registerBusiness: (data: CreateBusinessData) =>
    api.post<Business>("/field-officer/businesses", data),

  getAllWardBusinesses: () =>
    api.get<Business[]>("/field-officer/businesses"),

  // Invoice Generation
  generateInvoice: (data: GenerateInvoiceData) =>
    api.post<Invoice>("/field-officer/invoices", data),

  // Payment Recording
  recordPayment: (data: RecordPaymentData, permitId?: string) =>
    api.post<PaymentResponse>(
      `/field-officer/permits/${permitId}/collect`,
      data,
    ),

  // Permit Issuance
  issuePermit: (data: IssuePermitData) =>
    api.post<Permit>("/field-officer/permits", data),

  // Receipt Verification
  verifyReceipt: (code: string) =>
    api.get<ReceiptVerificationResponse>(
      `/field-officer/receipts/verify/${code}`,
    ),

  // Daily Collections
  getMyCollections: (params?: {
    date?: string;
    page?: number;
    limit?: number;
  }) => api.get<CollectionsResponse>("/field-officer/collections", { params }),

  getCollectionSummary: () =>
    api.get<CollectionSummaryResponse>("/field-officer/collections/summary"),

  getWardPermits: (params?: { search?: string; status?: string }) =>
    api.get<WardPermitsResponse>("/field-officer/permits", { params }),

  // Issue demand notice
  issueDemandNotice: (permitId: string) =>
    api.post<{ invoice: Invoice; permit: string }>(
      `/field-officer/permits/${permitId}/demand-notice`,
    ),

  // Log violation
  logViolation: (data: ViolationData) =>
    api.post<Violation>("/field-officer/violations", data),
};
