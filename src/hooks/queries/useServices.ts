/* eslint-disable @typescript-eslint/no-explicit-any */
import { services } from "@/services/apiServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const serviceKey = {
  all: ["services"] as const,
  getBySlug: (slug: string) => [...serviceKey.all, slug] as const,
};

// Hook for citizen operations
export function useServices() {
  const queryClient = useQueryClient();

  // Get all my applications
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: serviceKey.all,
    queryFn: () => services.listServices(),
    // enabled,
  });

  // Get single application by ID
  const useGetServiceBySlug = (slug: string) => {
    return useQuery({
      queryKey: serviceKey.getBySlug(slug),
      queryFn: () => services.getServiceBySlug(slug),
      enabled: !!slug,
    });
  };

  return {
    services: data ?? [],
    isLoading,
    error,
    refetch,
    useGetServiceBySlug,
  };
}

// Hook for public verification (no auth)
// export function useVerifyCertificate() {
//   const useVerify = (code: string, enabled: boolean = true) => {
//     return useQuery({
//       queryKey: serviceKey.verification(code),
//       queryFn: () => stateOfOriginService.verifyCertificate(code),
//       enabled: enabled && !!code,
//       retry: 1,
//     });
//   };

//   return { useVerify };
// }
// export function useGetCertificateData() {
//   const useCertificate = (applicationId: string, enabled: boolean = true) => {
//     return useQuery({
//       queryKey: serviceKey.certificate(applicationId),
//       queryFn: () => stateOfOriginService.getCertificate(applicationId),
//       enabled: enabled && !!applicationId,
//       retry: 1,
//     });
//   };

//   return { useCertificate };
// }
