import { api } from "../lib/api";

// Types based on your controller
export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "declaration_accepted"
  | "application_created"
  | "application_submitted"
  | "field_inspection_logged"
  | "treasury_assessed"
  | "invoice_created"
  | "invoice_adjusted"
  | "invoice_cancelled"
  | "payment_confirmed"
  | "payment_reversed"
  | "receipt_generated"
  | "receipt_verified"
  | "approval_granted"
  | "correction_requested"
  | "application_rejected"
  | "certificate_issued"
  | "certificate_revoked"
  | "permit_issued"
  | "permit_revoked"
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "user_suspended"
  | "user_reactivated"
  | "pricing_updated"
  | "complaint_logged"
  | "complaint_assigned"
  | "complaint_resolved";

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
  pagination: {
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