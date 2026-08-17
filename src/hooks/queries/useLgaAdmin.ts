/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  lgaAdminService,
  CreateWardData,
  UpdateWardData,
  AssignCouncillorData,
  CreateStaffData,
  UpdateStaffData,
  Role,
  AccountRole,
  CreateContractorData,
  AddAgentData,
  GetPermitsParams,
  AllPermitsResponse,
} from "@/services/apiLgaAdmin";

export const lgaAdminKeys = {
  all: ["lga-admin"] as const,
  wards: () => [...lgaAdminKeys.all, "wards"] as const,
  wardsList: (params?: any) => [...lgaAdminKeys.wards(), params] as const,
  ward: (id: string) => [...lgaAdminKeys.wards(), id] as const,
  staff: () => [...lgaAdminKeys.all, "staff"] as const,
  staffList: (params?: any) => [...lgaAdminKeys.staff(), params] as const,
  staffDetail: (id: string) => [...lgaAdminKeys.staff(), id] as const,
  overview: () => [...lgaAdminKeys.all, "overview"] as const,
  accounts: () => [...lgaAdminKeys.all, "accounts"] as const,
  accountsList: (params?: any) => [...lgaAdminKeys.accounts(), params] as const,
  contractors: () => [...lgaAdminKeys.all, "contractors"] as const,
  contractorsList: (params?: any) =>
    [...lgaAdminKeys.contractors(), params] as const,
  permits: () => [...lgaAdminKeys.all, "permits"] as const,
};

// Top-level Query Hooks
export function useGetWards(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: lgaAdminKeys.wardsList(params),
    queryFn: () => lgaAdminService.listWards(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetWard(id: string) {
  return useQuery({
    queryKey: lgaAdminKeys.ward(id),
    queryFn: () => lgaAdminService.getWardById(id),
    enabled: !!id,
  });
}

export function useGetStaff(params?: {
  role?: Role;
  wardId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: lgaAdminKeys.staffList(params),
    queryFn: () => lgaAdminService.listStaff(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useGetStaffDetail(id: string) {
  return useQuery({
    queryKey: lgaAdminKeys.staffDetail(id),
    queryFn: () => lgaAdminService.getStaffById(id),
    enabled: !!id,
  });
}

export function useGetContractors(params?: { search?: string }) {
  return useQuery({
    queryKey: lgaAdminKeys.contractorsList(params),
    queryFn: () => lgaAdminService.getContractorsOverview(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetAccounts(params?: {
  search?: string;
  role?: AccountRole;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: lgaAdminKeys.accountsList(params),
    queryFn: () => lgaAdminService.getAccountsOverview(params),
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
}

// Ward Management Hooks
export function useWardManagement() {
  const queryClient = useQueryClient();

  const createWardMutation = useMutation({
    mutationFn: (data: CreateWardData) => lgaAdminService.createWard(data),
    onSuccess: (data) => {
      toast.success(`Ward "${data.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.wards() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create ward");
    },
  });

  const updateWardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWardData }) =>
      lgaAdminService.updateWard(id, data),
    onSuccess: () => {
      toast.success("Ward updated successfully");
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.wards() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update ward");
    },
  });

  const assignCouncillorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignCouncillorData }) =>
      lgaAdminService.assignCouncillor(id, data),
    onSuccess: () => {
      toast.success("Councillor assigned successfully");
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.wards() });
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.staff() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign councillor");
    },
  });

  const deleteWardMutation = useMutation({
    mutationFn: (id: string) => lgaAdminService.deleteWard(id),
    onSuccess: () => {
      toast.success("Ward deactivated successfully");
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.wards() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete ward");
    },
  });

  return {
    useGetWards,
    useGetWard,
    createWard: createWardMutation.mutate,
    createWardAsync: createWardMutation.mutateAsync,
    isCreating: createWardMutation.isPending,
    updateWard: updateWardMutation.mutate,
    updateWardAsync: updateWardMutation.mutateAsync,
    isUpdating: updateWardMutation.isPending,
    assignCouncillor: assignCouncillorMutation.mutate,
    assignCouncillorAsync: assignCouncillorMutation.mutateAsync,
    isAssigning: assignCouncillorMutation.isPending,
    deleteWard: deleteWardMutation.mutate,
    deleteWardAsync: deleteWardMutation.mutateAsync,
    isDeleting: deleteWardMutation.isPending,
  };
}

// Staff Management Hooks
export function useStaffManagement() {
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: (data: CreateStaffData) => lgaAdminService.createStaff(data),
    onSuccess: (response) => {
      toast.success(`Staff member "${response.name}" created`);
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.staff() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create staff member");
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffData }) =>
      lgaAdminService.updateStaff(id, data),
    onSuccess: () => {
      toast.success("Staff member updated successfully");
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.staff() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update staff member");
    },
  });

  const toggleStaffStatusMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      lgaAdminService.toggleStaffStatus(id, reason),
    onSuccess: (response) => {
      toast.success(
        `Staff member ${response.isActive ? "activated" : "deactivated"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.staff() });
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.accounts() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update staff status");
    },
  });

  return {
    useGetStaff,
    useGetStaffDetail,
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    isCreating: createStaffMutation.isPending,
    updateStaff: updateStaffMutation.mutate,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    isUpdating: updateStaffMutation.isPending,
    toggleStaffStatus: toggleStaffStatusMutation.mutate,
    toggleStaffStatusAsync: toggleStaffStatusMutation.mutateAsync,
    isToggling: toggleStaffStatusMutation.isPending,
  };
}

// Contractors Management Hooks
export function useContractorsManagement() {
  const queryClient = useQueryClient();

  const createContractorMutation = useMutation({
    mutationFn: (data: CreateContractorData) =>
      lgaAdminService.createContractor(data),
    onSuccess: (response) => {
      toast.success(
        `Contractor "${response.contractor.firstName} ${response.contractor.lastName}" created`
      );
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.contractors() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create contractor");
    },
  });

  const addAgentMutation = useMutation({
    mutationFn: ({
      contractorId,
      data,
    }: {
      contractorId: string;
      data: AddAgentData;
    }) => lgaAdminService.addAgentToContractor(contractorId, data),
    onSuccess: (response) => {
      toast.success(
        `Agent ${response.agent.firstName} ${response.agent.lastName} added successfully`
      );
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.contractors() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add agent");
    },
  });

  return {
    useGetContractors,
    createContractor: createContractorMutation.mutate,
    createContractorAsync: createContractorMutation.mutateAsync,
    isCreatingContractor: createContractorMutation.isPending,
    addAgent: addAgentMutation.mutate,
    addAgentAsync: addAgentMutation.mutateAsync,
    isAddingAgent: addAgentMutation.isPending,
  };
}

// Admin Overview Hook
export function useAdminOverview() {
  const {
    data: overview,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: lgaAdminKeys.overview(),
    queryFn: () => lgaAdminService.getAdminOverview(),
    staleTime: 2 * 60 * 1000,
  });

  const stats = overview?.stats || {
    citizens: 0,
    fieldOfficers: 0,
    pendingApplications: 0,
    totalInvoices: 0,
  };

  const recentApplications = overview?.recentApplications || [];

  return {
    overview,
    stats,
    recentApplications,
    isLoading,
    error,
    refetch,
  };
}

// Account Management Hooks
export function useAccountManagement() {
  const queryClient = useQueryClient();

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => lgaAdminService.resetAccountPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lgaAdminKeys.accounts() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  return {
    useGetAccounts,
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResetting: resetPasswordMutation.isPending,
  };
}

export const usePermits = (params?: GetPermitsParams) => {
  return useQuery<AllPermitsResponse>({
    queryKey: lgaAdminKeys.permits(),
    queryFn: () => lgaAdminService.getAllPermits(params),
  });
};

export const useRevokePermit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, revokeReason }: { id: string; revokeReason?: string }) =>
      lgaAdminService.revokePermit(id, revokeReason),
    onSuccess: (response) => {
      toast.success(`Permit ${response.permitNumber} has been revoked`);
      queryClient.invalidateQueries({ queryKey: ["permits"] });
      queryClient.invalidateQueries({ queryKey: ["permit", response.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to revoke permit");
    },
  });
};

// Combined LGA Admin Hook
export function useLgaAdmin() {
  const wards = useWardManagement();
  const staff = useStaffManagement();
  const accounts = useAccountManagement();
  const contractors = useContractorsManagement();

  return {
    wards,
    staff,
    accounts,
    contractors,
  };
}
