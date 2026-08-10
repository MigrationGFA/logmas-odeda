import { api } from "../lib/api";

// Types based on your controller
export type PaymentMethod = "bank_transfer" | "pos" | "cash" | "online_gateway" | "virtual_account";
export type InvoiceStatus = "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";

export interface ReportsPeriod {
  from: string;
  to: string;
}

export interface ReportsStats {
  totalRevenue: number;
  byMethod: {
    transfer: number;
    pos: number;
    cash: number;
    online: number;
  };
}

export interface ByLevyItem {
  levy: string;
  transactions: number;
  revenue: number;
}
export interface ByServiceType {
  type: string;
  transactions: number;
  revenue: number;
  label:string
}

export interface ByOfficerItem {
  id: string | null;
  name: string;
  ward: string;
  invoicesIssued: number;
  totalCollected: number;
  totalInvoiced: number;
}

export interface ReportInvoice {
  id: string;
  reference: string;
  customerName: string;
  levyType: string;
  status: InvoiceStatus;
  amount: number;
  dueDate: string;
  paidAt: string | null;
}

export interface ReportReceipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  paymentMethod: string;
  officerName: string;
  amount: number;
  levyType: string;
  paidAt: string;
}

export interface ReportsOverviewResponse {
  period: ReportsPeriod;
  stats: ReportsStats;
  byLevy: ByLevyItem[];
  byServiceType: ByServiceType[];
  byOfficer: ByOfficerItem[];
  invoices: ReportInvoice[];
  receipts: ReportReceipt[];
}

export interface ExportInvoice {
  reference: string;
  customerName: string;
  levyType: string;
  status: InvoiceStatus;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  createdAt: string;
}

export interface ExportReceipt {
  receiptNumber: string;
  customerName: string;
  levyType: string;
  paymentMethod: string;
  officerName: string;
  amount: number;
  paidAt: string;
}

// Service functions
export const reportsService = {
  // Get reports overview (all data in one call)
  getReportsOverview: (params?: { from?: string; to?: string }) =>
    api.get<ReportsOverviewResponse>("/reports/overview", { params }),
  
  // Export invoices to CSV
  exportInvoices: (params?: { from?: string; to?: string }) =>
    api.get<ExportInvoice[]>("/reports/export/invoices", { params }),
  
  // Export receipts to CSV
  exportReceipts: (params?: { from?: string; to?: string }) =>
    api.get<ExportReceipt[]>("/reports/export/receipts", { params }),
};