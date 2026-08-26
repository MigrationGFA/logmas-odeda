import { useQuery } from "@tanstack/react-query";
import { apiPublicCertificate } from "@/services/apiPublicCertificate";
import { PublicCertificate } from "@/types/publicCertificate";

export const publicCertificateKeys = {
  all: ["public-certificate"] as const,
  detail: (token: string) => [...publicCertificateKeys.all, token] as const,
};

export function usePublicCertificate(token: string, enabled: boolean = true) {
  return useQuery<PublicCertificate, Error>({
    queryKey: publicCertificateKeys.detail(token),
    queryFn: () => apiPublicCertificate.getPublicCertificate(token),
    enabled: !!token && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
}
