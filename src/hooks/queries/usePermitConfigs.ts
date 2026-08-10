import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessService, type PermitConfig } from "@/services/business";

export const permitConfigsKeys = {
  all: ["permit-configs"] as const,
};

export function usePermitConfigs() {
  return useQuery({
    queryKey: permitConfigsKeys.all,
    queryFn: () => businessService.listPermitConfigs(),
  });
}

export function useUpsertPermitConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PermitConfig) => businessService.upsertPermitConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitConfigsKeys.all });
      toast.success("Permit configuration saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useTogglePermitConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessService.togglePermitConfig(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitConfigsKeys.all });
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePermitConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessService.deletePermitConfig(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitConfigsKeys.all });
      toast.success("Configuration removed");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
