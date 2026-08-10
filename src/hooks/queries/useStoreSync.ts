import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Mock-mode glue: when the in-memory store mutates it fires a `logmas:store-change`
 * window event. We invalidate every active server-state query so hook-based reads
 * (useCustomers, useInvoices, …) stay in sync with direct `store.ts` mutator calls.
 *
 * Once the real backend is online and MOCK_MODE is off, the store stops firing
 * the event for that code path and this becomes a cheap no-op.
 */
export function useStoreToQuerySync() {
  const qc = useQueryClient();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      qc.invalidateQueries();
    };
    window.addEventListener("logmas:store-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("logmas:store-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [qc]);
}
