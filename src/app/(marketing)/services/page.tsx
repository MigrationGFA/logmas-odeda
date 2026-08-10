/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { SERVICES } from "@/lib/mock-data";
import {
  FileBadge,
  Store,
  Truck,
  ScrollText,
  Receipt,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sprout,
  Home,
  Pickaxe,
} from "lucide-react";
import Link from "next/link";


const ICONS: Record<string, any> = { FileBadge, Store, Truck, ScrollText, Receipt, MessageSquare, Sprout, Home, Pickaxe };
const FLOW = ["Input", "Validation", "Payment", "Confirmation", "Receipt", "Tracking", "Feedback"];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-mesh">
          <div className="container mx-auto px-4 py-16 md:py-20 text-center">
            <Badge variant="outline" className="mb-3">
              All Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Digital services for every citizen
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every service follows the same secure, traceable workflow.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {FLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <Badge className="bg-secondary text-secondary-foreground border border-primary/20">
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

        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon] || FileBadge;
              return (
                <Card
                  key={s.title}
                  className="p-6 bg-gradient-card border-border/40 hover:shadow-elegant transition-smooth"
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--${s.color}) 12%, transparent)`,
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: `var(--${s.color})` }} />
                  </div>
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {["Online application", "Instant receipt", "QR-verified"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-5 w-full bg-gradient-hero">
                    <Link href="/login">Access service</Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
