import { api } from "@/lib/api";
import { MOCK_MODE, tick } from "./_mock";
import { getStoreSnapshot, type AuditLog as StoreAuditLog } from "@/lib/store";

export type AuditLog = StoreAuditLog;
export type ActivityLog = StoreAuditLog;

export interface ReportFilters {
  from?: string;
  to?: string;
  ward?: string;
  levy?: string;
  channel?: string;
}

export const auditService = {
  listActivity: async (_filters?: ReportFilters): Promise<ActivityLog[]> => {
    if (MOCK_MODE) return tick(getStoreSnapshot().audits);
    return api.get<ActivityLog[]>("/activity-logs", { params: _filters });
  },

  listAudit: async (_filters?: ReportFilters): Promise<AuditLog[]> => {
    if (MOCK_MODE) return tick(getStoreSnapshot().audits);
    return api.get<AuditLog[]>("/audit-logs", { params: _filters });
  },

  collectionsReport: async (_filters?: ReportFilters) => {
    if (MOCK_MODE) {
      const receipts = getStoreSnapshot().receipts;
      const total = receipts.reduce((s, r) => s + r.amount, 0);
      return tick({ total, rows: receipts.map((r) => ({ ...r })) });
    }
    return api.get<{ total: number; rows: Array<Record<string, unknown>> }>(
      "/reports/collections",
      { params: _filters },
    );
  },
};
