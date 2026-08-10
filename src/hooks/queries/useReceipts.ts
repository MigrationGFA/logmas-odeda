import { useQuery } from "@tanstack/react-query";
import { receiptsService, Receipt, ReceiptDetails } from "@/services/apiReceipts";

export const receiptKeys = {
  all: ["receipts"] as const,
  lists: () => [...receiptKeys.all, "list"] as const,
  details: () => [...receiptKeys.all, "detail"] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
};

// Hook for receipts list
export function useReceipts() {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: receiptKeys.lists(),
    queryFn: () => receiptsService.getReceipts(),
    staleTime: 60 * 1000, // 1 minute
  });

  const receipts = response || [];

  return {
    receipts,
    isLoading,
    error,
    refetch,
    hasReceipts: receipts.length > 0,
    count: receipts.length,
  };
}

// Hook for single receipt details
export function useReceiptDetails(receiptId: string) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: receiptKeys.detail(receiptId),
    queryFn: () => receiptsService.getReceiptById(receiptId),
    enabled: !!receiptId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const receipt = response || null;
  const success = response?.status === "success";

  return {
    receipt,
    isLoading,
    error,
    success,
    refetch,
  };
}