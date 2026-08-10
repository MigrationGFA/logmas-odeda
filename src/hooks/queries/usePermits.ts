import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { permitsService, type TradePermit } from "@/services/permits";
import type { CreatePermitInput } from "@/lib/store";

export const permitsKeys = {
  all: ["permits"] as const,
  list: (f?: Record<string, unknown>) => ["permits", f ?? {}] as const,
  detail: (id: string) => ["permits", id] as const,
  types: ["permit-types"] as const,
};

export function usePermits(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: permitsKeys.list(filters),
    queryFn: () => permitsService.listPermits(filters),
  });
}

export function usePermit(id: string | undefined) {
  return useQuery({
    queryKey: id ? permitsKeys.detail(id) : ["permits", "noop"],
    queryFn: () => permitsService.getPermit(id as string),
    enabled: !!id,
  });
}

export function usePermitTypes() {
  return useQuery({
    queryKey: permitsKeys.types,
    queryFn: () => permitsService.listPermitTypes(),
  });
}

export function useCreatePermit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TradePermit> & Partial<CreatePermitInput>) =>
      permitsService.createPermit(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitsKeys.all });
      toast.success("Permit application submitted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useIssuePermit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor, actorRole }: { id: string; actor: string; actorRole: string }) =>
      permitsService.issuePermit(id, actor, actorRole),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitsKeys.all });
      toast.success("Permit issued");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApprovePermit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => permitsService.approvePermit(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permitsKeys.all });
      toast.success("Permit approved");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
