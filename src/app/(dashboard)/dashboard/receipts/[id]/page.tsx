"use client";

import React, { use } from "react";
import { PageHeader } from "@/components/dashboard/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useReceiptDetails } from "@/hooks/queries/useReceipts";
import { ReceiptViewer } from "@/components/receipt/ReceiptViewer";
import Link from "next/link";

export default function ReceiptDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: receiptId } = use(params);
  const { receipt, isLoading, error, refetch } = useReceiptDetails(receiptId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <PageHeader
          title="Official Receipt"
          subtitle="Loading electronic receipt..."
        />
        <ReceiptSkeleton />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <PageHeader
          title="Receipt not found"
          subtitle="The receipt may have been deleted or you don't have access"
        />
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load receipt details</p>
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

  return <ReceiptViewer receipt={receipt} showBackToDashboard={true} />;
}

// Skeleton component for loading state
function ReceiptSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto p-8 bg-gradient-card border-border/40 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-[450px] w-full rounded-xl" />
    </Card>
  );
}
