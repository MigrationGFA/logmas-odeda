import { useQuery } from "@tanstack/react-query";
import { auditService, type ReportFilters } from "@/services/audit";

export function useActivityLogs(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["activity-logs", filters ?? {}],
    queryFn: () => auditService.listActivity(filters),
  });
}

export function useAuditLogs(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["audit-logs", filters ?? {}],
    queryFn: () => auditService.listAudit(filters),
  });
}

export function useCollectionsReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "collections", filters ?? {}],
    queryFn: () => auditService.collectionsReport(filters),
  });
}
