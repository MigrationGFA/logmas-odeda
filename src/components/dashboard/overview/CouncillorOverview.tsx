
"use client"
import { useOverview } from "@/hooks/queries/useOverview";
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
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Role } from "@/services/apiOverview";
import Link from "next/link";

interface CouncillorOverviewProps {
  role: Role;
}

function CouncillorOverview({ role }: CouncillorOverviewProps) {
  const { councillorMetrics, isLoading, error } = useOverview(role);

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !councillorMetrics) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load ward data</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const { metrics, applications } = councillorMetrics;

  // Filter applications that are forwarded for approval (not declined)
  const forwardedApplications = applications.filter(
    (app) => app.status.toLowerCase() !== "rejected"
  );

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Constituents"
          value={String(metrics.totalConstituents)}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Pending Approvals"
          value={String(metrics.pendingApprovals)}
          icon={Clock}
          color="warning"
        />
        <StatCard
          label="Approved"
          value={String(metrics.approvedSOO)}
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          label="Complaints"
          value={String(metrics.totalComplaints)}
          icon={MessageSquare}
          color="info"
        />
      </div>

      <Card className="p-6 bg-gradient-card border-border/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Forwarded for Final Approval</h3>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/applications">Review</Link>
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
            {forwardedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No applications forwarded for approval
                </TableCell>
              </TableRow>
            ) : (
              forwardedApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>{app.applicant}</TableCell>
                  <TableCell>{app.ward}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default CouncillorOverview;