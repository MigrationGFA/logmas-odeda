"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero } from "@/components/page-shell";
import Link from "next/link";
import {
    FileBadge,
    Store,
    Truck,
    ScrollText,
    Receipt,
    MessageSquare,
    ShieldCheck,
    ArrowRight,
    CreditCard,
    QrCode,
    LayoutDashboard,
} from "lucide-react";

// export const metadata = {
//     title: "Digital Services (LOGMAS) — Ijebu North East LGA",
//     description:
//         "Access the LOGMAS e-government portal: apply for certificates, pay levies, verify receipts and track requests online.",
//     openGraph: {
//         title: "Digital Services — LOGMAS Portal",
//         description: "E-government for Ijebu North East LGA.",
//     },
// };

const MODULES = [
    {
        icon: FileBadge,
        title: "State of Origin",
        desc: "Apply, pay and download QR-verified certificates.",
        to: "/login",
    },
    {
        icon: Store,
        title: "Market Levy",
        desc: "Settle daily, weekly and monthly market levies.",
        to: "/login",
    },
    {
        icon: Truck,
        title: "Heavy-Duty Vehicle Levy",
        desc: "Haulage operators pay and receive digital receipts.",
        to: "/login",
    },
    {
        icon: ScrollText,
        title: "Demand Notices",
        desc: "View, download and pay official demand notices.",
        to: "/login",
    },
    {
        icon: Receipt,
        title: "Payments & Receipts",
        desc: "Track every transaction, download digital receipts.",
        to: "/login",
    },
    {
        icon: MessageSquare,
        title: "Complaints",
        desc: "Raise issues and track responses end-to-end.",
        to: "/complaints",
    },
    {
        icon: QrCode,
        title: "Public Verification",
        desc: "Verify certificates and receipts via QR or code.",
        to: "/verify",
    },
    {
        icon: CreditCard,
        title: "Business Registration",
        desc: "Register, manage and renew business profiles.",
        to: "/register",
    },
];

export default function DigitalServices() {
    return (
        <PageShell>
            <PageHero
                eyebrow="LOGMAS — E-Government"
                title="Every government service. One secure portal."
                subtitle="LOGMAS is the official digital backbone of Odeda Local Government Area — bringing every citizen, business and council workflow online with audit-grade transparency."
            >
                <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-gradient-hero shadow-elegant">
                        <Link href="/login">
                            Open LOGMAS Portal <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/verify">Verify a document</Link>
                    </Button>
                </div>
            </PageHero>

            <section className="container mx-auto px-4 py-14">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {MODULES.map((m) => (
                        <Link key={m.title} href={m.to} className="block">
                            <Card className="p-6 h-full bg-gradient-card border-border/40 hover:shadow-elegant hover:-translate-y-1 transition-smooth">
                                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    <m.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">{m.title}</h3>
                                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    Access <ArrowRight className="h-3 w-3" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-secondary/40 py-14">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-5">
                    {[
                        {
                            icon: ShieldCheck,
                            t: "Bank-grade security",
                            d: "Encrypted in transit and at rest. NDPR-compliant.",
                        },
                        {
                            icon: LayoutDashboard,
                            t: "Unified dashboards",
                            d: "Tailored views for citizens, businesses and council staff.",
                        },
                        {
                            icon: QrCode,
                            t: "Verifiable everywhere",
                            d: "Every receipt and certificate is publicly verifiable by QR.",
                        },
                    ].map((c) => (
                        <Card key={c.t} className="p-6 bg-background border-border/40">
                            <c.icon className="h-6 w-6 text-primary" />
                            <h3 className="mt-3 font-semibold">{c.t}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </PageShell>
    );
}
