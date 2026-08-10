"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero } from "@/components/page-shell";
import { LEADERSHIP } from "@/lib/mock-data";
import { Mail, Phone, Crown, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const councillors = [
    {
        ward: "Ward 1 (Odeda Secretariat)",
        name: "Hon. Osunnowo Azeez Olajide",
        phone: "07061088375",
        email: "councillor.ward1@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 2 (Osiele Market)",
        name: "Hon. Odufuwa Tosin Victor",
        phone: "08080217611",
        email: "councillor.ward2@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 3 (Obantoko Corridor)",
        name: "Hon. Adeiye Oriyomi Ajoke",
        phone: "08123100146",
        email: "councillor.ward3@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 4 (Olugbo Community)",
        name: "Hon. Parakoyi Azeez Ayomide",
        phone: "08072703321",
        email: "councillor.ward4@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 5 (Alagbagba Mining/Agro)",
        name: "Hon. Osibanjo Adeleke Solomon",
        phone: "08038355995",
        email: "councillor.ward5@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 6 (Ilugun Ward)",
        name: "Hon. Jagunna Olufunmilayo Janet",
        phone: "07064317581",
        email: "councillor.ward6@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 7 (Itesi / Camp)",
        name: "Hon. Adekogbe Ayodele Samson",
        phone: "08100973778",
        email: "councillor.ward7@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 8 (Opeji Community)",
        name: "Hon. Okulaja Emmanuel Abiodun",
        phone: "07033726911",
        email: "councillor.ward8@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 9 (Koto / Balogun)",
        name: "Hon. Ogunmosu Olabode Clement",
        phone: "08038556949",
        email: "councillor.ward9@odeda.lg.gov.ng"
    },
    {
        ward: "Ward 10 (FUNAAB / Obantoko South)",
        name: "Hon. Falujo Adeola Onabode",
        phone: "08033313041",
        email: "councillor.ward10@odeda.lg.gov.ng"
    }
];

export default function LeadershipPage() {
    const chairman = LEADERSHIP[0];
    return (
        <PageShell>
            <PageHero
                eyebrow="Government Leadership"
                title="Servant-leadership for every citizen"
                subtitle="A modern council united by vision, transparency and an unwavering commitment to Odeda Local Government Area."
            />

            <section className="container mx-auto px-4 py-14">
                <Card className="overflow-hidden border-border/40 bg-gradient-card shadow-elegant">
                    <div className="grid md:grid-cols-3">
                        <div className="relative bg-gradient-hero text-primary-foreground min-h-80">
                            {chairman.image ? (
                                <Image
                                    src={chairman.image}
                                    alt={`${chairman.name}, ${chairman.role}`}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                    fill
                                    priority
                                />
                            ) : (
                                <div className="p-10 flex flex-col items-center justify-center text-center h-full">
                                    <div className="h-32 w-32 rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center text-4xl font-bold backdrop-blur">
                                        {chairman.initials}
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                                <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4 text-gold" />
                                    <span className="text-xs uppercase tracking-wider opacity-90">
                                        {chairman.role}
                                    </span>
                                </div>
                                <div className="mt-1 font-bold text-lg">{chairman.name}</div>
                                <div className="text-xs opacity-90">All Progressives Congress (APC) · Odeda</div>
                            </div>
                        </div>
                        <div className="md:col-span-2 p-8 md:p-10">
                            <Badge className="bg-gold/15 text-gold border-gold/30">
                                Chairman&apos;s Welcome Address
                            </Badge>
                            <Quote className="h-8 w-8 text-gold mt-4" />
                            <div className="mt-3 space-y-3 text-sm md:text-base leading-relaxed">
                                <p>Dear citizens, residents, farmers, investors and friends of Odeda LGA,</p>
                                <p>
                                    It is with profound humility and deep gratitude to Almighty God that I welcome you
                                    to the official digital home of Odeda Local Government Area. Our administration is
                                    firmly committed to building an Odeda LGA where every community — from{" "}
                                    <strong>Odeda Secretariat</strong> to Osiele, Obantoko, Olugbo, Alagbagba, Ilugun,
                                    Opeji, and Camp/FUNAAB corridor — feels the impact of purposeful, transparent governance.
                                </p>
                                <p>
                                    Since assuming office, we have focused on the issues that matter most to you:
                                    rehabilitating critical farm-to-market roads, streamlining quarry and solid mineral haulage,
                                    strengthening security across our 10 wards, supporting our local farmers, traders and youths,
                                    and modernising council service delivery via LOGMAS.
                                </p>
                                <p>
                                    Governance must be open, accountable and accessible. Together, with God&apos;s guidance
                                    and your support, Odeda Local Government Area will continue to rise.
                                </p>
                                <p className="font-semibold not-italic">
                                    — Hon. Folusho Joseph Badejo, Executive Chairman
                                </p>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Button asChild className="bg-gradient-hero shadow-elegant">
                                    <Link href="/invest">Invest with Us</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/contact">Contact the Office</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="container mx-auto px-4 pb-16">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Council Executives</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {LEADERSHIP.slice(1).map((m) => (
                        <Card
                            key={m.name}
                            className="p-6 bg-gradient-card border-border/40 hover:shadow-elegant transition-smooth"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-hero text-primary-foreground flex items-center justify-center font-bold text-lg shadow-elegant">
                                    {m.initials}
                                </div>
                                <div>
                                    <div className="font-semibold">{m.name}</div>
                                    <div className="text-xs text-muted-foreground">{m.role}</div>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                            <div className="mt-4 pt-4 border-t border-border/40 flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Mail className="h-3 w-3" /> office@odeda.lg.gov.ng
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="bg-secondary/40 py-14">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Ward Councillors</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {councillors.map((c) => (
                            <Card
                                key={c.ward}
                                className="p-5 bg-background border-border/40 hover:shadow-card transition-smooth"
                            >
                                <Badge variant="outline" className="mb-2">
                                    {c.ward}
                                </Badge>
                                <div className="font-semibold text-sm">{c.name}</div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                    <Phone className="h-3 w-3" /> {c.phone}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
