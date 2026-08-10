/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../lib/api";

// Types based on your controller
export type ApplicationStatus = 
  | "pending"
  | "submitted"
  | "payment_pending"
  | "paid"
  | "under_review"
  | "forwarded_to_councillor"
  | "approved"
  | "rejected"
  | "certificate_issued";

export type ComplaintStatus = "open" | "in_progress" | "resolved" | "closed";
export type PermitStatus = "pending_payment" | "issued" | "expired" | "revoked";

export interface ChairmanMetrics {
  // Core Management Metrics
  totalRevenue: number;
  activePermits: number;
  overdueInvoices: number;
  wardCoverage: number;
  
  // Specific Chairman UI Data Points
  pendingApplications: number;
  approvedCertificates: number;
  pendingComplaints: number;
  activeOfficersCount: number;
  totalInvoicesCount: number;
  pendingBillsCount: number;
}

export interface ChairmanOverviewResponse {
  success: boolean;
  role: string;
  metrics: ChairmanMetrics;
}

export interface RevenueTrendResponse {
  period: {
    from: string;
    to: string;
  };
  byCategory: Array<{
    category: string;
    invoiced: number;
    collected: number;
    invoiceCount: number;
  }>;
  dailyTrend: Array<{
    date: string;
    collected: number;
    transactions: number;
  }>;
}

export interface WardPerformance {
    wards:{

        id: string;
        name: string;
        code: string;
        description?: string;
        councillor?: {
            id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
};
_count: {
    complaints: number;
    stateOfOriginApplications: number;
    businesses: number;
}
  };
}

export interface ApplicationStatsResponse {
  byStatus: Record<ApplicationStatus, number>;
  byWard: Array<{
    ward: {
      id: string;
      name: string;
      code: string;
    };
    count: number;
  }>;
}

export interface ComplaintOverviewResponse {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  breakdown: Record<ComplaintStatus, number>;
  topWards: Array<{
    ward: {
      id: string;
      name: string;
    };
    count: number;
  }>;
}

// Service functions
export const chairmanService = {
  // Get chairman dashboard overview
  getChairmanOverview: (params?: { from?: string; to?: string }) =>
    api.get<ChairmanOverviewResponse>("/chairman/overview", { params }),
  
  // Get revenue trend data
  getRevenueTrend: (params?: { from?: string; to?: string }) =>
    api.get<RevenueTrendResponse>("/chairman/revenue", { params }),
  
  // Get ward performance data
  getWardPerformance: () =>
    api.get<any>("/chairman/wards"),
  
  // Get application statistics
  getApplicationStats: () =>
    api.get<ApplicationStatsResponse>("/chairman/applications"),
  
  // Get complaint overview
  getComplaintOverview: () =>
    api.get<ComplaintOverviewResponse>("/chairman/complaints"),
};