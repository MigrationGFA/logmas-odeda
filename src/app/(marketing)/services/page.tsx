"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ODEDA_SERVICES, OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
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

const FLOW = ["Online Application", "Fee Assessment", "Payment", "Inspection / Review", "Council Approval", "QR Certificate Download"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-mesh border-b border-border/40">
          <div className="container mx-auto px-4 py-16 md:py-20 text-center">
            <Badge variant="outline" className="mb-3">
              Official LGA Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Statutory Services & Licences for Odeda LGA
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-base">
              Apply for Certificate of Origin, business permits, haulage passes, property rates, and trade licences online with end-to-end digital verification.
            </p>

            {/* Workflow steps */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {FLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <Badge className="bg-secondary text-secondary-foreground border border-primary/20 font-medium text-xs">
                    {i + 1}. {step}
                  </Badge>
                  {i < FLOW.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter and Services Grid */}
        <section className="container mx-auto px-4 py-12 md:py-16">
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
                      <Link href={`/services/${s.id}`}>{s.title || s.name}</Link>
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
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
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
                    <Button asChild size="sm" className="bg-gradient-hero text-xs font-semibold">
                      <Link href={`/dashboard/services/${s.id}`}>Apply Online</Link>
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
