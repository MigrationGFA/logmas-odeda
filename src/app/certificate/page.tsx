"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function CertificateIndexContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || searchParams.get("id") || searchParams.get("token");
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (code) {
      router.replace(`/certificate/${encodeURIComponent(code)}`);
    }
  }, [code, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      router.push(`/certificate/${encodeURIComponent(tokenInput.trim())}`);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16">
      <Card className="p-8 text-center border shadow-lg bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              Certificate Viewer
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter a certificate token or certificate number to view the official electronic document.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3 pt-2">
            <Input
              placeholder="e.g. 40c4b26f or club123"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="text-center font-mono text-sm"
              required
            />
            <Button
              type="submit"
              className="w-full gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
            >
              <Search className="h-3.5 w-3.5" /> View Certificate
            </Button>
          </form>

          <div className="pt-2 text-xs text-muted-foreground">
            Looking for public verification?{" "}
            <Link href="/verify" className="text-emerald-700 font-semibold underline">
              Verify in Registry
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function CertificateIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-center py-12 text-sm">Loading Certificate Viewer...</div>}>
          <CertificateIndexContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
