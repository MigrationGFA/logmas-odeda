import { api } from "../lib/api";

// Types based on your controller
export type AuditAction = 
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "login"
  | "login_failed"
  | "invoice_created"
  | "invoice_edited"
  | "payment_confirmed"
  | "payment_reversed"
  | "receipt_generated"
  | "receipt_verified"
  | "permit_issued"
  | "permit_revoked"
  | "application_submitted"
  | "application_rejected"
  | "certificate_issued"
  | "pricing_updated";

export interface AuditLog {
  id: string;
  createdAt: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  meta: Record<string, unknown>;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  email?: string | null;
}

export interface AuditLogStats {
  total: number;
  paymentEvents: number;
  permitEvents: number;
  suspicious: number;
}

export interface AuditLogsResponse {
  stats: AuditLogStats;
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetAuditLogsParams {
  action?: AuditAction;
  userId?: string;
  entity?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogDetails extends AuditLog {
  entity: string;
  entityId: string;
  ipAddress: string;
  email: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// Service functions
export const auditorService = {
  // Get audit logs with filters
  getAuditLogs: (params?: GetAuditLogsParams) =>
    api.get<AuditLogsResponse>("/auditor/audit-logs", { params }),
  
  // Get single audit log by ID
  getAuditLogById: (id: string) =>
    api.get<AuditLogDetails>(`/auditor/audit-logs/${id}`),
};