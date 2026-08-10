/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StatCard, StatusBadge } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  Clock,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  DollarSign,
  CheckCircle2,
  RefreshCw,
  Building2,
  Phone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Role } from "@/services/apiOverview";
import { QuickActions } from "@/app/(dashboard)/dashboard/page";
import {
  getOdedaApplications,
  issueTreasuryInvoice,
  OdedaApplication,
} from "@/lib/odedaApplications";
import { tokenManager } from "@/services/apiAuth";
import { toast } from "sonner";
import Link from "next/link";

interface TreasurerOverviewProps {
  role: Role;
}

export default function TreasurerOverview({ role }: TreasurerOverviewProps) {
  const user = tokenManager.getUser();

  const [applications, setApplications] = useState<OdedaApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<OdedaApplication | null>(null);
  const [treasuryModalOpen, setTreasuryModalOpen] = useState(false);

  // Treasury Form
  const [approvedFee, setApprovedFee] = useState(10000);
  const [revenueHead, setRevenueHead] = useState("");
  const [treasuryNotes, setTreasuryNotes] = useState("");

  const loadApps = () => {
    setApplications(getOdedaApplications());
  };

  useEffect(() => {
    loadApps();
    const handleStoreChange = () => loadApps();
    window.addEventListener("odeda:applications-change", handleStoreChange);
    return () => window.removeEventListener("odeda:applications-change", handleStoreChange);
  }, []);

  // Compute live metrics from Odeda applications
  const metrics = useMemo(() => {
    const awaitingAssessment = applications.filter(
      (a) => a.status === "Inspection Completed" || a.status === "Awaiting Assessment"
    );
    const totalCollected = applications
      .filter((a) => a.paymentStatus === "paid")
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const pendingAmount = applications
      .filter((a) => a.paymentStatus === "unpaid" && a.amount > 0)
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const invoiceGeneratedCount = applications.filter(
      (a) => a.invoiceNumber || a.status === "Invoice Generated" || a.paymentStatus === "paid"
    ).length;

    // Calculate category revenue breakdown dynamically
    const categoryTotals: Record<string, number> = {};
    applications.forEach((app) => {
      const cat = app.category || "General Services";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (app.amount || 0);
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));

    return {
      awaitingAssessmentCount: awaitingAssessment.length,
      awaitingAssessmentList: awaitingAssessment,
      totalCollected,
      pendingAmount,
      invoiceGeneratedCount,
      categoryBreakdown,
    };
  }, [applications]);

  // Open treasury modal
  const handleStartTreasury = (app: OdedaApplication) => {
    setSelectedApp(app);
    setApprovedFee(app.amount || 10000);
    setRevenueHead(app.revenueHead || "1001 - General Statutory Fee");
    setTreasuryNotes(app.treasuryAssessment?.treasuryNotes || "Assessment approved based on field inspection report and statutory tariff scale.");
    setTreasuryModalOpen(true);
  };

  // Save treasury assessment & issue invoice
  const handleSaveTreasury = () => {
    if (!selectedApp) return;
    const updated = issueTreasuryInvoice(
      selectedApp.id,
      {
        approvedFee: Number(approvedFee),
        revenueHead,
        treasuryNotes,
      },
      { name: user?.firstName ? `${user.firstName} (Treasurer)` : "Yetunde Treasurer", role: "treasurer" }
    );

    if (updated) {
      toast.success(`Statutory Demand Notice & Invoice (${updated.invoiceNumber}) issued to ${updated.applicant}!`);
      setTreasuryModalOpen(false);
      loadApps();
    }
  };

  return (
    <>
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue Collected"
          value={`₦${metrics.totalCollected.toLocaleString()}`}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          label="Awaiting Assessment Queue"
          value={String(metrics.awaitingAssessmentCount)}
          icon={DollarSign}
          color="warning"
        />
        <StatCard
          label="Pending Outstanding Revenue"
          value={`₦${metrics.pendingAmount.toLocaleString()}`}
          icon={Clock}
          color="primary"
        />
        <StatCard
          label="Invoices Issued"
          value={String(metrics.invoiceGeneratedCount)}
          icon={Receipt}
          color="info"
        />
      </div>

      {/* Treasury Assessment Queue for Odeda Services */}
      <Card className="p-5 mb-6 bg-gradient-card border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Odeda Services — Awaiting Treasury Assessment & Invoice Queue
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Service requests that have completed field verification and require Treasury tariff assessment and Demand Notice generation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={loadApps} variant="outline" size="sm" className="text-xs gap-1">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button asChild size="sm" className="text-xs">
              <Link href="/dashboard/applications">
                View All Applications ({applications.length})
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>App Reference</TableHead>
                <TableHead>Applicant & Contact</TableHead>
                <TableHead>Service & Category</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Inspector Findings</TableHead>
                <TableHead>Status Stage</TableHead>
                <TableHead className="text-right">Treasury Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.awaitingAssessmentList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2 opacity-60" />
                    No applications currently awaiting tariff assessment! All inspected services have been invoiced.
                  </TableCell>
                </TableRow>
              ) : (
                metrics.awaitingAssessmentList.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {app.applicationNo || app.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-xs flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {app.applicant}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {app.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {app.serviceName}
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{app.category}</div>
                    </TableCell>
                    <TableCell className="text-xs">{app.ward}</TableCell>
                    <TableCell className="text-xs max-w-[200px]">
                      {app.inspectionReport?.completed ? (
                        <div className="text-[11px] text-blue-900 dark:text-blue-200 bg-blue-500/10 p-1.5 rounded">
                          <strong>Inspector ({app.inspectionReport.inspectorName}):</strong> {app.inspectionReport.findings}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Direct Treasury tariff assignment</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status.toLowerCase().replace(/\s+/g, "_")} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs"
                        onClick={() => handleStartTreasury(app)}
                      >
                        <DollarSign className="h-3.5 w-3.5" /> Assess & Issue Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Category Revenue Breakdown & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-5 bg-card border-border/60">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Revenue Breakdown by Odeda Service Category
          </h3>
          <div className="space-y-4">
            {metrics.categoryBreakdown.length > 0 ? (
              metrics.categoryBreakdown.map((item, index) => {
                const maxAmount = Math.max(...metrics.categoryBreakdown.map((c) => c.amount), 1);
                return (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="font-mono font-bold">₦{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-hero transition-all duration-700"
                        style={{
                          width: `${(item.amount / maxAmount) * 100}%`,
                          transitionDelay: `${index * 50}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground">No service category data available yet.</p>
            )}
          </div>
        </Card>

        <QuickActions
          items={[
            { icon: FileText, label: "All Service Apps", to: "/dashboard/applications" },
            { icon: BarChart3, label: "Reports & Analytics", to: "/dashboard/reports" },
            { icon: CreditCard, label: "Demand Notices", to: "/dashboard/invoices" },
            { icon: Receipt, label: "Statutory Receipts", to: "/dashboard/receipts" },
          ]}
        />
      </div>

      {/* TREASURY ASSESSMENT DIALOG */}
      {selectedApp && (
        <Dialog open={treasuryModalOpen} onOpenChange={setTreasuryModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Treasury Revenue Assessment
              </DialogTitle>
              <DialogDescription>
                Issue Statutory Demand Notice & Invoice for {selectedApp.serviceName} ({selectedApp.applicationNo})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                <div><strong>Applicant:</strong> {selectedApp.applicant} ({selectedApp.phone})</div>
                <div><strong>Ward:</strong> {selectedApp.ward}</div>
                {selectedApp.inspectionReport?.completed && (
                  <div className="text-blue-900 dark:text-blue-200">
                    <strong>Inspector Rec:</strong> {selectedApp.inspectionReport.recommendedCategory} (₦{selectedApp.inspectionReport.recommendedFee?.toLocaleString()})
                  </div>
                )}
              </div>

              <div>
                <Label>Approved Statutory Fee Tariff (₦) *</Label>
                <Input
                  type="number"
                  value={approvedFee}
                  onChange={(e) => setApprovedFee(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Revenue Head Account *</Label>
                <Input
                  value={revenueHead}
                  onChange={(e) => setRevenueHead(e.target.value)}
                  placeholder="e.g. 2001 - Tenement & Property Rates"
                />
              </div>

              <div>
                <Label>Treasury Remarks & Order Notes</Label>
                <Textarea
                  rows={2}
                  value={treasuryNotes}
                  onChange={(e) => setTreasuryNotes(e.target.value)}
                  placeholder="Enter assessment remarks or payment timeline..."
                />
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-900 dark:text-purple-200 text-[11px]">
                Submitting this assessment generates an official Odeda Statutory Demand Notice & Invoice. The applicant can then make immediate payment via Online Gateway or POS.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setTreasuryModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveTreasury} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Issue Invoice to Applicant
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
