"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, QrCode, CheckCircle2, XCircle, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import Link from "next/link";
import { toast } from "sonner";
// hooks/queries/usePublicVerification.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const usePublicVerification = (code: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["public-verify", code],
    queryFn: async () => {
      const response = await api.get(`/state-of-origin/verify/${encodeURIComponent(code)}`);
      return response; // expects { success: true, data: {...} }
    },
    enabled: !!code && enabled,
    retry: false,
    staleTime: 0,
  });
};

// Form validation schema
const verificationSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerifyPage() {
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: "" },
  });

  const codeValue = watch("code");

  // Use the public verification hook
  const { data: response, isLoading, error } = usePublicVerification(
    submittedCode || "",
    !!submittedCode
  );

  const onSubmit = (data: VerificationFormData) => {
    setSubmittedCode(data.code);
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setValue("code", "");
  };

  // Extract result from API response (adjust if your API returns data directly)
  const result = response?.data || response;
  const isValid = result?.valid === true;
  const isNotFound = submittedCode && !isLoading && (!result || error);

  // Helper to format currency
  const formatNgn = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Determine badge color based on type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "SOO":
        return <Badge className="bg-blue-600 text-white">State of Origin</Badge>;
      case "PERMIT":
        return <Badge className="bg-purple-600 text-white">Operational Permit</Badge>;
      case "LEVY":
        return <Badge className="bg-amber-600 text-white">Revenue Levy</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 bg-gradient-mesh">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero shadow-elegant mb-4">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Document Verification
              </h1>
              <p className="mt-2 text-muted-foreground">
                Confirm the authenticity of any LOGMAS‑issued certificate, receipt, or permit.
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-gradient-card border-border/40 shadow-elegant">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="cert">Verification Code / ID</Label>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      id="cert"
                      {...register("code")}
                      placeholder="e.g. INE-2026-08214 or RCP-12345"
                      className={errors.code ? "border-red-500 flex-1" : "flex-1"}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !codeValue}
                      className="bg-gradient-hero shadow-elegant"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-1.5 hidden sm:inline">Verify</span>
                    </Button>
                  </div>
                  {errors.code && (
                    <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex-1 border-t border-border" /> or{" "}
                  <div className="flex-1 border-t border-border" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info("QR scanning will be available soon")}
                >
                  <QrCode className="h-4 w-4 mr-2" /> Scan QR Code
                </Button>
              </form>
            </Card>

            {/* Loading State */}
            {isLoading && submittedCode && (
              <Card className="mt-4 p-6 border-primary/40 bg-primary/5 animate-pulse">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <h3 className="font-semibold">Verifying...</h3>
                    <p className="text-sm text-muted-foreground">Checking code: {submittedCode}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Valid Result */}
            {!isLoading && isValid && result && (
              <Card className="mt-4 p-6 border-2 border-success/40 bg-success/5 animate-fade-up">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(result.type)}
                      <Badge className="bg-success text-success-foreground">Authentic</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mt-1">{result.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Issued by {result.issuingAuthority || "LOGMAS"}
                      {result.isExpired && (
                        <span className="ml-2 text-destructive font-medium">(Expired)</span>
                      )}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      {/* Common fields */}
                      <Field label="ID Number" value={result.idNumber} />
                      <Field label="Holder" value={result.holder} />
                      <Field label="Issued On" value={formatDate(result.issuedAt)} />
                      <Field label="Expires" value={result.expiresAt ? formatDate(result.expiresAt) : "Never"} />

                      {/* Fields specific to SOO Certificate */}
                      {result.type === "SOO" && (
                        <>
                          <Field label="Gender" value={result.metadata?.gender || "N/A"} />
                          <Field label="Ward" value={result.metadata?.ward || "N/A"} />
                          <Field label="Purpose" value={result.metadata?.purpose || "N/A"} />
                        </>
                      )}

                      {/* Fields specific to LEVY / PERMIT (receipt) */}
                      {(result.type === "LEVY" || result.type === "PERMIT") && (
                        <>
                          <Field label="Amount Paid" value={formatNgn(result.amount)} />
                          <Field label="Business Owner" value={result.metadata?.ownerName || "N/A"} />
                          <Field label="Business Address" value={result.metadata?.businessAddress || "N/A"} />
                          <Field label="Category" value={result.metadata?.categoryName || "N/A"} />
                          <Field label="Ward" value={result.metadata?.wardName || "N/A"} />
                          <Field 
                            label="Issued By" 
                            value={
                              result.metadata?.issuedBy 
                                ? `${result.metadata.issuedBy.firstName} ${result.metadata.issuedBy.lastName}` 
                                : "System"
                            } 
                          />
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-success/20">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        Verify Another
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Not Found Result */}
            {!isLoading && isNotFound && (
              <Card className="mt-4 p-6 border-2 border-destructive/40 bg-destructive/5 animate-fade-up">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <Badge variant="destructive">Not Found</Badge>
                    <h3 className="font-semibold text-lg mt-1">
                      Document could not be verified
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No record matches "{submittedCode}". Check the code and try again.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={handleReset}>
                      Try Again
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-primary font-medium underline">
                Contact the LGA
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5 break-words">{value}</div>
    </div>
  );
}