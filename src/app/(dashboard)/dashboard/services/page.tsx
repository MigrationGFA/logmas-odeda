"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/dashboard/shared";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ODEDA_SERVICES, OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import Link from "next/link";
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
  Search,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useServices } from "@/hooks/queries/useServices";

const ICON_MAP: Record<string, any> = {
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

  const categories = [
    "All",
    "Certificates",
    "Community & Agriculture",
    "Rates & Levies",
    "Licences & Permits",
    "Urban Development",
  ];

  const {services} = useServices()

  // console.log(services,"services")

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.revenueHead.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Odeda LGA Government Services Catalogue"
        subtitle="Select an official local government service to apply, obtain statutory assessments, or pay levies online."
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services, revenue heads, or permits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service: OdedaService) => {
          const IconComponent = ICON_MAP[service.icon] || FileBadge;

          return (
            <Card
              key={service.id}
              className="flex flex-col justify-between hover:shadow-md transition-all border-border/60 bg-gradient-card"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {service.category}
                  </Badge>
                </div>

                <CardTitle className="text-lg font-bold leading-tight pt-1">
                  {service.name}
                </CardTitle>

                <CardDescription className="text-xs line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs py-2">
                <div className="p-2.5 rounded-md bg-muted/40 space-y-1">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Revenue Head:</span>
                    <span className="text-foreground font-mono text-[11px]">{service.revenueHead}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Configured Fee:</span>
                    <span className="text-foreground font-bold">₦{service?.feeConfig?.amount?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground items-center pt-1">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 text-primary" /> {service.estimatedDays}
                    </span>
                    {service.requiresInspection && (
                      <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-600 dark:text-amber-400">
                        Requires Inspection
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Required Documents ({service.requirements.length}):</span>{" "}
                  {service.requirements.slice(0, 2).join(", ")}
                  {service.requirements.length > 2 && "..."}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button asChild className="w-full gap-2 text-xs font-semibold" size="sm">
                  <Link href={`/dashboard/services/${service.id}`}>
                    Apply & Settle Fee <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-12 text-center bg-muted/20">
          <p className="text-muted-foreground font-medium">No government services found matching your criteria.</p>
          <Button variant="outline" className="mt-3 text-xs" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
