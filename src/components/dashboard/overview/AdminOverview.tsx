import React from "react";
import { StatCard, StatusBadge } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  FileText,
  Users,
  FileBadge,
  BarChart3,
  UserCog,
  Loader2,
  Receipt,
} from "lucide-react";

import { useAdminOverview } from "@/hooks/queries/useLgaAdmin";
import { QuickActions } from "@/components/dashboard/DashboardWidgets";
import Link from "next/link";

function AdminOverview() {
  const { stats, recentApplications, isLoading, error } = useAdminOverview();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load overview data</p>
      </div>
    );
  }

  // console.log(recentApplications, "recentApplications");
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Citizens"
          value={stats.citizens.toLocaleString()}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Field Officers"
          value={stats.fieldOfficers.toLocaleString()}
          icon={UserCog}
          color="success"
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplications.toLocaleString()}
          icon={FileText}
          color="warning"
        />
        <StatCard
          label="Total Invoices"
          value={stats.totalInvoices.toLocaleString()}
          icon={Receipt}
          color="info"
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border/40 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Applications Awaiting Review</h3>
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard/applications">View all</Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications?.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.id}</TableCell>
                  <TableCell>{a.applicant}</TableCell>
                  <TableCell>{a.ward}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <QuickActions
          items={[
            {
              icon: FileText,
              label: "Services",
              to: "/dashboard/services",
            },
            {
              icon: UserCog,
              label: "Officers",
              to: "/dashboard/field-officers",
            },
            {
              icon: FileBadge,
              label: "Applications",
              to: "/dashboard/applications",
            },
            { icon: BarChart3, label: "Reports", to: "/dashboard/reports" },
            { icon: Users, label: "Customers", to: "/dashboard/customers" },
          ]}
        />
      </div>
    </>
  );
}

export default AdminOverview;
