/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, StatCard } from "@/components/dashboard/shared";
import { useAuditLogs, useAuditLogFilters } from "@/hooks/queries/useAuditor";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Search,
  FileText,
  Filter,
  Calendar,
  X,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { MANAGEABLE_ROLES, ROLE_LABELS } from "@/lib/auth";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const debouncedValue = useDebounce(search, 500);

  const { stats, logs, meta, isLoading, refetch } = useAuditLogs({
    search: debouncedValue || undefined,
    action: (actionFilter as any) || undefined,
    role: (roleFilter as any) || undefined,
    from: dateFrom || undefined,
    to: dateTo || undefined,
    page,
    limit: 10,
  });

  const { actionOptions } = useAuditLogFilters();

  const hasActiveFilters =
    !!search || !!actionFilter || !!roleFilter || !!dateFrom || !!dateTo;

  const handleApplyFilters = () => {
    setPage(1);
    refetch();
  };

  const handleClearResults = () => {
    setSearch("");
    setActionFilter("");
    setRoleFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setTimeout(() => refetch(), 0);
  };

  const getActionColor = (action: string): string => {
    const actionUpper = action.toUpperCase();
    if (actionUpper.includes("PAYMENT") || actionUpper.includes("RECEIPT")) {
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    }
    if (actionUpper.includes("USER") || actionUpper.includes("LOGIN")) {
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
    }
    if (actionUpper.includes("PERMIT") || actionUpper.includes("CERTIFICATE")) {
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400";
    }
    if (
      actionUpper.includes("FAILED") ||
      actionUpper.includes("REVOKED") ||
      actionUpper.includes("REJECTED")
    ) {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
    }
    return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "lga_admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "treasurer":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "chairman":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const isInitialLoading = isLoading && logs.length === 0;

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable record of every financial action across the platform."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isInitialLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Total Events"
              value={String(stats.total)}
              icon={Activity}
              color="primary"
            />
            <StatCard
              label="Payment Events"
              value={String(stats.paymentEvents)}
              icon={ShieldCheck}
              color="success"
            />
            <StatCard
              label="Permit Events"
              value={String(stats.permitEvents)}
              icon={FileText}
              color="info"
            />
            <StatCard
              label="Suspicious / Reversed"
              value={String(stats.suspicious)}
              icon={AlertTriangle}
              color="destructive"
            />
          </>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by action, actor, role, target"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          {hasActiveFilters ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearResults}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Results
            </Button>
          ) : (
            <Button size="sm" onClick={handleApplyFilters}>
              Apply
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Action Type
              </label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Actor Role
              </label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {MANAGEABLE_ROLES.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {ROLE_LABELS[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Date From
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Date To
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Audit Logs Table */}
      <Card className="mt-4 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Who</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                {/* <TableHead>Meta</TableHead> */}
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-7 w-12 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {log.actor}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant="outline"
                          className={getRoleColor(log.actorRole)}
                        >
                          {log.actorRole?.replace(/_/g, " ") || "System"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${getActionColor(log.action)}`}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                    
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setSelectedLog(log)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No audit events found.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * meta.limit + 1}-
              {Math.min(page * meta.limit, meta.total)} of {meta.total} events
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm py-2 px-3 tabular-nums">
                {page} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail dialog */}
      <AuditDetailDialog
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}

function AuditDetailDialog({
  log,
  open,
  onClose,
}: {
  log: any;
  open: boolean;
  onClose: () => void;
}) {
  if (!log) return null;

  const actionLabel = formatAction(log.action); // "PERMIT_REVOKED_BY_ADMIN" -> "Permit revoked by admin"
  const summary = buildSummary(log);            // one-line plain-English sentence
  const { known, rest } = splitMeta(log.meta);  // pull friendly fields out of meta

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-semibold">
            {actionLabel}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Primary facts — what a user actually cares about */}
          <section className="space-y-3">
            <Field label="When" value={formatDateTime(log.createdAt)} />
            <Field
              label="Who"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-medium">{log.actor ?? "System"}</span>
                  {log.actorRole && (
                    <Badge variant="outline" className="text-xs">
                      {humanizeRole(log.actorRole)}
                    </Badge>
                  )}
                </div>
              }
            />
            {log.entity && (
              <Field
                label="Related to"
                value={
                  <div>
                    <div className="capitalize">{log.entity}</div>
                    {log.entityId && (
                      <CopyableId value={log.entityId} />
                    )}
                  </div>
                }
              />
            )}
          </section>

          {/* Friendly meta — only show known keys with nice labels */}
          {known.length > 0 && (
            <section className="rounded-md border bg-muted/30 p-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Details
              </div>
              {known.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </section>
          )}

          {/* Unknown meta keys — collapsed, clearly "technical" */}
          {rest.length > 0 && (
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Technical details
              </summary>
              <dl className="mt-2 space-y-1">
                {rest.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 text-xs">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-mono break-all text-right">
                      {String(v)}
                    </dd>
                  </div>
                ))}
              </dl>
              {log.ipAddress && (
                <div className="mt-2 flex justify-between gap-4 text-xs">
                  <span className="text-muted-foreground">IP address</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              )}
            </details>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function CopyableId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      title={value}
    >
      <span className="font-mono truncate max-w-[220px]">{value}</span>
      <span className="text-[10px]">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

// ---- helpers ----

const KNOWN_META: Record<string, { label: string; format?: (v: any) => string }> = {
  amount:         { label: "Amount", format: (v) => formatNaira(v) },
  permitId:       { label: "Permit ID" },
  receiptNumber:  { label: "Receipt no." },
  reason:         { label: "Reason" },
  previousStatus: { label: "Previous status" },
  newStatus:      { label: "New status" },
  targetUser:     { label: "Target user" },
};

function splitMeta(meta: any) {
  if (!meta || typeof meta !== "object") return { known: [], rest: [] };
  const known: { label: string; value: string }[] = [];
  const rest: [string, any][] = [];
  for (const [k, v] of Object.entries(meta)) {
    const cfg = KNOWN_META[k];
    if (cfg) {
      known.push({ label: cfg.label, value: cfg.format ? cfg.format(v) : String(v) });
    } else {
      rest.push([k, v]);
    }
  }
  return { known, rest };
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function humanizeRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildSummary(log: any): string {
  // Optional: produce "Treasurer revoked permit PRM-1042" style sentence
  const who = log.actor ?? "System";
  const what = formatAction(log.action);
  return log.entity ? `${who} — ${what} on ${log.entity}` : `${who} — ${what}`;
}

function formatNaira(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? `₦${n.toLocaleString()}` : String(v);
}
