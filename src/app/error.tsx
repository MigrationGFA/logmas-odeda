"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <ErrorState
          title="Something went wrong"
          message={error.message || "An unexpected system error occurred."}
          onRetry={() => reset()}
        />
        <div className="flex justify-center mt-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
