/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  stateOfOriginService,
  SubmitApplicationData,
  ForwardApplicationData,
  DecideApplicationData,
} from "@/services/apiStateOfOrigin";
import { ApplicationStatus } from "@/services/apiOverview";
import { lgaAdminService } from "@/services/apiLgaAdmin";

export const stateOfOriginKeys = {
  all: ["state-of-origin"] as const,
  myApplications: () => [...stateOfOriginKeys.all, "my"] as const,
  myApplication: (id: string) =>
    [...stateOfOriginKeys.myApplications(), id] as const,
  adminApplications: () => [...stateOfOriginKeys.all, "admin"] as const,
  adminApplication: (id: string) =>
    [...stateOfOriginKeys.adminApplications(), id] as const,
  councillorQueue: () =>
    [...stateOfOriginKeys.all, "councillor", "queue"] as const,
  verification: (code: string) =>
    [...stateOfOriginKeys.all, "verify", code] as const,
  certificate: (applicantId: string) =>
    [...stateOfOriginKeys.all, "cert", applicantId] as const,
};

// Hook for citizen operations
export function useCitizenStateOfOrigin(enabled: boolean) {
  const queryClient = useQueryClient();

  // Get all my applications
  const {
    data: applications,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: stateOfOriginKeys.myApplications(),
    queryFn: () => stateOfOriginService.getMyApplications(),
    enabled,
  });

  // Get single application by ID
  const useGetMyApplication = (id: string) => {
    return useQuery({
      queryKey: stateOfOriginKeys.myApplication(id),
      queryFn: () => stateOfOriginService.getMyApplicationById(id),
      enabled: !!id,
    });
  };

  // Submit new application
  const submitMutation = useMutation({
    mutationFn: (data: SubmitApplicationData) =>
      stateOfOriginService.submitApplication(data),
    onSuccess: (data) => {
      toast.success(
        "Application submitted successfully! Please proceed to payment.",
      );
      queryClient.invalidateQueries({
        queryKey: stateOfOriginKeys.myApplications(),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  // console.log(applications, "applications in side");

  return {
    applications: applications ?? [],
    isLoading,
    error,
    refetch,
    useGetMyApplication,
    submitApplication: submitMutation.mutate,
    submitApplicationAsync: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  };
}

// Hook for LGA Admin operations
export function useAdminStateOfOrigin() {
  const queryClient = useQueryClient();

  // Get all applications with filters
  const useGetAllApplications = (
    enabled: boolean = true,
    params?: {
      page?: number;
      limit?: number;
      status?: ApplicationStatus;
      wardId?: string;
    },
  ) => {
    return useQuery({
      queryKey: [...stateOfOriginKeys.adminApplications(), params],
      queryFn: () => stateOfOriginService.getAllApplications(params),
      enabled,
    });
  };

  // Update forwardMutation to accept councillorId
  const forwardMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { reviewNotes?: string; councillorId: string }; // ← add councillorId
    }) => stateOfOriginService.forwardToCouncillor(id, data),
    onSuccess: (data, variables) => {
      // toast.success("Application forwarded to Ward Councillor");
      queryClient.invalidateQueries({
        queryKey: stateOfOriginKeys.adminApplications(),
      });
      queryClient.invalidateQueries({
        queryKey: stateOfOriginKeys.adminApplication(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to forward application");
    },
    // ... rest unchanged
  });


 
  // Get single application by ID
  const useGetApplicationById = (id: string) => {
    return useQuery({
      queryKey: stateOfOriginKeys.adminApplication(id),
      queryFn: () => stateOfOriginService.getApplicationById(id),
      enabled: !!id,
    });
  };

  // Forward application to councillor
  // const forwardMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: ForwardApplicationData }) =>
  //     stateOfOriginService.forwardToCouncillor(id, data),
  //   onSuccess: (data, variables) => {
  //     toast.success("Application forwarded to Ward Councillor");
  //     queryClient.invalidateQueries({
  //       queryKey: stateOfOriginKeys.adminApplications(),
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: stateOfOriginKeys.adminApplication(variables.id),
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.message || "Failed to forward application");
  //   },
  // });

  return {
    useGetAllApplications,
    // useGetCouncillors,
    useGetApplicationById,
    forwardToCouncillor: forwardMutation.mutate,
    forwardToCouncillorAsync: forwardMutation.mutateAsync,
    isForwarding: forwardMutation.isPending,
    forwardError: forwardMutation.error,
  };
}

// Hook for Ward Councillor operations
export function useCouncillorStateOfOrigin(enabled: boolean) {
  const queryClient = useQueryClient();

  // Get councillor's queue
  const {
    data: queue,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: stateOfOriginKeys.councillorQueue(),
    queryFn: () => stateOfOriginService.getCouncillorQueue(),
    enabled,
  });

  // Decide on application (approve/reject)
  const decideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DecideApplicationData }) =>
      stateOfOriginService.decideOnApplication(id, data),
    onSuccess: (result, variables) => {
      const decision = variables.data.decision;
      toast.success(
        `Application ${decision} successfully${decision === "approved" ? " and certificate issued" : ""}`,
      );
      queryClient.invalidateQueries({
        queryKey: stateOfOriginKeys.councillorQueue(),
      });
      queryClient.invalidateQueries({
        queryKey: stateOfOriginKeys.adminApplications(),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to process application");
    },
  });

  return {
    queue,
    isLoading,
    error,
    refetch,
    decideOnApplication: decideMutation.mutate,
    decideOnApplicationAsync: decideMutation.mutateAsync,
    isDeciding: decideMutation.isPending,
    decideError: decideMutation.error,
  };
}

// Hook for public verification (no auth)
export function useVerifyCertificate() {
  const useVerify = (code: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: stateOfOriginKeys.verification(code),
      queryFn: () => stateOfOriginService.verifyCertificate(code),
      enabled: enabled && !!code,
      retry: 1,
    });
  };

  return { useVerify };
}
export function useGetCertificateData() {
  const useCertificate = (applicationId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: stateOfOriginKeys.certificate(applicationId),
      queryFn: () => stateOfOriginService.getCertificate(applicationId),
      enabled: enabled && !!applicationId,
      retry: 1,
    });
  };

  return { useCertificate };
}

// Combined hook for dashboard (role-based)
export function useStateOfOriginByRole(role?: string) {
  const citizenHooks = useCitizenStateOfOrigin(false);
  const adminHooks = useAdminStateOfOrigin();
  const councillorHooks = useCouncillorStateOfOrigin(false);

  switch (role) {
    case "citizen":
      return citizenHooks;
    case "lga_admin":
    case "treasurer":
    case "chairman":
      return adminHooks;
    case "ward_councillor":
      return councillorHooks;
    default:
      return citizenHooks;
  }
}
