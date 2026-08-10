"use client"
import { useState } from "react";
import { PageHeader, StatCard } from "@/components/dashboard/shared";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Download,
  TrendingUp,
  Banknote,
  CreditCard,
  Wallet,
  Calendar,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useReportsOverview, useReportsExport } from "@/hooks/queries/useReports";

// ── Preset definitions ──────────────────────────────────────────
// Each preset computes its own from/to as YYYY-MM-DD strings, sent as a custom
// range to the existing backend — no backend changes needed, since explicit
// from/to already overrides everything else server-side.
type PresetKey = "yesterday" | "this_month" | "last_month" | "last_6_months" | "all" | "custom";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];

function computePreset(key: PresetKey): { from?: string; to?: string } | undefined {
  const now = new Date();

  switch (key) {
    case "yesterday": {
      const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return { from: toDateStr(y), to: toDateStr(y) };
    }
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: toDateStr(start), to: toDateStr(now) };
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0); // day 0 = last day of prev month
      return { from: toDateStr(start), to: toDateStr(end) };
    }
    case "last_6_months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      return { from: toDateStr(start), to: toDateStr(now) };
    }
    case "all":
      return undefined; // no filter at all
    case "custom":
      return undefined; // handled separately via manual inputs
  }
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "yesterday", label: "Yesterday" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_6_months", label: "Last 6 Months" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom" },
];

export default function ReportsPage() {
  const [activePreset, setActivePreset] = useState<PresetKey>("this_month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState("levy");

  const [filterRange, setFilterRange] = useState<{ from?: string; to?: string } | undefined>(
    computePreset("this_month"),
  );

  const { data, stats, byLevy, byOfficer, byServiceType, invoices, receipts, isLoading, refetch } =
    useReportsOverview(filterRange);

  const { downloadCSV } = useReportsExport();

  const handlePresetClick = (key: PresetKey) => {
    setActivePreset(key);
    if (key === "custom") return; // wait for explicit Apply on custom range
    setFilterRange(computePreset(key));
  };

  const handleApplyCustom = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both a start and end date");
      return;
    }
    setFilterRange({ from: fromDate, to: toDate });
  };

  const handleExportInvoices = () => {
    if (!invoices || invoices.length === 0) {
      toast.error("No invoices to export");
      return;
    }
    const exportData = invoices.map((inv) => ({
      Reference: inv.reference,
      Customer: inv.customerName,
      Levy: inv.levyType,
      Status: inv.status,
      Amount: inv.amount,
      "Due Date": inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—",
      "Paid At": inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "—",
    }));
    downloadCSV(exportData, "invoices_export");
  };

  const handleExportReceipts = () => {
    if (!receipts || receipts.length === 0) {
      toast.error("No receipts to export");
      return;
    }
    const exportData = receipts.map((rec) => ({
      "Receipt Number": rec.receiptNumber,
      Customer: rec.customerName,
      Levy: rec.levyType,
      "Payment Method": rec.paymentMethod,
      Officer: rec.officerName,
      Amount: rec.amount,
      "Paid At": new Date(rec.paidAt).toLocaleDateString(),
    }));
    downloadCSV(exportData, "receipts_export");
  };

  const handleExportAll = () => {
    if (invoices.length === 0 && receipts.length === 0) {
      toast.error("No data to export");
      return;
    }
    handleExportInvoices();
    toast.info("Invoices exported. Receipts export also available in Receipts tab.");
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Reports & Analytics"
          subtitle="Exportable revenue, invoice and officer performance reports"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Exportable revenue, invoice and officer performance reports"
        action={
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-1.5" /> Export All
          </Button>
        }
      />

      {/* Period Filter — Paystack-style pill segmented control */}
      <Card className="p-4 mb-6 bg-gradient-card border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Period</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-muted/50 border border-border/40">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePresetClick(p.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activePreset === p.key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {data?.period && activePreset !== "custom" && (
            <span className="text-xs text-muted-foreground ml-1">
              {data.period.from && data.period.to
                ? `${new Date(data.period.from).toLocaleDateString()} – ${new Date(data.period.to).toLocaleDateString()}`
                : "All time"}
            </span>
          )}
        </div>

        {/* Custom range — only revealed when "Custom" is selected */}
        {activePreset === "custom" && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
            </div>
            <Button onClick={handleApplyCustom} size="sm">
              Apply
            </Button>
            {data?.period?.from && (
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(data.period.from).toLocaleDateString()} –{" "}
                {new Date(data.period.to).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          label="Online Gateway"
          value={`₦${(stats?.byMethod?.online || 0).toLocaleString()}`}
          icon={Wallet}
          color="primary"
        />
        <StatCard
          label="POS"
          value={`₦${(stats?.byMethod?.pos || 0).toLocaleString()}`}
          icon={CreditCard}
          color="info"
        />
        <StatCard
          label="Cash"
          value={`₦${(stats?.byMethod?.cash || 0).toLocaleString()}`}
          icon={Banknote}
          color="warning"
        />
      </div>

      <Tabs defaultValue={activeTab}>
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="type" onClick={() => setActiveTab("type")} className="gap-2">
              <TrendingUp className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">By Service Type</span>
            </TabsTrigger>
            <TabsTrigger value="levy" onClick={() => setActiveTab("levy")} className="gap-2">
              <Banknote className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">By Levy</span>
            </TabsTrigger>
            <TabsTrigger value="officer" onClick={() => setActiveTab("officer")} className="gap-2">
              <Wallet className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">By Officer</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" onClick={() => setActiveTab("invoices")} className="gap-2">
              <CreditCard className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" onClick={() => setActiveTab("receipts")} className="gap-2">
              <Download className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">Receipts</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === "invoices" && (
            <div className="flex justify-end mb-3">
              <Button size="sm" variant="outline" onClick={handleExportInvoices}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
              </Button>
            </div>
          )}
          {activeTab === "receipts" && (
            <div className="flex justify-end mb-3">
              <Button size="sm" variant="outline" onClick={handleExportReceipts}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
              </Button>
            </div>
          )}
        </div>

        {/* By Service Type Tab — the 3-way SOO/Permit/Levy breakdown */}
        <TabsContent value="type">
          <Card className="bg-gradient-card border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byServiceType.map((item) => {
                  const pct = stats?.totalRevenue
                    ? ((item.revenue / stats.totalRevenue) * 100).toFixed(1)
                    : "0.0";
                  return (
                    <TableRow key={item.type}>
                      <TableCell className="font-medium">{item.label}</TableCell>
                      <TableCell>{item.transactions}</TableCell>
                      <TableCell className="text-right font-mono">
                        ₦{item.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{pct}%</TableCell>
                    </TableRow>
                  );
                })}
                {byServiceType.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No revenue data available for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* By Levy Tab */}
        <TabsContent value="levy">
          <Card className="bg-gradient-card border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Levy Category</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byLevy.map((item) => (
                  <TableRow key={item.levy}>
                    <TableCell className="font-medium capitalize">
                      {item.levy.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>{item.transactions}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₦{item.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {byLevy.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No revenue data available for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* By Officer Tab */}
        <TabsContent value="officer">
          <Card className="bg-gradient-card border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byOfficer.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell className="font-medium">{officer.name}</TableCell>
                    <TableCell>{officer.ward}</TableCell>
                    <TableCell>{officer.invoicesIssued}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₦{officer.totalCollected.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {byOfficer.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No officer data available for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card className="bg-gradient-card border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Levy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.reference}</TableCell>
                    <TableCell>{i.customerName}</TableCell>
                    <TableCell>{i.levyType}</TableCell>
                    <TableCell className="capitalize">{i.status}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₦{i.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No invoices found for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts">
          <Card className="bg-gradient-card border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.receiptNumber}</TableCell>
                    <TableCell>{r.customerName}</TableCell>
                    <TableCell className="uppercase">{r.paymentMethod}</TableCell>
                    <TableCell>{r.officerName || "—"}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₦{r.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {receipts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No receipts found for the selected period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}