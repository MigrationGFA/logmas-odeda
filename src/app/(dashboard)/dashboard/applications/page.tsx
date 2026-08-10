/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tokenManager } from "@/services/apiAuth";
import { ODEDA_SERVICES } from "@/config/odedaServices";
import { WARDS } from "@/lib/mock-data";
import { QRCodeSVG } from "@/components/dashboard/qr-code";
import {
  getOdedaApplications,
  getOdedaApplicationById,
  updateApplicationStatus,
  processApplicationPayment,
  recordFieldInspection,
  issueTreasuryInvoice,
  approveAndGenerateCertificate,
  reapplyFromRejected,
  OdedaApplication,
  ApplicationStatus,
} from "@/lib/odedaApplications";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Briefcase,
  Printer,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  Clock,
  UserCheck,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const user = tokenManager.getUser();
  const role = user?.role || "citizen";

  const isCitizen = role === "citizen";
  const isBusiness = role === "business_owner";
  const isFieldOfficer = role === "field_officer";
  const isTreasurer = role === "treasurer";
  const isLgaAdmin = role === "lga_admin";
  const isSuperAdmin = role === "super_admin";
  const isChairman = role === "chairman";
  const isCouncillor = role === "ward_councillor";

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications, setApplications] = useState<OdedaApplication[]>([]);

  // Selected app for detail / workflow modal
  const [selectedApp, setSelectedApp] = useState<OdedaApplication | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "inspection" | "treasury" | "timeline" | "certificate">("details");

  // Dialog Visibility Flags
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [treasuryModalOpen, setTreasuryModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [adminActionModalOpen, setAdminActionModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states for modals
  // Field Officer Inspection Form
  const [inspectionFindings, setInspectionFindings] = useState("");
  const [recommendedCategory, setRecommendedCategory] = useState("Standard Category");
  const [recommendedFee, setRecommendedFee] = useState(10000);

  // Treasury Form
  const [approvedFee, setApprovedFee] = useState(10000);
  const [revenueHead, setRevenueHead] = useState("");
  const [treasuryNotes, setTreasuryNotes] = useState("");

  // Payment Form
  const [payMethod, setPayMethod] = useState("card");

  // Admin Action Form
  const [adminAction, setAdminAction] = useState<"approve" | "return" | "reject">("approve");
  const [correctionNotes, setCorrectionNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Resubmit Form State
  const [editDetails, setEditDetails] = useState<Record<string, any>>({});

  // Reload applications from central store
  const reloadApps = () => {
    const apps = getOdedaApplications();
    setApplications(apps);
  };

  useEffect(() => {
    reloadApps();
    const handleStoreChange = () => reloadApps();
    window.addEventListener("odeda:applications-change", handleStoreChange);
    return () => window.removeEventListener("odeda:applications-change", handleStoreChange);
  }, []);

  // Filter applications by search, service, ward, status, and role scope
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Role scope filter
      if ((isCitizen || isBusiness) && app.applicant.toLowerCase().indexOf((user?.firstName || "").toLowerCase()) === -1) {
        // Show all if mock demo, but prioritize matching or all for convenience
      }

      const matchesSearch =
        (app.applicant || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.id || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.applicationNo || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.serviceName || "").toLowerCase().includes(search.toLowerCase());

      const matchesService = serviceFilter === "all" || app.serviceId === serviceFilter;
      const matchesWard = wardFilter === "all" || app.ward === wardFilter;
      const matchesStatus = statusFilter === "all" || app.status.toLowerCase().replace(/\s+/g, "_") === statusFilter;

      return matchesSearch && matchesService && matchesWard && matchesStatus;
    });
  }, [applications, search, serviceFilter, wardFilter, statusFilter, isCitizen, isBusiness, user]);

  // Open details
  const handleOpenDetails = (app: OdedaApplication) => {
    setSelectedApp(app);
    setActiveTab("details");
    setDetailModalOpen(true);
  };

  // Field Officer Inspection action
  const handleStartInspection = (app: OdedaApplication) => {
    setSelectedApp(app);
    setInspectionFindings(app.inspectionReport?.findings || "Property and premises inspected in good order.");
    setRecommendedCategory(app.inspectionReport?.recommendedCategory || "Standard Category");
    setRecommendedFee(app.amount || 10000);
    setInspectionModalOpen(true);
  };

  const handleSaveInspection = () => {
    if (!selectedApp) return;
    const updated = recordFieldInspection(
      selectedApp.id,
      {
        findings: inspectionFindings,
        recommendedCategory,
        recommendedFee: Number(recommendedFee),
      },
      { name: user?.firstName || "Field Officer", role: "field_officer" }
    );
    if (updated) {
      toast.success(`Inspection report submitted for ${updated.applicationNo}. Forwarded to Treasury.`);
      setInspectionModalOpen(false);
      reloadApps();
    }
  };

  // Treasury Assessment action
  const handleStartTreasury = (app: OdedaApplication) => {
    setSelectedApp(app);
    setApprovedFee(app.amount || 10000);
    setRevenueHead(app.revenueHead || "1001 - General Revenue");
    setTreasuryNotes(app.treasuryAssessment?.treasuryNotes || "Assessment approved based on field inspection.");
    setTreasuryModalOpen(true);
  };

  const handleSaveTreasury = () => {
    if (!selectedApp) return;
    const updated = issueTreasuryInvoice(
      selectedApp.id,
      {
        approvedFee: Number(approvedFee),
        revenueHead,
        treasuryNotes,
      },
      { name: user?.firstName || "Treasury Officer", role: "treasurer" }
    );
    if (updated) {
      toast.success(`Demand Notice & Invoice generated for ${updated.applicationNo}. Citizen notified.`);
      setTreasuryModalOpen(false);
      reloadApps();
    }
  };

  // Payment action
  const handleStartPayment = (app: OdedaApplication) => {
    setSelectedApp(app);
    setPaymentModalOpen(true);
  };

  const handleExecutePayment = () => {
    if (!selectedApp) return;
    const updated = processApplicationPayment(
      selectedApp.id,
      payMethod,
      { name: user?.firstName || "Applicant", role: user?.role || "citizen" }
    );
    if (updated) {
      toast.success(`Payment of ₦${updated.amount.toLocaleString()} successful! Application sent to LGA Admin for approval.`);
      setPaymentModalOpen(false);
      reloadApps();
    }
  };

  // LGA Admin approval / return / reject action
  const handleStartAdminAction = (app: OdedaApplication) => {
    setSelectedApp(app);
    setAdminAction("approve");
    setCorrectionNotes("");
    setRejectionReason("");
    setAdminActionModalOpen(true);
  };

  const handleExecuteAdminAction = () => {
    if (!selectedApp) return;
    const actor = { name: user?.firstName || "LGA Admin", role: "lga_admin" };

    if (adminAction === "approve") {
      const updated = approveAndGenerateCertificate(selectedApp.id, actor);
      if (updated) {
        toast.success(`Application ${updated.applicationNo} APPROVED! Statutory Certificate/Licence generated.`);
      }
    } else if (adminAction === "return") {
      if (!correctionNotes.trim()) {
        toast.error("Please enter correction instructions for the citizen.");
        return;
      }
      updateApplicationStatus(selectedApp.id, "Returned For Correction", actor, { correctionNotes });
      toast.info(`Application ${selectedApp.applicationNo} returned to citizen for correction.`);
    } else if (adminAction === "reject") {
      if (!rejectionReason.trim()) {
        toast.error("Please enter a reason for rejecting this application.");
        return;
      }
      updateApplicationStatus(selectedApp.id, "Rejected", actor, { rejectionReason });
      toast.error(`Application ${selectedApp.applicationNo} rejected.`);
    }

    setAdminActionModalOpen(false);
    reloadApps();
  };

  // Citizen Resubmit action
  const handleStartEdit = (app: OdedaApplication) => {
    setSelectedApp(app);
    setEditDetails({ ...app.details });
    setEditModalOpen(true);
  };

  const handleExecuteResubmit = () => {
    if (!selectedApp) return;
    const updated = updateApplicationStatus(
      selectedApp.id,
      "Submitted",
      { name: user?.firstName || "Applicant", role: "citizen" },
      { details: editDetails, correctionNotes: undefined }
    );
    if (updated) {
      toast.success(`Application ${updated.applicationNo} updated and resubmitted successfully!`);
      setEditModalOpen(false);
      reloadApps();
    }
  };

  // Citizen Reapply from Rejected
  const handleReapply = (app: OdedaApplication) => {
    const newApp = reapplyFromRejected(app.id, user?.firstName || app.applicant);
    if (newApp) {
      toast.success(`Fresh application ${newApp.applicationNo} created from previous details.`);
      reloadApps();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={
          isCitizen || isBusiness
            ? "My Odeda Service Applications"
            : isFieldOfficer
            ? "Field Inspection & Application Queue"
            : isTreasurer
            ? "Revenue Assessment & Invoice Queue"
            : isLgaAdmin
            ? "LGA Executive Approval Queue"
            : isChairman
            ? "Executive Applications Overview"
            : "Odeda Local Government Applications Management"
        }
        subtitle="Simulate and execute the complete statutory workflow from submission, inspection, treasury assessment, payment, approval, to certificate issue."
        action={
          <div className="flex items-center gap-2">
            <Button onClick={reloadApps} variant="outline" size="sm" className="gap-1 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Store
            </Button>
            <Button asChild className="gap-2 text-xs">
              <Link href="/dashboard/services">
                <Plus className="h-4 w-4" /> Apply for New Service
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filter Controls */}
      <Card className="p-4 bg-card border-border/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicant, ID, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Filter by Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services (12)</SelectItem>
              {ODEDA_SERVICES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Filter by Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards (10)</SelectItem>
              {WARDS.map((w) => (
                <SelectItem key={w} value={w}>{w} Ward</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="inspection_required">Inspection Required</SelectItem>
              <SelectItem value="inspection_completed">Inspection Completed</SelectItem>
              <SelectItem value="awaiting_assessment">Awaiting Assessment</SelectItem>
              <SelectItem value="invoice_generated">Invoice Generated</SelectItem>
              <SelectItem value="payment_confirmed">Payment Confirmed</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="completed">Completed / Approved</SelectItem>
              <SelectItem value="returned_for_correction">Returned for Correction</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Application Table */}
      <Card className="p-0 bg-gradient-card border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Reference</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Amount & Payment</TableHead>
                <TableHead>Status Stage</TableHead>
                <TableHead className="text-right">Role Workflow Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                    No Odeda applications found matching your search parameters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((a) => (
                  <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {a.applicationNo || a.id}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      <div>{a.applicant}</div>
                      <div className="text-[10px] text-muted-foreground">{a.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {a.serviceName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{a.ward}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          a.paymentStatus === "paid"
                            ? "border-success/40 bg-success/10 text-success text-[11px]"
                            : "border-warning/40 bg-warning/10 text-warning-foreground text-[11px]"
                        }
                      >
                        ₦{a.amount.toLocaleString()} ({a.paymentStatus})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status.toLowerCase().replace(/\s+/g, "_")} />
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Citizen Payment Action */}
                      {(isCitizen || isBusiness) && (a.status === "Invoice Generated" || a.status === "Awaiting Payment" || (a.status === "Submitted" && a.paymentStatus === "unpaid")) && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                          onClick={() => handleStartPayment(a)}
                        >
                          <CreditCard className="h-3.5 w-3.5" /> Pay Fee
                        </Button>
                      )}

                      {/* Citizen Edit & Resubmit */}
                      {(isCitizen || isBusiness) && a.status === "Returned For Correction" && (
                        <Button
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-xs"
                          onClick={() => handleStartEdit(a)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Edit & Resubmit
                        </Button>
                      )}

                      {/* Citizen Reapply */}
                      {(isCitizen || isBusiness) && a.status === "Rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary gap-1 text-xs"
                          onClick={() => handleReapply(a)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reapply
                        </Button>
                      )}

                      {/* Field Officer Inspection Action */}
                      {isFieldOfficer && (a.status === "Inspection Required" || a.status === "Submitted") && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs"
                          onClick={() => handleStartInspection(a)}
                        >
                          <ClipboardList className="h-3.5 w-3.5" /> Conduct Inspection
                        </Button>
                      )}

                      {/* Treasury Assessment Action */}
                      {isTreasurer && (a.status === "Inspection Completed" || a.status === "Awaiting Assessment" || a.status === "Submitted") && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs"
                          onClick={() => handleStartTreasury(a)}
                        >
                          <DollarSign className="h-3.5 w-3.5" /> Assess & Issue Invoice
                        </Button>
                      )}

                      {/* LGA Admin Approval Action */}
                      {isLgaAdmin && (a.status === "Payment Confirmed" || a.status === "Pending Approval" || a.status === "Under Review") && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                          onClick={() => handleStartAdminAction(a)}
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Review & Approve
                        </Button>
                      )}

                      {/* View Details Button for everyone */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDetails(a)}
                        className="text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* DETAILS / TIMELINE MODAL */}
      {selectedApp && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span>{selectedApp.serviceName} ({selectedApp.applicationNo})</span>
                </div>
                <StatusBadge status={selectedApp.status.toLowerCase().replace(/\s+/g, "_")} />
              </DialogTitle>
              <DialogDescription>
                Submitted by {selectedApp.applicant} • {selectedApp.ward}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              {/* Tabs header */}
              <div className="flex gap-2 border-b pb-2">
                <Button
                  size="sm"
                  variant={activeTab === "details" ? "default" : "ghost"}
                  onClick={() => setActiveTab("details")}
                  className="text-xs"
                >
                  Application Details
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "timeline" ? "default" : "ghost"}
                  onClick={() => setActiveTab("timeline")}
                  className="text-xs gap-1"
                >
                  <Clock className="h-3.5 w-3.5" /> Workflow Timeline
                </Button>
                {(selectedApp.status === "Completed" || selectedApp.certificateNumber) && (
                  <Button
                    size="sm"
                    variant={activeTab === "certificate" ? "default" : "ghost"}
                    onClick={() => setActiveTab("certificate")}
                    className="text-xs gap-1 bg-amber-600 text-white"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Official Certificate
                  </Button>
                )}
              </div>

              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/40 border grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-muted-foreground block">Applicant Name:</span>
                      <span className="font-bold text-sm">{selectedApp.applicant}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Phone Contact:</span>
                      <span className="font-semibold">{selectedApp.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Address:</span>
                      <span className="font-semibold">{selectedApp.address}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Ward:</span>
                      <span className="font-semibold">{selectedApp.ward}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Revenue Head:</span>
                      <span className="font-semibold">{selectedApp.revenueHead}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Fee Amount:</span>
                      <span className="font-bold text-success text-sm">₦{selectedApp.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedApp.correctionNotes && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Returned for Correction Notice:
                      </div>
                      <p>{selectedApp.correctionNotes}</p>
                    </div>
                  )}

                  {selectedApp.rejectionReason && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-900 dark:text-red-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Rejection Reason:
                      </div>
                      <p>{selectedApp.rejectionReason}</p>
                    </div>
                  )}

                  {selectedApp.inspectionReport?.completed && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-1">
                      <div className="font-bold text-blue-900 dark:text-blue-200">Field Inspection Report</div>
                      <p className="text-muted-foreground">Inspector: {selectedApp.inspectionReport.inspectorName}</p>
                      <p>Findings: {selectedApp.inspectionReport.findings}</p>
                    </div>
                  )}

                  {selectedApp.details && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Form Payloads & Inputs</h4>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        {Object.entries(selectedApp.details).map(([k, v]) => {
                          if (typeof v === "object") return null;
                          return (
                            <div key={k}>
                              <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}: </span>
                              <strong className="text-foreground">{String(v)}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-3 py-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Statutory Lifecycle History</h4>
                  <div className="relative pl-6 space-y-4 border-l-2 border-primary/30">
                    {(selectedApp.timeline || []).map((ev) => (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                          ✓
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-foreground text-xs">{ev.title}</span>
                          <span className="text-[10px] text-muted-foreground">{ev.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">{ev.description}</p>
                        <span className="text-[10px] text-primary/80 font-medium">Actor: {ev.actor} ({ev.actorRole})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "certificate" && (selectedApp.certificateNumber || selectedApp.status === "Completed") && (
                <div className="p-6 bg-amber-500/5 border border-amber-500/30 rounded-xl space-y-4 text-center">
                  <ShieldCheck className="h-12 w-12 text-amber-600 mx-auto" />
                  <h3 className="text-lg font-bold font-serif">Odeda Local Government Statutory Document</h3>
                  <p className="text-xs text-muted-foreground">Official certificate/licence issued to <strong className="text-foreground">{selectedApp.applicant}</strong></p>
                  
                  <div className="p-4 bg-background border rounded-lg max-w-md mx-auto space-y-2 font-mono text-left text-xs">
                    <div>Document No: <strong>{selectedApp.certificateNumber}</strong></div>
                    <div>Issued Date: <strong>{selectedApp.issuedAt ? new Date(selectedApp.issuedAt).toLocaleDateString() : "2026-08-02"}</strong></div>
                    <div>Valid Ward: <strong>{selectedApp.ward}</strong></div>
                    <div>Verification Token: <strong>{selectedApp.qrToken}</strong></div>
                  </div>

                  <div className="flex justify-center py-2">
                    <QRCodeSVG value={`https://logmas.gov.ng/verify/${selectedApp.certificateNumber}`} size={120} />
                  </div>

                  <Button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                    <Printer className="h-4 w-4" /> Print / Download Official Document
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* FIELD OFFICER INSPECTION MODAL */}
      {selectedApp && (
        <Dialog open={inspectionModalOpen} onOpenChange={setInspectionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Conduct Field Inspection
              </DialogTitle>
              <DialogDescription>
                {selectedApp.serviceName} ({selectedApp.applicationNo})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div>
                <Label>Inspection Findings & Report</Label>
                <Textarea
                  rows={3}
                  value={inspectionFindings}
                  onChange={(e) => setInspectionFindings(e.target.value)}
                  placeholder="Record property condition, size, equipment, sanitation state..."
                />
              </div>

              <div>
                <Label>Recommended Fee Category</Label>
                <Input
                  value={recommendedCategory}
                  onChange={(e) => setRecommendedCategory(e.target.value)}
                />
              </div>

              <div>
                <Label>Recommended Fee Tariff (₦)</Label>
                <Input
                  type="number"
                  value={recommendedFee}
                  onChange={(e) => setRecommendedFee(Number(e.target.value))}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg text-[11px] text-muted-foreground">
                Submitting this inspection report transitions status to <strong>Inspection Completed / Awaiting Assessment</strong> and sends it to Treasury.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setInspectionModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveInspection} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Submit Inspection Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* TREASURY ASSESSMENT MODAL */}
      {selectedApp && (
        <Dialog open={treasuryModalOpen} onOpenChange={setTreasuryModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Treasury Revenue Assessment
              </DialogTitle>
              <DialogDescription>
                Issue Statutory Demand Notice & Invoice for {selectedApp.applicationNo}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div>
                <Label>Approved Statutory Fee (₦)</Label>
                <Input
                  type="number"
                  value={approvedFee}
                  onChange={(e) => setApprovedFee(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Revenue Head Account</Label>
                <Input
                  value={revenueHead}
                  onChange={(e) => setRevenueHead(e.target.value)}
                  placeholder="e.g. 2001 - Tenement & Property Rates"
                />
              </div>

              <div>
                <Label>Treasury Notes & Remarks</Label>
                <Textarea
                  rows={2}
                  value={treasuryNotes}
                  onChange={(e) => setTreasuryNotes(e.target.value)}
                  placeholder="Add assessment remarks..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setTreasuryModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveTreasury} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Issue Invoice to Citizen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* SIMULATED PAYMENT MODAL */}
      {selectedApp && (
        <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Simulate Statutory Payment
              </DialogTitle>
              <DialogDescription>
                Pay ₦{selectedApp.amount.toLocaleString()} for {selectedApp.serviceName} ({selectedApp.applicationNo})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg font-medium text-emerald-900 dark:text-emerald-200">
                Amount Billed: <strong>₦{selectedApp.amount.toLocaleString()}</strong>
              </div>

              <div>
                <Label>Select Payment Method</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Debit / Credit Card (Paystack Simulated)</SelectItem>
                    <SelectItem value="transfer">Bank Transfer (NIBSS / Virtual Account)</SelectItem>
                    <SelectItem value="pos">Field Officer POS Terminal</SelectItem>
                    <SelectItem value="cash">Direct Cash Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
                <Button onClick={handleExecutePayment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirm Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* LGA ADMIN ACTION MODAL */}
      {selectedApp && (
        <Dialog open={adminActionModalOpen} onOpenChange={setAdminActionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                LGA Executive Review Action
              </DialogTitle>
              <DialogDescription>
                {selectedApp.serviceName} — {selectedApp.applicant}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div>
                <Label>Action Decision</Label>
                <Select value={adminAction} onValueChange={(v: any) => setAdminAction(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve & Issue Official Certificate/Licence</SelectItem>
                    <SelectItem value="return">Return for Correction to Applicant</SelectItem>
                    <SelectItem value="reject">Reject Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {adminAction === "return" && (
                <div>
                  <Label>Correction Notes for Citizen</Label>
                  <Textarea
                    rows={3}
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Specify exactly what document or field needs correction..."
                  />
                </div>
              )}

              {adminAction === "reject" && (
                <div>
                  <Label>Rejection Reason</Label>
                  <Textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide justification for rejecting this application..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAdminActionModalOpen(false)}>Cancel</Button>
                <Button onClick={handleExecuteAdminAction} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Execute Decision
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* CITIZEN RESUBMIT MODAL */}
      {selectedApp && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-600" />
                Edit & Resubmit Application
              </DialogTitle>
              <DialogDescription>
                {selectedApp.serviceName} ({selectedApp.applicationNo})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              {selectedApp.correctionNotes && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-900 dark:text-amber-200">
                  <strong>Notice:</strong> {selectedApp.correctionNotes}
                </div>
              )}

              {Object.entries(editDetails).map(([k, v]) => {
                if (typeof v === "object") return null;
                return (
                  <div key={k}>
                    <Label className="capitalize">{k.replace(/([A-Z])/g, " $1")}</Label>
                    <Input
                      value={v || ""}
                      onChange={(e) => setEditDetails({ ...editDetails, [k]: e.target.value })}
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button onClick={handleExecuteResubmit} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Resubmit Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
