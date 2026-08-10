/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from 'react-haiku';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  KeyRound,
  ShieldCheck,
  ShieldOff,
  Users,
  UserCog,
  Crown,
  Building2,
  Wallet,
  Briefcase,
  UserCircle,
  Mail,
  Search,
  Loader2,
} from "lucide-react";
import { useLgaAdmin, useStaffManagement } from "@/hooks/queries/useLgaAdmin";
import { ROLE_LABELS } from "@/lib/auth";
import CreateAccountDialog, {
  ResetPasswordDialog,
  SuspendAccountDialog,
} from "@/components/lgaAdmin/CreateAccountDialog";
import { tokenManager } from "@/services/apiAuth";


type AccountStatus = "active" | "suspended" | "pending_reset";

const ROLE_ICON: Record<string, any> = {
  super_admin: ShieldCheck,
  chairman: Crown,
  lga_admin: Building2,
  treasurer: Wallet,
  auditor: ShieldCheck,
  ward_councillor: UserCog,
  contractor: Briefcase,
  field_officer: UserCog,
  citizen: UserCircle,
  business_owner: Building2,
};

export const MANAGEABLE_ROLES = [
  "chairman",
  "ward_councillor",
  "auditor",
  "treasurer",
  "contractor",
  "field_officer",
  "business_owner",
  "citizen",
];

export default function AccountsPage() {
  const user = tokenManager.getUser();
  const { accounts } = useLgaAdmin();
  const { useGetAccounts,} = accounts;
  const [search, setSearch] = useState("");
   const debouncedValue = useDebounce(search, 500)
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetAccounts({
    search: debouncedValue || undefined,
    role: (roleFilter as any) || undefined,
    page,
    limit: 20,
  });

  const userRole = user?.role;
  const canManage = userRole === "super_admin" || userRole === "lga_admin";

  const counts = data?.counts || { total: 0, active: 0, suspended: 0, pending: 0 };
  const accountsList = useMemo(() => data?.accounts || [], [data?.accounts]);
  const meta = data?.meta;

  // Filter accounts by role for tabs
  const filteredAccounts = useMemo(() => {
    if (!roleFilter || roleFilter === "all") return accountsList;
    return accountsList.filter((acc) => acc.role === roleFilter);
  }, [accountsList, roleFilter]);

  if (!canManage) {
    return (
      <div>
        <PageHeader title="Account Management" subtitle="Access restricted" />
        <EmptyState
          title="Access restricted"
          desc="Only Super Admins and LGA Admins can manage principal officer accounts."
        />
      </div>
    );
  }
  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case "active":
        return <Badge className="border-success/30 text-success bg-success/10">Active</Badge>;
      case "suspended":
        return (
          <Badge className="border-warning/30 text-warning-foreground bg-warning/10">
            Suspended
          </Badge>
        );
      case "pending_reset":
        return <Badge className="border-info/30 text-info bg-info/10">Pending Reset</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };



  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  return (
    <div>
      <PageHeader
        title="Account Management"
        subtitle="Create, reset, suspend and manage all principal officer & user accounts"
        action={<CreateAccountDialog onSuccess={() => refetch()} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Accounts"
          value={String(counts.total)}
          icon={Users}
          color="primary"
        />
        <StatCard label="Active" value={String(counts.active)} icon={ShieldCheck} color="success" />
        <StatCard
          label="Suspended"
          value={String(counts.suspended)}
          icon={ShieldOff}
          color="warning"
        />
        <StatCard
          label="Pending Reset"
          value={String(counts.pending)}
          icon={KeyRound}
          color="info"
        />
      </div>

      <Card className="p-4 bg-gradient-card border-border/40 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-3 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 flex-1"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {MANAGEABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs value={roleFilter || "all"} onValueChange={setRoleFilter}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {MANAGEABLE_ROLES.map((r) => (
            <TabsTrigger key={r} value={r}>
              {ROLE_LABELS[r as keyof typeof ROLE_LABELS] || r}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={roleFilter || "all"} className="mt-4">
          <Card className="p-0 bg-gradient-card border-border/40 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => {
                      const Icon = ROLE_ICON[account.role] || UserCircle;
                      return (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                                  {account.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium text-sm">{account.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {account.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              <Icon className="h-3 w-3" />
                              {ROLE_LABELS[account.role as keyof typeof ROLE_LABELS] ||
                                account.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{account.ward || "—"}</TableCell>
                          <TableCell>{getStatusBadge(account.status)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {account.lastLogin
                              ? new Date(account.lastLogin).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <ResetPasswordDialog
                                account={account}
                              />
                              {/* <Button
                                size="sm"
                                variant="outline"
                                // onClick={() => toggleStatus(a.id)}
                                // title={account.status === "active" ? "Suspend" : "Activate"}
                              >
                                {account.status === "active" ? (
                                  <>
                                    <ShieldOff className="h-3.5 w-3.5 mr-1" />
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-3.5 w-3.5 mr-1" />
                                  </>
                                )}
                              </Button> */}

                              <SuspendAccountDialog
                                account={account}
                              
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredAccounts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                          No accounts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm py-2 px-3">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
