import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sooService, type FieldOfficer } from "@/services/soo";
import type { OfficerStatus } from "@/lib/store";

export function useFieldOfficers() {
  return useQuery({
    queryKey: ["field-officers"],
    queryFn: () => sooService.listFieldOfficers(),
  });
}

export function useContractors() {
  return useQuery({
    queryKey: ["contractors"],
    queryFn: () => sooService.listContractors(),
  });
}

export function useWards() {
  return useQuery({
    queryKey: ["wards"],
    queryFn: () => sooService.listWards(),
  });
}

export function useCreateFieldOfficer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Omit<FieldOfficer, "id" | "createdAt" | "totalCollected" | "invoicesIssued">,
    ) => sooService.createFieldOfficer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["field-officers"] });
      toast.success("Officer created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSetFieldOfficerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      actor,
      actorRole,
    }: {
      id: string;
      status: OfficerStatus;
      actor: string;
      actorRole: string;
    }) => sooService.setFieldOfficerStatus(id, status, actor, actorRole),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["field-officers"] });
      toast.success(`Officer ${v.status}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
