/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SlidersHorizontal,
  Power,
  CheckCircle2,
  RefreshCw,
  Search,
  FileBadge,
  Users,
  Building2,
  Sprout,
  ShieldCheck,
  Home,
  Truck,
  Beer,
  Tv,
  Pickaxe,
  MapPin,
  Store,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  ODEDA_SERVICES,
  getOdedaServiceById,
  ServiceFeeConfig,
  getServiceFeeConfigs,
  saveServiceFeeConfig,
  toggleServiceFeeStatus,
  resetServiceFeeToDefault,
} from "@/config/odedaServices";
import { toast } from "sonner";

export const formatNgn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

// Helper to render appropriate icon for each service
function getServiceIcon(id: string, className = "h-4 w-4") {
  switch (id) {
    case "certificate_of_origin":
      return <FileBadge className={className} />;
    case "club_registration":
      return <Users className={className} />;
    case "cda_registration":
      return <Building2 className={className} />;
    case "farmers_registration":
      return <Sprout className={className} />;
    case "environmental_sanitation":
      return <ShieldCheck className={className} />;
    case "tenement_rate":
      return <Home className={className} />;
    case "haulage_fees":
      return <Truck className={className} />;
    case "liquor_licence":
      return <Beer className={className} />;
    case "viewing_centre_licence":
      return <Tv className={className} />;
    case "quarry_permit":
      return <Pickaxe className={className} />;
    case "street_naming":
      return <MapPin className={className} />;
    case "kiosk_licence":
      return <Store className={className} />;
    default:
      return <Layers className={className} />;
  }
}

export default function ServiceFeeConfigurationTab() {
  const [feeConfigs, setFeeConfigs] = useState<ServiceFeeConfig[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("certificate_of_origin");
  const [feeAmount, setFeeAmount] = useState<number | string>(3500);
  const [feeStatus, setFeeStatus] = useState<"active" | "inactive">("active");
  const [isSaving, setIsSaving] = useState(false);

  // Table filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadConfigs = () => {
    const data = getServiceFeeConfigs();
    setFeeConfigs(data);
  };

  useEffect(() => {
    loadConfigs();
    const handleFeeChange = () => loadConfigs();
    window.addEventListener("odeda:service-fees-change", handleFeeChange);
    return () => window.removeEventListener("odeda:service-fees-change", handleFeeChange);
  }, []);

  // When selected service changes or configs load, populate form
  useEffect(() => {
    if (feeConfigs.length > 0) {
      const activeItem = feeConfigs.find((c) => c.serviceId === selectedServiceId);
      if (activeItem) {
        setFeeAmount(activeItem.fee);
        setFeeStatus(activeItem.status);
      } else {
        const defaultSvc = getOdedaServiceById(selectedServiceId);
        if (defaultSvc) {
          setFeeAmount(defaultSvc.defaultFee);
          setFeeStatus("active");
        }
      }
    }
  }, [selectedServiceId, feeConfigs]);

  const selectedService = useMemo(() => {
    return getOdedaServiceById(selectedServiceId);
  }, [selectedServiceId]);

  const currentActiveConfig = useMemo(() => {
    return feeConfigs.find((c) => c.serviceId === selectedServiceId);
  }, [feeConfigs, selectedServiceId]);

  // Handle service selector change
  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const item = feeConfigs.find((c) => c.serviceId === serviceId);
    if (item) {
      setFeeAmount(item.fee);
      setFeeStatus(item.status);
    }
  };

  // Handle saving configuration
  const handleSaveChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedServiceId) {
      toast.error("Please select a service first");
      return;
    }

    const numFee = Number(feeAmount);
    if (isNaN(numFee) || numFee < 0) {
      toast.error("Please enter a valid non-negative fee amount");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated = saveServiceFeeConfig(selectedServiceId, numFee, feeStatus);
      setFeeConfigs(updated);
      setIsSaving(false);
      const svc = getOdedaServiceById(selectedServiceId);
      toast.success(
        `Statutory fee for ${svc?.name || selectedServiceId} updated to ${formatNgn(numFee)} (${
          feeStatus === "active" ? "Active" : "Inactive"
        })`
      );
    }, 250);
  };

  // Handle reset to default statutory fee
  const handleResetToDefault = () => {
    if (!selectedService) return;
    const updated = resetServiceFeeToDefault(selectedServiceId);
    setFeeConfigs(updated);
    setFeeAmount(selectedService.defaultFee);
    setFeeStatus("active");
    toast.info(`Reset ${selectedService.name} fee to statutory default: ${formatNgn(selectedService.defaultFee)}`);
  };

  // Handle toggle status from table
  const handleToggleStatus = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleServiceFeeStatus(serviceId);
    setFeeConfigs(updated);
    const svc = getOdedaServiceById(serviceId);
    const item = updated.find((c) => c.serviceId === serviceId);
    toast.success(
      `${svc?.name || serviceId} is now ${item?.status === "active" ? "Active" : "Inactive"}`
    );
  };

  // Filter table data
  const filteredConfigs = useMemo(() => {
    return feeConfigs.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.revenueHead.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [feeConfigs, searchQuery, categoryFilter, statusFilter]);

  // Summary statistics
  const stats = useMemo(() => {
    const totalServices = feeConfigs.length;
    const activeCount = feeConfigs.filter((c) => c.status === "active").length;
    const inactiveCount = totalServices - activeCount;
    const totalFeeSum = feeConfigs.reduce((sum, c) => sum + (c.fee || 0), 0);
    const avgFee = totalServices > 0 ? totalFeeSum / totalServices : 0;
    return { totalServices, activeCount, inactiveCount, avgFee };
  }, [feeConfigs]);

  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(ODEDA_SERVICES.map((s) => s.category)));
    return cats;
  }, []);

  return (
    <div className="space-y-6">
      {/* Top summary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Statutory Services</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-2">{stats.totalServices} Services</div>
          <p className="text-xs text-muted-foreground mt-1">Universal Odeda LGA service registry</p>
        </Card>

        <Card className="p-4 bg-card border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Fee Schedules</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-emerald-600">{stats.activeCount} Active</div>
          <p className="text-xs text-muted-foreground mt-1">Available for live citizen applications</p>
        </Card>

        <Card className="p-4 bg-card border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Inactive / Suspended</span>
            <Power className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mt-2 text-amber-600">{stats.inactiveCount} Inactive</div>
          <p className="text-xs text-muted-foreground mt-1">Temporarily disabled fee schedules</p>
        </Card>

        <Card className="p-4 bg-card border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Average Statutory Fee</span>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">{formatNgn(stats.avgFee)}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all 12 statutory LGA services</p>
        </Card>
      </div>

      {/* Main Fee Configuration Form Section */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Fee Configuration
              </CardTitle>
              <CardDescription>
                Select a service to view its current configured fee, update the amount, activate or deactivate its status, and save changes.
              </CardDescription>
            </div>
            {currentActiveConfig && (
              <Badge
                variant={currentActiveConfig.status === "active" ? "default" : "secondary"}
                className={
                  currentActiveConfig.status === "active"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-muted text-muted-foreground"
                }
              >
                Current Status: {currentActiveConfig.status === "active" ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* 1. Service Selector */}
              <div className="space-y-2 md:col-span-5">
                <Label htmlFor="service-select" className="text-sm font-semibold flex items-center gap-1.5">
                  Service:
                  <span className="text-xs font-normal text-muted-foreground">(Select any of the 12 services)</span>
                </Label>
                <Select value={selectedServiceId} onValueChange={handleServiceSelect}>
                  <SelectTrigger id="service-select" className="w-full h-11 bg-background">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {ODEDA_SERVICES.map((s) => {
                      const cfg = feeConfigs.find((c) => c.serviceId === s.id);
                      return (
                        <SelectItem key={s.id} value={s.id} className="py-2.5">
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex items-center gap-2">
                              {getServiceIcon(s.id, "h-4 w-4 text-muted-foreground")}
                              <span className="font-medium text-sm">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto text-xs">
                              <span className="text-muted-foreground">({s.category})</span>
                              <span className="font-bold text-primary">
                                {formatNgn(cfg ? cfg.fee : s.defaultFee)}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {selectedService && (
                  <div className="mt-2 p-3 bg-muted/40 rounded-md border border-border/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Revenue Head:</span>
                      <span className="font-mono font-medium">{selectedService.revenueHead}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {selectedService.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Statutory Default Fee:</span>
                      <span className="font-semibold text-muted-foreground">
                        {formatNgn(selectedService.defaultFee)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Fee Input */}
              <div className="space-y-2 md:col-span-4">
                <Label htmlFor="fee-input" className="text-sm font-semibold flex items-center gap-1.5">
                  Fee:
                  <span className="text-xs font-normal text-muted-foreground">(Amount in Nigerian Naira)</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    ₦
                  </div>
                  <Input
                    id="fee-input"
                    type="number"
                    min="0"
                    step="500"
                    placeholder="Enter fee amount"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    className="pl-8 h-11 text-base font-semibold bg-background"
                    required
                  />
                </div>

                {/* Quick fee adjustment presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-muted-foreground self-center mr-1">Quick adjust:</span>
                  {[3500, 5000, 10000, 15000, 25000, 50000, 100000, 150000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFeeAmount(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        Number(feeAmount) === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground border-border/60"
                      }`}
                    >
                      {formatNgn(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Status Selector */}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="status-select" className="text-sm font-semibold flex items-center gap-1.5">
                  Status:
                </Label>
                <Select
                  value={feeStatus}
                  onValueChange={(v: "active" | "inactive") => setFeeStatus(v)}
                >
                  <SelectTrigger id="status-select" className="w-full h-11 bg-background">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <span className="font-medium text-muted-foreground">Inactive</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-[11px] text-muted-foreground pt-1">
                  {feeStatus === "active"
                    ? "✓ Active fee is applied automatically to new applications."
                    : "⚠ Inactive fees suspend new statutory applications."}
                </p>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {currentActiveConfig && (
                  <span>
                    Last updated: <strong className="font-medium text-foreground">{currentActiveConfig.lastUpdated}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefault}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  Reset to Default
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 min-w-[140px]"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Configured Services List / Table Section */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Configured Services & Statutory Fees
              </CardTitle>
              <CardDescription>
                Overview of all 12 statutory Odeda Local Government Area services and their configured revenue fees.
              </CardDescription>
            </div>
            <Badge variant="outline" className="self-start md:self-auto font-mono text-xs">
              Showing {filteredConfigs.length} of {feeConfigs.length} Services
            </Badge>
          </div>

          {/* Filter & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3">
            <div className="relative sm:col-span-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service name, revenue head..."
                className="pl-9 bg-background"
              />
            </div>

            <div className="sm:col-span-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category / Revenue Head</TableHead>
                  <TableHead className="text-right">Configured Fee</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No services match your search and filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConfigs.map((config, index) => {
                    const isSelected = config.serviceId === selectedServiceId;
                    return (
                      <TableRow
                        key={config.serviceId}
                        onClick={() => handleServiceSelect(config.serviceId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <TableCell className="text-center text-xs font-mono text-muted-foreground">
                          {index + 1}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-md bg-muted/60 text-primary shrink-0">
                              {getServiceIcon(config.serviceId, "h-4 w-4")}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                {config.serviceName}
                                {isSelected && (
                                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-normal">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                ID: {config.serviceId}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs font-normal">
                              {config.category}
                            </Badge>
                            <div className="text-xs text-muted-foreground font-mono">
                              {config.revenueHead}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <span className="font-bold text-base text-foreground">
                            {formatNgn(config.fee)}
                          </span>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant={config.status === "active" ? "default" : "secondary"}
                            className={
                              config.status === "active"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {config.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground font-medium">
                          {config.lastUpdated}
                        </TableCell>

                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs px-2.5"
                              onClick={() => {
                                handleServiceSelect(config.serviceId);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              <SlidersHorizontal className="h-3 w-3 mr-1" />
                              {isSelected ? "Editing" : "Configure"}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 ${
                                config.status === "active"
                                  ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title={config.status === "active" ? "Deactivate Fee" : "Activate Fee"}
                              onClick={(e) => handleToggleStatus(config.serviceId, e)}
                            >
                              <Power className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
