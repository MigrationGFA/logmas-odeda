import { api } from "../lib/api";

// Enums based on your Prisma schema
export type Role =
  | "citizen"
  | "business_owner"
  | "treasurer"
  | "lga_admin"
  | "chairman"
  | "ward_councillor"
|"agent"
  | "contractor"
  | "field_officer"
  | "super_admin"
  | "auditor";

export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";
export type PermitStatus = "pending" | "issued" | "expired" | "revoked";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "forwarded_to_councillor";
export type ComplaintStatus = "open" | "in_progress" | "closed";

// Citizen Metrics
export interface CitizenMetrics {
  pendingPayments: number;
  approvedApplications: number;
  openComplaints: number;
  recentApplications: Array<{
    id: string;
    status: ApplicationStatus;
    createdAt: string;
    [key: string]: unknown;
  }>;
}
export interface BusinessOwnerMetrics {
  activeNotices: number;
  totalPaid: number;
  outstanding: number;
  activePermits: number;
}

export interface BusinessOwnerOverview {
  metrics: BusinessOwnerMetrics;
  recentInvoices: Array<{
    reference: string;
    amount: number;
    customerName: string;
    status: "Active" | "Inactive";
  }>;
}

// Management Cadre Metrics (Treasurer, LGA Admin, Chairman)
export interface ManagementMetrics {
  totalRevenue: number;
  activePermits: number;
  overdueInvoices: number;
  wardCoverage: number;
}

export interface ContractorInvoice {
  id: string;
  invoiceNumber: string;
  status: "paid" | "overdue" | "unpaid";
  amount: number;
  balanceDue: number;
  customerName: string;
  createdAt: string;
}

export interface ContractorReceipt {
  id: string;
  invoiceId: string;
  amount: number;
  createdAt: string;
}

export interface ContractorOfficer {
  id: string;
  name: string;
  phone: string | null;
  status: "active" | "inactive";
}

export interface ContractorRevenueTrend {
  month: string;
  amount: number;
}

export interface ContractorOverviewData {
  invoices: ContractorInvoice[];
  receipts: ContractorReceipt[];
  officers: ContractorOfficer[];
  revenueTrend: ContractorRevenueTrend[];
  role:Role,
  success:boolean
}

// Ward Councillor Metrics
export interface CouncillorMetrics {
  totalConstituents: number;
  pendingApprovals: number;
  approvedSOO: number;
  totalComplaints: number;
}

export interface CouncillorApplication {
  id: string;
  applicant: string;
  ward: string;
  status: string;
}

export interface CouncillorOverviewData {
  metrics: CouncillorMetrics;
  applications: CouncillorApplication[];
}

export interface TreasurerMetrics {
  totalRevenue: number;
  pendingAmount: number;
  activeOfficers: number;
  transactionCount: number;
}

export interface AuditorMetrics {
  totalCollected: number;
  outstanding: number;
  receiptsAudited: number;
  auditEvents: number;
  permitsIssued: number;
  permitsPending: number;
  cashShare: number;
  activeOfficers: number;
  cashCollected: number;
  digitalCollected: number;
}

export interface Anomaly {
  id: string;
  reference: string;
  customerName: string;
  amount: number;
}

export interface HighValueTransaction {
  id: string;
  receiptNumber: string;
  customerName: string;
  levyType: string;
  paymentMethod: string;
  amount: number;
}

export interface RecentAudit {
  id: string;
  action: string;
  target: string;
  actor: string;
  actorRole: string;
  createdAt: string;
}


// Field Officer Metrics
export interface FieldOfficerMetrics {
  totalInvoicesGenerated: number;
  totalCollected: number;
  pendingCount: number;
  overdueCount: number;
  channelBreakdown: {
    cash: number;
    pos: number;
    online: number;
    transfer: number;
  };
}

// Default/Other Roles
export interface DefaultMetrics {
  message?: string;
  metrics?: Record<string, never>;
}

// Union type for all possible metric responses
export type DashboardMetrics =
  | {
      metrics: CitizenMetrics;
      recentApplications?: Array<{ id: string; status: ApplicationStatus; createdAt: string }>;
    }
  | {
      metrics: BusinessOwnerMetrics;
      recentInvoices: Array<{
        reference: string;
        amount: number;
        customerName: string;
        status: string;
      }>;
    }
  | { metrics: ManagementMetrics }
  | { metrics: CouncillorMetrics }
  | {
      metrics: TreasurerMetrics;
      revenueTrendChart: Array<{ date: string; amount: number }>;
      categoryBreakdown: Array<{ category: string; amount: number }>;
    }
  | { 
      contractorData: ContractorOverviewData;  // New: Full contractor data for UI
    }
  | { metrics: FieldOfficerMetrics }
  | { metrics: DefaultMetrics; message?: string }   | {
      metrics: AuditorMetrics;
      anomalies: Anomaly[];
      highValueTransactions: HighValueTransaction[];
      recentAudits: RecentAudit[];
    }

// API Response Types
export interface DashboardOverviewResponse {
  success: boolean;
 invoices: ContractorInvoice[];
  receipts: ContractorReceipt[];
  officers: ContractorOfficer[];
  revenueTrend: ContractorRevenueTrend[];
  applications?: CouncillorApplication[];  
  role:Role,
  metrics: DashboardMetrics[keyof DashboardMetrics];
  recentInvoices?: Array<{
    reference: string;
    amount: number;
    customerName: string;
    status: string;
  }>;
  //  contractorData?: ContractorOverviewData;  
  revenueTrendChart: Array<{ date: string; amount: number }>;
  categoryBreakdown: Array<{ category: string; amount: number }>;
  recentApplications?: Array<{ id: string; status: ApplicationStatus; createdAt: string }>;
  anomalies?: Anomaly[];
  highValueTransactions?: HighValueTransaction[];
  recentAudits?: RecentAudit[];
  message?: string;
}

// Helper type to extract metrics based on role
export type MetricsByRole<T extends Role> = T extends "citizen"
  ? CitizenMetrics
  : T extends "business_owner"
    ? BusinessOwnerMetrics
    : T extends "lga_admin" | "chairman"
      ? ManagementMetrics
      : T extends "treasurer"
        ? TreasurerMetrics
        : T extends "ward_councillor"
          ? CouncillorMetrics
          // : T extends "contractor"
          //   ? ContractorMetrics
            : T extends "field_officer"
              ? FieldOfficerMetrics
              : DefaultMetrics;

import { tokenManager } from "./apiAuth";

function getMockDashboardOverview(): DashboardOverviewResponse {
  const user = tokenManager.getUser();
  const role = (user?.role || "super_admin") as Role;

  const defaultRevenueTrend = [
    { date: "Jan", amount: 1800000 },
    { date: "Feb", amount: 2200000 },
    { date: "Mar", amount: 2100000 },
    { date: "Apr", amount: 2500000 },
    { date: "May", amount: 3800000 },
  ];

  const defaultCategoryBreakdown = [
    { category: "Market Tolls & Levies", amount: 4500000 },
    { category: "Building Approvals", amount: 3200000 },
    { category: "Business Trade Permits", amount: 2800000 },
    { category: "Solid Minerals / Haulage", amount: 1950000 },
  ];

  if (role === "citizen") {
    return {
      success: true,
      role: "citizen",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: [],
      categoryBreakdown: [],
      metrics: {
        pendingPayments: 0,
        approvedApplications: 2,
        openComplaints: 0,
        recentApplications: [
          { id: "soo-001", status: "approved", createdAt: "2026-08-01" },
        ],
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  if (role === "business_owner") {
    return {
      success: true,
      role: "business_owner",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: [],
      categoryBreakdown: [],
      metrics: {
        activeNotices: 1,
        totalPaid: 120000,
        outstanding: 25000,
        activePermits: 2,
      } as unknown as DashboardMetrics["metrics"],
      recentInvoices: [
        { reference: "INV-BIZ-201", amount: 25000, customerName: "Bola Enterprises", status: "Active" },
      ],
    };
  }

  if (role === "ward_councillor") {
    return {
      success: true,
      role: "ward_councillor",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: [],
      categoryBreakdown: [],
      applications: [
        { id: "app-1", applicant: "Kehinde Adeyemi", ward: "Ward 1 (Odeda Secretariat)", status: "pending" },
        { id: "app-2", applicant: "Chinedu Okafor", ward: "Ward 1 (Odeda Secretariat)", status: "approved" },
      ],
      metrics: {
        totalConstituents: 14200,
        pendingApprovals: 3,
        approvedSOO: 48,
        totalComplaints: 2,
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  if (role === "auditor") {
    return {
      success: true,
      role: "auditor",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: defaultRevenueTrend,
      categoryBreakdown: defaultCategoryBreakdown,
      anomalies: [
        { id: "anom-1", reference: "INV-2026-092", customerName: "Odeda Granite Quarry", amount: 450000 },
      ],
      highValueTransactions: [
        { id: "hvt-1", receiptNumber: "REC-884920", customerName: "Osiele Modern Market Co.", levyType: "Trade Permit", paymentMethod: "Digital Transfer", amount: 250000 },
      ],
      recentAudits: [
        { id: "aud-1", action: "Receipt Audit Verified", target: "REC-884920", actor: "Folake Auditor", actorRole: "auditor", createdAt: "2026-08-05T14:20:00Z" },
      ],
      metrics: {
        totalCollected: 12450000,
        outstanding: 1450000,
        receiptsAudited: 284,
        auditEvents: 42,
        permitsIssued: 310,
        permitsPending: 15,
        cashShare: 35,
        activeOfficers: 12,
        cashCollected: 4350000,
        digitalCollected: 8100000,
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  if (role === "treasurer") {
    return {
      success: true,
      role: "treasurer",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: defaultRevenueTrend,
      categoryBreakdown: defaultCategoryBreakdown,
      metrics: {
        totalRevenue: 12450000,
        pendingAmount: 1450000,
        activeOfficers: 14,
        transactionCount: 382,
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  if (role === "field_officer") {
    return {
      success: true,
      role: "field_officer",
      invoices: [],
      receipts: [],
      officers: [],
      revenueTrend: [],
      revenueTrendChart: [],
      categoryBreakdown: [],
      recentInvoices: [
        { reference: "INV-FO-101", amount: 15000, customerName: "Odeda Central Store", status: "Active" },
        { reference: "INV-FO-102", amount: 25000, customerName: "Osiele Agro Processing", status: "Active" },
      ],
      metrics: {
        totalInvoicesGenerated: 64,
        totalCollected: 840000,
        pendingCount: 5,
        overdueCount: 2,
        channelBreakdown: { cash: 240000, pos: 350000, online: 150000, transfer: 100000 },
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  if (role === "contractor" || role === "agent") {
    return {
      success: true,
      role: "contractor",
      invoices: [
        { id: "inv-1", invoiceNumber: "INV-OD-001", status: "paid", amount: 85000, balanceDue: 0, customerName: "Camp/FUNAAB Retail Center", createdAt: "2026-08-01" },
        { id: "inv-2", invoiceNumber: "INV-OD-002", status: "unpaid", amount: 45000, balanceDue: 45000, customerName: "Osiele Timber Hub", createdAt: "2026-08-03" },
      ],
      receipts: [
        { id: "rec-1", invoiceId: "inv-1", amount: 85000, createdAt: "2026-08-01" },
      ],
      officers: [
        { id: "off-1", name: "Tunji Field", phone: "08055556666", status: "active" },
      ],
      revenueTrend: [
        { month: "Jan", amount: 350000 },
        { month: "Feb", amount: 480000 },
        { month: "Mar", amount: 520000 },
      ],
      revenueTrendChart: defaultRevenueTrend,
      categoryBreakdown: defaultCategoryBreakdown,
      metrics: {
        totalRevenue: 1350000,
        activePermits: 12,
        overdueInvoices: 2,
        wardCoverage: 4,
      } as unknown as DashboardMetrics["metrics"],
    };
  }

  return {
    success: true,
    role: role,
    invoices: [],
    receipts: [],
    officers: [],
    revenueTrend: [],
    revenueTrendChart: defaultRevenueTrend,
    categoryBreakdown: defaultCategoryBreakdown,
    metrics: {
      totalRevenue: 12450000,
      activePermits: 412,
      overdueInvoices: 18,
      wardCoverage: 10,
    } as unknown as DashboardMetrics["metrics"],
  };
}

// Service functions
export const overviewService = {
  // Get dashboard overview for current user
  getDashboardOverview: async (): Promise<DashboardOverviewResponse> => {
    try {
      return await api.get<DashboardOverviewResponse>("/dashboard/overview");
    } catch {
      return getMockDashboardOverview();
    }
  },

  // Type-safe getter for specific role
  getOverviewForRole: async <T extends Role>(
    role: T,
  ): Promise<{
    success: boolean;
    role: T;
    metrics: MetricsByRole<T>;
  }> => {
    try {
      const response = await api.get<DashboardOverviewResponse>("/dashboard/overview");
      if (response.role !== role) {
        throw new Error(`Role mismatch: expected ${role}, got ${response.role}`);
      }
      return response as unknown as {
        success: boolean;
        role: T;
        metrics: MetricsByRole<T>;
      };
    } catch {
      const mock = getMockDashboardOverview();
      return {
        success: true,
        role: role,
        metrics: mock.metrics as unknown as MetricsByRole<T>,
      };
    }
  },
};

// Helper functions for type checking
export const isCitizenMetrics = (metrics: unknown): metrics is CitizenMetrics => {
  return (
    typeof metrics === "object" &&
    metrics !== null &&
    "pendingPayments" in metrics &&
    "approvedApplications" in metrics &&
    "openComplaints" in metrics
  );
};

export const isBusinessOwnerMetrics = (metrics: unknown): metrics is BusinessOwnerMetrics => {
  return (
    typeof metrics === "object" &&
    metrics !== null &&
    "activePermits" in metrics &&
    "pendingPayments" in metrics &&
    "approvedApplications" in metrics &&
    "openComplaints" in metrics
  );
};

export const isManagementMetrics = (metrics: unknown): metrics is ManagementMetrics => {
  return (
    typeof metrics === "object" &&
    metrics !== null &&
    "totalRevenue" in metrics &&
    "activePermits" in metrics &&
    "overdueInvoices" in metrics &&
    "wardCoverage" in metrics
  );
};

export const isCouncillorMetrics = (metrics: unknown): metrics is CouncillorMetrics => {
  return (
    typeof metrics === "object" &&
    metrics !== null &&
    "pendingApprovals" in metrics &&
    "wardComplaints" in metrics
  );
};

// export const isContractorMetrics = (metrics: unknown): metrics is ContractorMetrics => {
//   return (
//     typeof metrics === "object" &&
//     metrics !== null &&
//     "managedAgents" in metrics &&
//     "totalCollections" in metrics
//   );
// };

// Update the runtime type-guard check function below
export const isFieldOfficerMetrics = (metrics: unknown): metrics is FieldOfficerMetrics => {
  return (
    typeof metrics === "object" &&
    metrics !== null &&
    "totalInvoicesGenerated" in metrics &&
    "totalCollected" in metrics &&
    "pendingCount" in metrics &&
    "overdueCount" in metrics &&
    "channelBreakdown" in metrics
  );
};
