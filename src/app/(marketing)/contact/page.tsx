"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SITE_CONTACT } from "@/config/siteContact";

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            setSending(false);
            toast.success("Message sent. We'll respond within 1 business day.");
            (e.target as HTMLFormElement).reset();
        }, 600);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">
                <section className="bg-gradient-mesh">
                    <div className="container mx-auto px-4 py-16 text-center">
                        <Badge variant="outline" className="mb-3">
                            Contact
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">We&apos;re here to help</h1>
                        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                            Reach out for support, complaints or general enquiries.
                        </p>
                    </div>
                </section>
                <section className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        {[
                            {
                                icon: MapPin,
                                title: "Office",
                                lines: [SITE_CONTACT.secretariatAddress],
                            },
                            {
                                icon: Phone,
                                title: "Phone",
                                lines: [SITE_CONTACT.phone, SITE_CONTACT.operatingDays],
                            },
                            {
                                icon: Mail,
                                title: "Email",
                                lines: [SITE_CONTACT.email, SITE_CONTACT.supportEmail],
                            },
                        ].map((c) => (
                            <Card key={c.title} className="p-5 bg-gradient-card border-border/40">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <c.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{c.title}</h3>
                                        {c.lines.map((l) => (
                                            <div key={l} className="text-sm text-muted-foreground">
                                                {l}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="lg:col-span-2 p-6 md:p-8 bg-gradient-card border-border/40">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="n">Full Name</Label>
                                    <Input id="n" required className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="e">Email</Label>
                                    <Input id="e" type="email" required className="mt-1.5" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="s">Subject</Label>
                                <Input id="s" required className="mt-1.5" />
                            </div>
                            <div>
                                <Label htmlFor="m">Message</Label>
                                <Textarea id="m" rows={5} required className="mt-1.5" />
                            </div>
                            <Button
                                type="submit"
                                disabled={sending}
                                className="bg-gradient-hero shadow-elegant w-full sm:w-auto"
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </Card>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
