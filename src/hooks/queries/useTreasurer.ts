/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  treasurerService,
  CreateLevyConfigData,
  UpdateLevyConfigData,
  CreatePermitConfigData,
  UpdatePermitConfigData,
  RevenueCategory,
  InvoiceStatus,
} from "@/services/apiTreasurer";

export const treasurerKeys = {
  all: ["treasurer"] as const,
  levyConfigs: () => [...treasurerKeys.all, "levy-configs"] as const,
  levyConfigsList: (params?: any) => [...treasurerKeys.levyConfigs(), params] as const,
  levyConfig: (id: string) => [...treasurerKeys.levyConfigs(), id] as const,
  permitConfigs: () => [...treasurerKeys.all, "permit-configs"] as const,
  permitConfigsList: (params?: any) => [...treasurerKeys.permitConfigs(), params] as const,
  permitConfig: (id: string) => [...treasurerKeys.permitConfigs(), id] as const,
  revenue: () => [...treasurerKeys.all, "revenue"] as const,
  revenueOverview: (params?: any) => [...treasurerKeys.revenue(), "overview", params] as const,
  revenueByOfficer: (params?: any) => [...treasurerKeys.revenue(), "by-officer", params] as const,
  revenueByWard: (params?: any) => [...treasurerKeys.revenue(), "by-ward", params] as const,
  reconciliation: (params?: any) => [...treasurerKeys.all, "reconciliation", params] as const,
  invoices: () => [...treasurerKeys.all, "invoices"] as const,
  invoicesList: (params?: any) => [...treasurerKeys.invoices(), params] as const,
  invoice: (id: string) => [...treasurerKeys.invoices(), id] as const,
};

// Levy Configuration Hooks
export function useLevyConfigs() {
  const queryClient = useQueryClient();

  const useGetLevyConfigs = (params?: { isActive?: boolean; page?: number; limit?: number }) => {
    return useQuery({
      queryKey: treasurerKeys.levyConfigsList(params),
      queryFn: () => treasurerService.listLevyConfigs(params),
    });
  };

  const useGetLevyConfig = (id: string) => {
    return useQuery({
      queryKey: treasurerKeys.levyConfig(id),
      queryFn: () => treasurerService.getLevyConfigById(id),
      enabled: !!id,
    });
  };

  const createLevyConfigMutation = useMutation({
    mutationFn: (data: CreateLevyConfigData) => treasurerService.createLevyConfig(data),
    onSuccess: (response) => {
      console.log(response, "response");
      toast.success(`Levy configuration "${response.config.name}" created`);
      if (response.warning) {
        toast.warning(response.warning);
      }
      queryClient.invalidateQueries({ queryKey: treasurerKeys.levyConfigs() });
    },
    onError: (error: any) => {
      console.error(error.message);
      toast.error(error.message || "Failed to create levy configuration");
    },
  });

  const updateLevyConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLevyConfigData }) =>
      treasurerService.updateLevyConfig(id, data),
    onSuccess: () => {
      toast.success("Levy configuration updated");
      queryClient.invalidateQueries({ queryKey: treasurerKeys.levyConfigs() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update levy configuration");
    },
  });

  const toggleLevyConfigMutation = useMutation({
    mutationFn: (id: string) => treasurerService.toggleLevyConfig(id),
    onSuccess: (data) => {
      toast.success(`Levy configuration ${data.isActive ? "activated" : "deactivated"}`);
      queryClient.invalidateQueries({ queryKey: treasurerKeys.levyConfigs() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle levy configuration");
    },
  });

  return {
    useGetLevyConfigs,
    useGetLevyConfig,
    createLevyConfig: createLevyConfigMutation.mutate,
    createLevyConfigAsync: createLevyConfigMutation.mutateAsync,
    isCreating: createLevyConfigMutation.isPending,
    updateLevyConfig: updateLevyConfigMutation.mutate,
    updateLevyConfigAsync: updateLevyConfigMutation.mutateAsync,
    isUpdating: updateLevyConfigMutation.isPending,
    toggleLevyConfig: toggleLevyConfigMutation.mutate,
    toggleLevyConfigAsync: toggleLevyConfigMutation.mutateAsync,
    isToggling: toggleLevyConfigMutation.isPending,
  };
}

// Permit Configuration Hooks
export function usePermitConfigs() {
  const queryClient = useQueryClient();

  const useGetPermitConfigs = (params?: { isActive?: boolean; page?: number; limit?: number }) => {
    return useQuery({
      queryKey: treasurerKeys.permitConfigsList(params),
      queryFn: () => treasurerService.listPermitConfigs(params),
    });
  };

  const createPermitConfigMutation = useMutation({
    mutationFn: (data: CreatePermitConfigData) => treasurerService.createPermitConfig(data),
    onSuccess: () => {
      toast.success("Permit configuration created");
      queryClient.invalidateQueries({ queryKey: treasurerKeys.permitConfigs() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create permit configuration");
    },
  });

  const updatePermitConfigMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermitConfigData }) =>
      treasurerService.updatePermitConfig(id, data),
    onSuccess: () => {
      toast.success("Permit configuration updated");
      queryClient.invalidateQueries({ queryKey: treasurerKeys.permitConfigs() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update permit configuration");
    },
  });

  return {
    useGetPermitConfigs,
    createPermitConfig: createPermitConfigMutation.mutate,
    createPermitConfigAsync: createPermitConfigMutation.mutateAsync,
    isCreating: createPermitConfigMutation.isPending,
    updatePermitConfig: updatePermitConfigMutation.mutate,
    updatePermitConfigAsync: updatePermitConfigMutation.mutateAsync,
    isUpdating: updatePermitConfigMutation.isPending,
  };
}

// Revenue Analytics Hooks
export function useRevenueAnalytics() {
  const useGetRevenueOverview = (params?: { from?: string; to?: string }) => {
    return useQuery({
      queryKey: treasurerKeys.revenueOverview(params),
      queryFn: () => treasurerService.getRevenueOverview(params),
    });
  };

  const useGetRevenueByOfficer = (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: treasurerKeys.revenueByOfficer(params),
      queryFn: () => treasurerService.getRevenueByOfficer(params),
    });
  };

  const useGetRevenueByWard = (params?: { from?: string; to?: string }) => {
    return useQuery({
      queryKey: treasurerKeys.revenueByWard(params),
      queryFn: () => treasurerService.getRevenueByWard(params),
    });
  };

  return {
    useGetRevenueOverview,
    useGetRevenueByOfficer,
    useGetRevenueByWard,
  };
}

// Reconciliation Hook
export function useReconciliation() {
  const useGetReconciliation = (params?: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: treasurerKeys.reconciliation(params),
      queryFn: () => treasurerService.getReconciliation(params),
    });
  };

  return { useGetReconciliation };
}

// Invoice Management Hooks (Treasurer)
export function useTreasurerInvoices() {
  const queryClient = useQueryClient();

  const useGetAllInvoices = (params?: {
    from?: string;
    to?: string;
    status?: InvoiceStatus;
    category?: RevenueCategory;
    officerId?: string;
    businessId?: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: treasurerKeys.invoicesList(params),
      queryFn: () => treasurerService.getAllInvoices(params),
    });
  };

  const useGetInvoice = (id: string) => {
    return useQuery({
      queryKey: treasurerKeys.invoice(id),
      queryFn: () => treasurerService.getInvoiceById(id),
      enabled: !!id,
    });
  };

  const markInvoiceOverdueMutation = useMutation({
    mutationFn: (id: string) => treasurerService.markInvoiceOverdue(id),
    onSuccess: (data) => {
      toast.success(`Invoice ${data.invoiceNumber} marked as overdue`);
      queryClient.invalidateQueries({ queryKey: treasurerKeys.invoices() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark invoice as overdue");
    },
  });

  return {
    useGetAllInvoices,
    useGetInvoice,
    markInvoiceOverdue: markInvoiceOverdueMutation.mutate,
    markInvoiceOverdueAsync: markInvoiceOverdueMutation.mutateAsync,
    isMarkingOverdue: markInvoiceOverdueMutation.isPending,
  };
}
export type TreasurerRole = "treasurer" | "lga_admin" | "super_admin" | "contractor" | "chairman";

export function useTreasurerOfficer(role?: TreasurerRole) {
  return useQuery({
    queryKey: ["field-officers", role],
    queryFn: () => treasurerService.getFieldOfficers(),
    // Only run query if the user is authenticated and has viewing clearance
    enabled:
      !!role &&
      (role === "lga_admin" ||
        role === "super_admin" ||
        role === "contractor" ||
        role === "treasurer" ||
        role === "chairman"),
    staleTime: 1000 * 60 * 5, // Cache entries cleanly for 5 minutes
  });
}

// Combined Treasurer Hook
export function useTreasurer() {
  const levyConfigs = useLevyConfigs();
  const permitConfigs = usePermitConfigs();
  const revenueAnalytics = useRevenueAnalytics();
  const reconciliation = useReconciliation();
  const invoices = useTreasurerInvoices();

  return {
    levyConfigs,
    permitConfigs,
    revenueAnalytics,
    reconciliation,
    invoices,
  };
}
