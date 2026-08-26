"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ODEDA_SERVICES, OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import { ServiceApplicationGuideSteps } from "@/components/services/ServiceApplicationGuideSteps";
import { PublicServiceApplyWidget } from "@/components/services/PublicServiceApplyWidget";
import {
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
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileCheck,
  QrCode,
  ShieldAlert,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const ICONS: Record<string, any> = {
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
};

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [selectedQuickService, setSelectedQuickService] = useState<string>("certificate_of_origin");

  const categories = [
    "All",
    "Certificates",
    "Community & Agriculture",
    "Rates & Levies",
    "Licences & Permits",
    "Urban Development",
  ];

  const filteredServices = ODEDA_SERVICES.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.revenueHead.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyClick = (serviceId: string) => {
    setSelectedQuickService(serviceId);
    setShowQuickApply(true);
    // Smooth scroll to quick apply
    const el = document.getElementById("quick-apply-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-mesh border-b border-border/40">
          <div className="container mx-auto px-4 py-14 md:py-18 text-center max-w-4xl">
            <Badge variant="outline" className="mb-3">
              Official LGA Services & Portal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Statutory Services & Licences for Odeda LGA
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-base">
              Apply for Certificate of Origin, business permits, haulage passes, property rates, and trade licences online with end-to-end digital verification.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => {
                  setShowQuickApply(true);
                  const el = document.getElementById("quick-apply-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-gradient-hero text-primary-foreground font-semibold shadow-elegant"
              >
                <Sparkles className="mr-2 h-4 w-4" /> First-Timer? Select Service & Pay
              </Button>
              <Button asChild variant="outline">
                <Link href="#services-catalog">Browse All 12 Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6-Step Mandatory Application Process Banner Posted on Services Page Before Payment */}
        <section className="bg-muted/20 border-b border-border/40 py-10">
          <div className="container mx-auto px-4">
            <ServiceApplicationGuideSteps
              title="Official 6-Step Application & Payment Process"
              subtitle="Please follow these steps for all services. First-time applicants will have an account automatically created with login details sent to their email upon payment."
            />
          </div>
        </section>

        {/* First Timer Interactive Application & Payment Section */}
        <section id="quick-apply-section" className="container mx-auto px-4 py-12">
          <PublicServiceApplyWidget
            initialServiceId={selectedQuickService}
            showStepGuide={false}
          />
        </section>

        {/* Filter and Services Grid */}
        <section id="services-catalog" className="container mx-auto px-4 py-12 md:py-16 border-t border-border/40">
          <div className="mb-8">
            <Badge variant="outline" className="mb-2">
              Full Statutory Directory
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Available Council Services & Tariffs
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Select any service below to view SLA requirements or initiate your statutory payment and application.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, certificate of origin, rates, permits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:inline mr-1" />
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap text-xs font-medium"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((s: OdedaService) => {
              const Icon = ICONS[s.icon] || FileBadge;
              const fee = getConfiguredFeeForService(s.id) || s.defaultFee;

              return (
                <Card
                  key={s.id}
                  className="p-6 flex flex-col justify-between bg-gradient-card border-border/40 hover:shadow-elegant transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--${s.color}) 12%, transparent)`,
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: `var(--${s.color})` }} />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {s.category}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/services/${s.id}`}>{s.name}</Link>
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {s.description}
                    </p>

                    <div className="mt-4 p-3 rounded-lg bg-muted/40 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Statutory Fee:</span>
                        <span className="font-bold text-foreground">
                          {s.feeType === "fixed" ? `₦${fee.toLocaleString()}` : s.feeDescription}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Processing Time:</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" /> {s.processingTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground pt-0.5">
                        <span>Revenue Head:</span>
                        <span className="font-mono text-[11px] text-foreground">{s.revenueHead}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Requires {s.requiredDocuments.length} verification documents</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <QrCode className="h-3.5 w-3.5 text-primary" />
                        <span>Instant verifiable QR certificate</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm" className="text-xs">
                      <Link href={`/services/${s.id}`}>Details & SLA</Link>
                    </Button>
                    <Button
                      onClick={() => handleApplyClick(s.id)}
                      size="sm"
                      className="bg-gradient-hero text-xs font-semibold"
                    >
                      <CreditCard className="mr-1.5 h-3 w-3" /> Pay & Apply
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <Card className="p-12 text-center bg-muted/20 border-dashed">
              <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-base">No statutory services match your search</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Try clearing your search query or selecting &ldquo;All&rdquo; categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-xs"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
