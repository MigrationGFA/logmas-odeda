"use client";

import React, { use } from "react";
import { useSearchParams } from "next/navigation";
import { PostPaymentCompletionForm } from "@/components/applications/PostPaymentCompletionForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationCompletePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const applicationId = resolvedParams.id;
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  return (
    <PostPaymentCompletionForm
      applicationId={applicationId}
      reference={reference}
    />
  );
}
