/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  businessService,
  CreateBusinessData,
  UpdateBusinessData,
  ApplyForPermitData,
  RenewPermitData,
  InvoiceStatus,
  FormattedPermit,
  Permit,
} from "@/services/apiBusiness";

export const businessKeys = {
  all: ["business"] as const,
  profile: () => [...businessKeys.all, "profile"] as const,
  permits: () => [...businessKeys.all, "permits"] as const,
  permit: (id: string) => [...businessKeys.permits(), id] as const,
  invoices: () => [...businessKeys.all, "invoices"] as const,
  invoice: (id: string) => [...businessKeys.invoices(), id] as const,
  verify: (code: string) => [...businessKeys.all, "verify", code] as const,
};

// Hook for business profile operations
export function useBusinessProfile(enabled: boolean) {
  const queryClient = useQueryClient();

  // Get my business profile
  const {
    data: business,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: businessKeys.profile(),
    queryFn: () => businessService.getMyBusiness(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false; // Don't retry if business not found
      return failureCount < 3;
    },
  });

  // Create business
  const createBusinessMutation = useMutation({
    mutationFn: (data: CreateBusinessData) => businessService.createBusiness(data),
    onSuccess: (data) => {
      toast.success("Business registered successfully");
      queryClient.setQueryData(businessKeys.profile(), data);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register business");
    },
  });

  // Update business
  const updateBusinessMutation = useMutation({
    mutationFn: (data: UpdateBusinessData) => businessService.updateMyBusiness(data),
    onSuccess: (data) => {
      toast.success("Business profile updated");
      queryClient.setQueryData(businessKeys.profile(), data);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update business");
    },
  });

  return {
    business,
    isLoading,
    error,
    refetch,
    hasBusiness: !!business,
    createBusiness: createBusinessMutation.mutate,
    createBusinessAsync: createBusinessMutation.mutateAsync,
    isCreating: createBusinessMutation.isPending,
    updateBusiness: updateBusinessMutation.mutate,
    updateBusinessAsync: updateBusinessMutation.mutateAsync,
    isUpdating: updateBusinessMutation.isPending,
  };
}

// Hook for permit operations
export function useBusinessPermits() {
  const queryClient = useQueryClient();

  // Get all my permits (returns formatted permits directly)
  const {
    data: permits,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: businessKeys.permits(),
    queryFn: () => businessService.getMyPermits(),
    staleTime: 2 * 60 * 1000,
  });

  // Get single permit by ID
  const useGetPermit = (id: string) => {
    return useQuery({
      queryKey: businessKeys.permit(id),
      queryFn: () => businessService.getMyPermitById(id),
      enabled: !!id,
    });
  };
  // Apply for permit
  const applyForPermitMutation = useMutation({
    mutationFn: (data: ApplyForPermitData) => businessService.applyForPermit(data),
    onSuccess: (response) => {
      toast.success("Permit application submitted. Proceed to payment.");
      queryClient.invalidateQueries({ queryKey: businessKeys.permits() });
      queryClient.invalidateQueries({ queryKey: businessKeys.invoices() });
    },
    onError: (error: any) => {

      toast.error(error.message || "Failed to apply for permit");
    },
  });

  // Renew permit
  const renewPermitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RenewPermitData }) =>
      businessService.renewPermit(id, data),
    onSuccess: (response) => {
      toast.success("Permit renewal initiated. Proceed to payment.");
      queryClient.invalidateQueries({ queryKey: businessKeys.permits() });
      queryClient.invalidateQueries({ queryKey: businessKeys.invoices() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to renew permit");
    },
  });

  // Helper: Get active permits (not expired)
  const getActivePermits = (): Permit[] => {
    // console.log(permits,"1")
    if (!permits) return [];
    const now = new Date();

    return permits?.filter((p) => p.status === "issued" && new Date(p.expiryDate) > now) ?? [];
  };

  // Helper: Get expired permits
  const getExpiredPermits = (): Permit[] => {
    if (!permits) return [];
    const now = new Date();
    return permits.filter(
      (p) => p.status === "expired" || (p.status === "issued" && new Date(p.expiryDate) <= now),
    );
  };

  // Helper: Get pending permits
  const getPendingPermits = (): Permit[] => {
    if (!permits) return [];
    return permits.filter((p) => p.status === "pending_payment");
  };

  return {
    permits,
    isLoading,
    error,
    refetch,
    useGetPermit,
    applyForPermit: applyForPermitMutation.mutate,
    applyForPermitAsync: applyForPermitMutation.mutateAsync,
    isApplying: applyForPermitMutation.isPending,
    renewPermit: renewPermitMutation.mutate,
    renewPermitAsync: renewPermitMutation.mutateAsync,
    isRenewing: renewPermitMutation.isPending,
    activePermits: getActivePermits(),
    expiredPermits: getExpiredPermits(),
    pendingPermits: getPendingPermits(),
  };
}

// Hook for business invoice operations
export function useBusinessInvoices() {
  const queryClient = useQueryClient();

  // Get all my invoices
  const useGetInvoices = (params?: { status?: InvoiceStatus; page?: number; limit?: number }) => {
    return useQuery({
      queryKey: [...businessKeys.invoices(), params],
      queryFn: () => businessService.getMyInvoices(params),
    });
  };

  // Get single invoice by ID
  const useGetInvoice = (id: string) => {
    return useQuery({
      queryKey: businessKeys.invoice(id),
      queryFn: () => businessService.getMyInvoiceById(id),
      enabled: !!id,
    });
  };

  return {
    useGetInvoices,
    useGetInvoice,
  };
}

// Hook for public permit verification
export function useVerifyPermit() {
  const useVerify = (code: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: businessKeys.verify(code),
      queryFn: () => businessService.verifyPermit(code),
      enabled: enabled && !!code,
      retry: 1,
    });
  };

  return { useVerify };
}

// Combined hook for business dashboard
export function useBusiness() {
  // const profile = useBusinessProfile();
  const permits = useBusinessPermits();
  const invoices = useBusinessInvoices();

  // Check if business is registered
  // const isRegistered = profile.hasBusiness;

  return {
    // profile,
    permits,
    invoices,
    // isRegistered,
  };
}
