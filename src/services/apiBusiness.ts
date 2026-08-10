/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "@/lib/auth";
import { api } from "../lib/api";

// Types based on your controller
export type RevenueCategory =
  | "state_of_origin_fee"
  | "trade_permits"
  | "haulage_levy"
  | "market_levy"
  | "signage_levy"
  | "development_levy"
  | "property_tax";

export type PermitStatus = "pending_payment" | "issued" | "expired" | "revoked";
export type InvoiceStatus = "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";

export interface Ward {
  id: string;
  name: string;
  code: string;
}

export interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  cacNumber?: string;
  category: string;
  description?: string;
  isActive: boolean;
  wardId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  ward?: Ward;
  permits?: FormattedPermit[];
}

// Formatted Permit matching frontend expectations
export interface FormattedPermit {
  id: string;
  permitNumber: string;
  permitType: string;
  status: PermitStatus;
  issueDate: string;
  expiryDate: string;
  qrToken: string;
  businessName: string;
  fee: number;
  invoiceId: string | null;
  invoice?: {
    id: string;
    status: InvoiceStatus;
    totalAmount: number;
    balanceDue: number;
  };
}

// Original Permit (if needed)

export interface Permit {
  id: string;
  permitNumber: string;
  permitType: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  qrToken: string;
  businessName: string;
  fee: number;
  invoiceId: string;
  invoice: {
    id: string;
    status: string;
    totalAmount: string;
    balanceDue: string;
  };
}

export interface PermitById {
  id: string;
  permitNumber: string;
  verificationCode: string;
  qrToken: string;
  status: string;
  configId: string;
  categoryId: string;
  validFrom: string;
  validTo: string;
  pdfUrl: string | null;
  businessId: string;
  issuedById: string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  business: {
    id: string;
    businessName: string;
    address: string;
    wardId: string;
    category: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
    };
  };
  invoice: {
    amountPaid: string;
    totalAmount: string;
    id: string;
    balanceDue: string;
    invoiceNumber: string;
    status: string;
  };
  issuedBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  config: {
    id: string;
    name: string;
  };
  // meta: any | null;
  // error: any | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  category: RevenueCategory;
  description: string;
  subtotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  businessId?: string;
  levyConfig?: {
    name: string;
    category: string;
    billingCycle: string;
  };
  receipt?: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
  };
  permit?: {
    id: string;
    permitNumber: string;
    status: PermitStatus;
    validFrom: string;
    validTo: string;
  };
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  confirmedAt: string;
  createdAt: string;
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
  existingUserId?: string;
}

export interface UpdateBusinessData {
  businessName?: string;
  ownerName?: string;
  address?: string;
  phone?: string;
  email: string;
  cacNumber?: string;
  category?: string;
  description?: string;
  wardId?: string;
}

export interface ApplyForPermitData {
  businessId: string;
  categoryId: string;
  validFrom?: string;
}

export interface RenewPermitData {
  validFrom?: string;
}

export interface ApplyForPermitResponse {
  permit: Permit;
  invoice: Invoice;
  paymentNote: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PermitVerificationResponse {
  valid: boolean;
  status: PermitStatus;
  isExpired: boolean;
  permitNumber: string;
  permitType: string;
  category: RevenueCategory;
  validFrom: string;
  validTo: string;
  issuedAt: string;
  business: {
    name: string;
    owner: string;
    address: string;
    category: string;
    ward: string;
  };
  issuingAuthority: string;
}

export interface GetBusinessPermitsResponse{
  permits:Permit[]
}

export interface ApiResponse<T> {
  error: null;
  data: T;
  meta: string | null;
}

// Service functions
export const businessService = {
  // Business Profile
  createBusiness: (data: CreateBusinessData) => api.post<Business>("/business", data),

  getMyBusiness: () => api.get<Business>("/business/my"),

  updateMyBusiness: (data: UpdateBusinessData) => api.patch<Business>("/business/my", data),

  getMyPermits: async () => {
  const response = await api.get<GetBusinessPermitsResponse>("/business/permits");
  console.log('Response after unwrap:', response);
  console.log('Is array?', Array.isArray(response));
  return response.permits;
},

  getMyPermitById: (id: string) => api.get<PermitById>(`/business/permits/${id}`),

  applyForPermit: (data: ApplyForPermitData) =>
    api.post<ApplyForPermitResponse>("/business/permits", data),

  renewPermit: (id: string, data: RenewPermitData) =>
    api.post<ApplyForPermitResponse>(`/business/permits/${id}/renew`, data),

  // Business Invoices
  getMyInvoices: (params?: { status?: InvoiceStatus; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Invoice>>("/business/invoices", { params }),

  getMyInvoiceById: (id: string) => api.get<Invoice>(`/business/invoices/${id}`),

  // Public Verification
  verifyPermit: (code: string) =>
    api.get<PermitVerificationResponse>(`/business/permits/verify/${code}`),
};
