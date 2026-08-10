import { Ward, wardsService } from "@/services/apiWard";
import { useQuery } from "@tanstack/react-query";

export const wardsKeys = {
  all: ["wards"] as const,
  list: () => [...wardsKeys.all, "list"] as const,
};

export function useWards() {
  // Get all wards list
  const {
    data: wardsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: wardsKeys.list(),
    queryFn: () => wardsService.getWardsList(),
    staleTime: 5 * 60 * 1000, // 5 minutes (wards don't change often)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract the wards array from response
  const wards = wardsResponse || [];
  const count = wardsResponse?.length || 0;

  // Helper function to get ward name by ID
  const getWardName = (wardId: string): string => {
    const ward = wards.find(w => w.id === wardId);
    return ward?.name || "Unknown Ward";
  };

  // Helper function to get ward by ID
  const getWardById = (wardId: string): Ward | undefined => {
    return wards.find(w => w.id === wardId);
  };

  // Helper function to get ward code by ID
  const getWardCode = (wardId: string): string => {
    const ward = wards.find(w => w.id === wardId);
    return ward?.code || "N/A";
  };

  return {
    // Data
    wards,
    count,
    isLoading,
    error,
    refetch,
    
    // Helper functions
    getWardName,
    getWardById,
    getWardCode,
    
    // For dropdown/select components
    wardOptions: wards.map(ward => ({
      label: ward.name,
      value: ward.id,
      code: ward.code,
    })),
  };
}