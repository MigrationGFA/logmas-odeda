"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | { message?: string } | string | null;
  onRetry?: () => void;
  refetch?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Failed to load data",
  message,
  error,
  onRetry,
  refetch,
  className,
  compact = false,
}: ErrorStateProps) {
  const retryHandler = onRetry || refetch;

  const errorMessage =
    message ||
    (typeof error === "string"
      ? error
      : error?.message) ||
    "Something went wrong while retrieving the requested information. Please check your connection and try again.";

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <span>{errorMessage}</span>
        </div>
        {retryHandler && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => retryHandler()}
            className="ml-3 h-8 border-destructive/30 hover:bg-destructive/10 text-destructive"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-destructive/20 bg-destructive/5",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mt-1.5">{errorMessage}</p>
      {retryHandler && (
        <Button
          variant="outline"
          className="mt-4 border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => retryHandler()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
