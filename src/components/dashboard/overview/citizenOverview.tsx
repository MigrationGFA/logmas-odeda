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
  CreditCard,
  FileBadge,
  CheckCircle2,
  MessageSquare,
  Receipt,
  Stamp,
  ShieldCheck,
} from "lucide-react";
import { useOverview } from "@/hooks/queries/useOverview";
import { format } from "date-fns";
import { Role } from "@/services/apiOverview";
import Link from "next/link";
import { QuickActions } from "@/app/(dashboard)/dashboard/page";

function CitizenOverview({ role }: { role: Role }) {
  // const pending = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  const { citizenMetrics } = useOverview(role);

  const pending = citizenMetrics?.pendingPayments ?? 0;
  const approvedApplications = citizenMetrics?.approvedApplications ?? 0;
  const openComplaints = citizenMetrics?.openComplaints ?? 0;

  // console.log("Citizen Metrics:", citizenMetrics);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Applications"
          value={String(approvedApplications)}
          icon={FileBadge}
          color="primary"
        />
        <StatCard
          label="Pending Bills"
          value={`₦${pending.toLocaleString()}`}
          icon={Clock}
          color="warning"
        />
        {/* hasnt been done yet */}
        <StatCard
          label="Receipts"
          value={String("0")}
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          label="Complaints"
          value={String(openComplaints)}
          icon={MessageSquare}
          color="info"
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border/40 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Apply for State of Origin</h3>
            <Button asChild size="sm" className="bg-gradient-hero">
              <Link href="/dashboard/applications">Apply now</Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citizenMetrics?.recentApplications?.slice(0, 3).map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{`APP-${a.id.split("-")[1]}`}</TableCell>
                  <TableCell>State of Origin</TableCell>
                  <TableCell>{format(a.createdAt, "MMM dd, yyyy")}</TableCell>
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
              icon: FileBadge,
              label: "Apply for State of Origin",
              to: "/dashboard/applications",
            },
            // {
            //   icon: Stamp,
            //   label: "Apply for Trade Permit",
            //   to: "/dashboard/permits/new",
            // },
            {
              icon: CreditCard,
              label: "Pay Fees",
              to: "/dashboard/invoices",
            },
            {
              icon: MessageSquare,
              label: "Raise Complaint",
              to: "/dashboard/complaints",
            },
            { icon: Receipt, label: "My Receipts", to: "/dashboard/receipts" },
            // {
            //   icon: ShieldCheck,
            //   label: "Verify Permit",
            //   to: "/permits/verify",
            // },
          ]}
        />
      </div>
    </>
  );
}

export default CitizenOverview;
