import React from "react";
import { StatCard } from "../shared";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  MessageSquare,
  Receipt,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import { useOverview } from "@/hooks/queries/useOverview";
import { Role } from "@/lib/auth";
import { BusinessOwnerMetrics } from "@/services/apiOverview";
import { QuickActions, RecentInvoiceItem, RecentInvoices } from "@/app/(dashboard)/dashboard/page";

function BusinessOverview({ role }: { role: Role }) {
  const { businessMetrics } = useOverview(role);

  const metrics = businessMetrics?.metrics as BusinessOwnerMetrics | undefined;
  const recentInvoices = businessMetrics?.recentInvoices as RecentInvoiceItem[] | undefined;

  const activeNotices = metrics?.activeNotices ?? 0;
  const outstanding = metrics?.outstanding ?? 0;
  const activePermits = metrics?.activePermits ?? 0;
  const totalPaid = metrics?.totalPaid ?? 0;
  console.log("Business Metrics:", activeNotices);
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Notices"
          value={` ${activeNotices}`}
          icon={ScrollText}
          color="warning"
        />
        <StatCard
          label="Total Paid"
          value={` ${totalPaid}`}
          icon={TrendingUp}
        //   trend="+8%"
          color="success"
        />
        <StatCard label="Outstanding" value={` ${outstanding}`} icon={Clock} color="destructive" />
        <StatCard label="Permits" value={` ${activePermits}`} icon={CheckCircle2} color="primary" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <RecentInvoices limit={4} invoices={recentInvoices}/>
        <QuickActions
          items={[
            { icon: ScrollText, label: "Trade Permits", to: "/dashboard/permits" },
            { icon: CreditCard, label: "Pay Now", to: "/dashboard/invoices" },
            { icon: Receipt, label: "Receipts", to: "/dashboard/receipts" },
            { icon: MessageSquare, label: "Support", to: "/dashboard/complaints" },
          ]}
        />
      </div>
    </>
  );
}

export default BusinessOverview;
