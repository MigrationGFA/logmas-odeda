import { useQuery } from "@tanstack/react-query";
import { auditorService, GetAuditLogsParams, AuditAction } from "@/services/apiAuditor";

export const auditorKeys = {
  all: ["auditor"] as const,
  logs: () => [...auditorKeys.all, "logs"] as const,
  logsList: (params?: GetAuditLogsParams) => [...auditorKeys.logs(), params] as const,
  log: (id: string) => [...auditorKeys.all, "log", id] as const,
};

// Hook for audit logs list
export function useAuditLogs(params?: GetAuditLogsParams) {
  const {
    data: logsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: auditorKeys.logsList(params),
    queryFn: () => auditorService.getAuditLogs(params),
    staleTime: 30 * 1000, // 30 seconds - audit logs update frequently
  });


  console.log(logsResponse,"logsResponse");
  
  const stats = logsResponse?.stats || {
    total: 0,
    paymentEvents: 0,
    permitEvents: 0,
    suspicious: 0,
  };

  
  const logs = logsResponse?.data || [];
  const meta = logsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  };

  return {
    stats,
    logs,
    meta,
    isLoading,
    error,
    refetch,
    hasLogs: logs.length > 0,
  };
}

// Hook for single audit log details
export function useAuditLogDetails(id: string) {
  const {
    data: log,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: auditorKeys.log(id),
    queryFn: () => auditorService.getAuditLogById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    log,
    isLoading,
    error,
    refetch,
  };
}

// Hook for audit log filters
export function useAuditLogFilters() {
  // Get unique actions from existing logs (this would require a separate endpoint)
  // For now, return common actions
  const commonActions: AuditAction[] = [
    "user_created",
    "user_updated",
    "user_deleted",
    "login",
    "login_failed",
    "invoice_created",
    "invoice_edited",
    "payment_confirmed",
    "payment_reversed",
    "receipt_generated",
    "receipt_verified",
    "permit_issued",
    "permit_revoked",
    "application_submitted",
    "application_rejected",
    "certificate_issued",
    "pricing_updated",
  ];

  const actionOptions = commonActions.map((action) => ({
    value: action,
    label: action.replace(/_/g, ' ').toUpperCase(),
  }));

  return {
    actionOptions,
    commonActions,
  };
}