"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PostPaymentCompletionForm } from "@/components/applications/PostPaymentCompletionForm";
import { FullPageLoader } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ApplicationCompleteQueryComponent() {
  const searchParams = useSearchParams();
  const applicationId =
    searchParams.get("id") ||
    searchParams.get("applicationId") ||
    searchParams.get("appId");
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  if (!applicationId) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="text-center p-6 space-y-4">
          <CardHeader>
            <CardTitle>Missing Application ID</CardTitle>
            <CardDescription>
              No statutory application identifier was provided in the URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/applications">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PostPaymentCompletionForm
      applicationId={applicationId}
      reference={reference}
    />
  );
}

export default function ApplicationCompleteWithQueryPage() {
  return (
    <Suspense fallback={<FullPageLoader title="Application Completion" />}>
      <ApplicationCompleteQueryComponent />
    </Suspense>
  );
}
