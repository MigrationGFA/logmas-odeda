/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type InvoiceStatus =
  | "sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "cancelled";
export type BillingCycle =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "one_time";

export interface LevyConfig {
  id: string;
  name: string;
  category: {
    createdAt: string;
    description: string;
    id: string;
    isActive: boolean;
    name: string;
    slug: string;
    type: "LEVY" | "PERMIT";
    updatedAt: string;
  };
  description?: string;
  amount: number;
  billingCycle: BillingCycle;
  penaltyRate?: number;
  mode: "fixed" | "variable";
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  configuredById: string;
  createdAt: string;
  updatedAt: string;
  configuredBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    invoices: number;
  };
}

export interface PermitConfig {
  id: string;
  name: string;
  code: string;
  category: {
    createdAt: string;
    description: string;
    id: string;
    isActive: boolean;
    name: string;
    slug: string;
    type: "LEVY" | "PERMIT";
    updatedAt: string;
  };
  baseAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    permits: number;
  };
}

export interface CreateLevyConfigData {
  name: string;
  mode: "fixed" | "variable";
  categoryId: string;
  description?: string;
  amount: number;
  billingCycle?: BillingCycle;
  penaltyRate?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface UpdateLevyConfigData {
  name?: string;
  description?: string;
  amount?: number;
  mode: "fixed" | "variable";
  billingCycle?: BillingCycle;
  penaltyRate?: number;
  effectiveTo?: string;
}

export interface CreatePermitConfigData {
  name: string;
  code: string;
  category: RevenueCategory;
  baseAmount: number;
}

export interface UpdatePermitConfigData {
  name?: string;
  code?: string;
  baseAmount?: number;
  isActive?: boolean;
}

// Revenue Analytics Types
export interface RevenueOverview {
  period: {
    from: string;
    to: string;
  };
  summary: {
    totalInvoiced: number;
    totalCollected: number;
    totalOutstanding: number;
    totalInvoices: number;
    collectionRate: string;
  };
  byCategory: Array<{
    category: RevenueCategory;
    invoiced: number;
    collected: number;
    invoiceCount: number;
  }>;
  byStatus: Array<{
    status: InvoiceStatus;
    totalAmount: number;
    invoiceCount: number;
  }>;
  byPaymentMethod: Array<{
    method: string;
    totalAmount: number;
    transactions: number;
  }>;
  dailyTrend: Array<{
    date: string;
    collected: number;
    transactions: number;
  }>;
}

export interface RevenueByOfficer {
  period: {
    from: string;
    to: string;
  };
  data: Array<{
    officer: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      contractorId?: string;
      contractor?: {
        id: string;
        firstName: string;
        lastName: string;
      };
    };
    collected: number;
    invoiced: number;
    transactions: number;
  }>;
}

export interface RevenueByWard {
  period: {
    from: string;
    to: string;
  };
  data: Array<{
    ward: {
      id: string;
      name: string;
      code: string;
    };
    invoiced: number;
    collected: number;
    invoiceCount: number;
  }>;
}

export interface ReconciliationReport {
  period: {
    from: string;
    to: string;
  };
  summary: {
    totalInvoiced: number;
    totalCollected: number;
    totalOutstanding: number;
    variance: number;
  };
  data: Array<{
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
    };
    payments: Array<{
      id: string;
      amount: number;
      method: string;
      confirmedAt: string;
    }>;
    receipt?: {
      id: string;
      receiptNumber: string;
    };
    createdBy: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InvoiceListResponse {
  data: Array<{
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    category: RevenueCategory;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    createdAt: string;
    dueDate: string;
    business?: {
      id: string;
      businessName: string;
      ownerName: string;
    };
    assignedOfficer?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    receipt?: {
      id: string;
      receiptNumber: string;
      issuedAt: string;
    };
    _count: {
      payments: number;
    };
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FieldOfficer {
  id: string;
  name: string;
  email: string;
  ward: string;
  levies: string[];
  invoicesIssued: number;
  totalCollected: number;
  status: "active" | "suspended" | "deactivated";
  createdBy: string;
  contractorId: string | null;
}

export interface FieldOfficersResponse {
  success: boolean;
  
    stats: {
      totalOfficers: number;
      active: number;
      suspended: number;
      totalCollected: number;
    };
    officers: FieldOfficer[];

}

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  category: RevenueCategory;
  description: string;
  subtotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  penaltyAmount: number;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  business?: {
    id: string;
    businessName: string;
    ownerName: string;
    phone: string;
    address: string;
  };
  assignedOfficer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  levyConfig?: {
    id: string;
    name: string;
    category: string;
    billingCycle: string;
    amount: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    reference: string;
    status: string;
    confirmedAt: string;
    createdAt: string;
  }>;
  receipt?: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
  };
  permit?: {
    id: string;
    permitNumber: string;
    status: string;
    validFrom: string;
    validTo: string;
  };
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

// Service functions
export const treasurerService = {
  // Levy Configurations
  createLevyConfig: (data: CreateLevyConfigData) =>
    api.post<{
      config: LevyConfig;
      warning?: string;
      existingConfigId?: string;
    }>("/treasurer/levy-configs", data),

  listLevyConfigs: (params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) =>
    api.get<LevyConfig[]>("/treasurer/levy-configs", {
      params,
    }),

  getLevyConfigById: (id: string) =>
    api.get<LevyConfig>(`/treasurer/levy-configs/${id}`),

  updateLevyConfig: (id: string, data: UpdateLevyConfigData) =>
    api.patch<LevyConfig>(`/treasurer/levy-configs/${id}`, data),

  toggleLevyConfig: (id: string) =>
    api.patch<LevyConfig>(`/treasurer/levy-configs/${id}/toggle`),

  // Permit Configurations
  listPermitConfigs: (params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) =>
    api.get<PermitConfig[]>("/treasurer/permit-configs", {
      params,
    }),

  createPermitConfig: (data: CreatePermitConfigData) =>
    api.post<PermitConfig>("/treasurer/permit-configs", data),

  updatePermitConfig: (id: string, data: UpdatePermitConfigData) =>
    api.patch<PermitConfig>(`/treasurer/permit-configs/${id}`, data),

  // Revenue Analytics
  getRevenueOverview: (params?: { from?: string; to?: string }) =>
    api.get<RevenueOverview>("/treasurer/revenue", { params }),

  getRevenueByOfficer: (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => api.get<RevenueByOfficer>("/treasurer/revenue/by-officer", { params }),

  getFieldOfficers: (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => api.get<FieldOfficersResponse>("/treasurer/field-officers", { params }),

  getRevenueByWard: (params?: { from?: string; to?: string }) =>
    api.get<RevenueByWard>("/treasurer/revenue/by-ward", { params }),

  // Reconciliation
  getReconciliation: (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => api.get<ReconciliationReport>("/treasurer/reconciliation", { params }),

  // Invoice Management
  getAllInvoices: (params?: {
    from?: string;
    to?: string;
    status?: InvoiceStatus;
    category?: RevenueCategory;
    officerId?: string;
    businessId?: string;
    page?: number;
    limit?: number;
  }) => api.get<InvoiceListResponse>("/treasurer/invoices", { params }),

  getInvoiceById: (id: string) =>
    api.get<InvoiceDetails>(`/treasurer/invoices/${id}`),

  markInvoiceOverdue: (id: string) =>
    api.patch<InvoiceDetails>(`/treasurer/invoices/${id}/mark-overdue`),
};
