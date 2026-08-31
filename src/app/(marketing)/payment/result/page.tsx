/* eslint-disable react-hooks/set-state-in-effect */
// app/payment/result/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { invoicesService } from "@/services/apiInvoice";
import Link from "next/link";
import { FullPageLoader } from "@/components/ProtectedRoute";

type ResultState = "verifying" | "confirmed" | "pending" | "failed" | "error";

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader title="payment result page" />}>
      <PaymentResultPage />
    </Suspense>
  );
}

function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Paystack sends both of these on redirect — reference is the modern name,
  // trxref is kept for older integrations. Cover both.
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  const [state, setState] = useState<ResultState>("verifying");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!reference) {
      setState("error");
      setMessage("No payment reference found in the URL.");
      return;
    }

    invoicesService
      .verifyPayment(reference)
      .then((res) => {
        setInvoiceNumber(res.invoice?.invoiceNumber ?? null);

        if (res.status === "confirmed") {
          setState("confirmed");
          setMessage("Payment confirmed successfully.");
        } else if (res.status === "failed" || res.status === "abandoned") {
          setState("failed");
          setMessage("This payment was not completed.");
        } else {
          // Paystack says success but our side hasn't flipped yet (rare race with webhook),
          // or the transaction is still processing.
          setState("pending");
          setMessage("Your payment is still being confirmed. This can take a few seconds.");
        }
      })
      .catch((err) => {
        setState("error");
        setMessage(err?.message ?? "Could not verify payment status.");
      });

    // Clear the stashed reference regardless of outcome — this page's own verify
    // call replaces the need for the invoice-detail page to auto-check it again.
    sessionStorage.removeItem("pendingPaymentReference");
  }, [reference]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full text-center space-y-4">
        {state === "verifying" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <h2 className="text-lg font-semibold">Verifying your payment…</h2>
            <p className="text-sm text-muted-foreground">Please don't close this page.</p>
          </>
        )}

        {state === "confirmed" && (
          <>
            <CheckCircle2 className="h-10 w-10 mx-auto text-success" />
            <h2 className="text-lg font-semibold">Payment Confirmed</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild className="w-full bg-gradient-hero">
              <Link href={invoiceNumber ? `/dashboard/invoices/${invoiceNumber}` : "/dashboard"}>
                View details
              </Link>
            </Button>
          </>
        )}

        {state === "pending" && (
          <>
            <Clock className="h-10 w-10 mx-auto text-warning" />
            <h2 className="text-lg font-semibold">Still Processing</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Check again
            </Button>
          </>
        )}

        {(state === "failed" || state === "error") && (
          <>
            <XCircle className="h-10 w-10 mx-auto text-destructive" />
            <h2 className="text-lg font-semibold">
              {state === "failed" ? "Payment Not Completed" : "Something Went Wrong"}
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(invoiceNumber ? `/dashboard/invoices/${invoiceNumber}` : "/dashboard")}
            >
              Back to invoice
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}