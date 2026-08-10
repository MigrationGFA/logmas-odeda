"use client"
import { PageHeader } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QRCodeSVG } from "@/components/dashboard/qr-code";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useReceiptDetails } from "@/hooks/queries/useReceipts";
import React from "react";
import Link from "next/link";


export default function ReceiptDetail({params}:{params:Promise<{ id: string }>}) {
   const { id:receiptId } = React.use(params)
  const { receipt, isLoading, error, refetch } = useReceiptDetails(receiptId);

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify?code=${receipt?.verificationCode ?? ""}`
    : "";

  const copyVerificationLink = () => {
    navigator.clipboard?.writeText(verifyUrl);
    toast.success("Verification link copied");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
    toast.success("Use 'Save as PDF' in the print dialog");
  };

  console.log(receipt,"receipt")

  if (isLoading) {
    return (
      <div>
        <PageHeader 
          title="Receipt Details" 
          subtitle="Loading receipt information..." 
        />
        <ReceiptSkeleton />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div>
        <PageHeader 
          title="Receipt not found" 
          subtitle="The receipt may have been deleted or you don't have access" 
        />
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load receipt details</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/receipts">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Receipts
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="ml-2"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Receipt ${receipt.receiptNumber}`}
        subtitle="QR-verified digital receipt"
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/receipts">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> All
              </Link>
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1.5" /> Print
            </Button>
            <Button variant="outline" onClick={copyVerificationLink}>
              <Share2 className="h-4 w-4 mr-1.5" /> Share
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-gradient-hero">
              <Download className="h-4 w-4 mr-1.5" /> PDF
            </Button>
          </div>
        }
      />

      <Card className="max-w-2xl mx-auto p-8 bg-gradient-card border-border/40 shadow-elegant print:shadow-none print:border print:bg-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-gold-foreground" />
            </div>
            <div>
              <div className="font-bold">LOGMAS</div>
              <div className="text-xs text-muted-foreground">Odeda Local Government Area</div>
            </div>
          </div>
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Paid
          </Badge>
        </div>

        {/* Amount */}
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Official Receipt
          </div>
          <div className="text-3xl font-bold mt-1">₦{receipt.amount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-1">
            Paid {new Date(receipt.paidAt).toLocaleString()}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <Row label="Receipt No." value={receipt.receiptNumber} />
          <Row label="Verification Code" value={receipt.verificationCode} />
          <Row label="Invoice Ref." value={receipt.invoiceRef} />
          <Row label="Payment Method" value={receipt.paymentMethod.toUpperCase()} />
          <Row label="Customer" value={receipt.customerName} />
          <Row label="Phone" value={receipt.phone} />
          <Row label="Levy Type" value={receipt.levyType} />
          {receipt.officerName && <Row label="Officer" value={receipt.officerName} />}
          {receipt.invoice?.address && <Row label="Address" value={receipt.invoice.address} />}
        </div>

        {/* QR Code Section */}
        <div className="flex items-center justify-center gap-6 p-4 rounded-lg bg-muted/30 border border-border/60">
          <QRCodeSVG value={verifyUrl} size={130} />
          <div className="text-xs space-y-1.5 max-w-[180px]">
            <div className="font-semibold">Verify authenticity</div>
            <div className="text-muted-foreground">
              Scan the QR code or visit our verification page.
            </div>
            <div className="font-mono text-[10px] break-all">{receipt.verificationCode}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-muted-foreground mt-6 pt-4 border-t border-border/60">
          This is an electronically generated receipt and is valid without a signature.
          <br />
          Odeda Local Government Council © {new Date().getFullYear()}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium font-mono text-sm break-all">{value}</div>
    </div>
  );
}

// Skeleton component for loading state
function ReceiptSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto p-8 bg-gradient-card border-border/40">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-border/60">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Amount Skeleton */}
      <div className="text-center mb-6">
        <Skeleton className="h-3 w-24 mx-auto mb-2" />
        <Skeleton className="h-9 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* QR Code Skeleton */}
      <div className="flex items-center justify-center gap-6 p-4 rounded-lg bg-muted/30 border border-border/60">
        <Skeleton className="h-[130px] w-[130px] rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="text-center mt-6 pt-4 border-t border-border/60">
        <Skeleton className="h-3 w-48 mx-auto mb-1" />
        <Skeleton className="h-3 w-64 mx-auto" />
      </div>
    </Card>
  );
}