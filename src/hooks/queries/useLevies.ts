import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessService, type LevyPrice } from "@/services/business";

export const leviesKeys = {
  all: ["levies"] as const,
};

export function useLevies() {
  return useQuery({
    queryKey: leviesKeys.all,
    queryFn: () => businessService.listLevies(),
  });
}

export function useUpsertLevy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LevyPrice) => businessService.upsertLevy(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leviesKeys.all });
      toast.success("Levy saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteLevy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessService.deleteLevy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leviesKeys.all });
      toast.success("Levy deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
