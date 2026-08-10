import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { businessService, type Customer } from "@/services/business";

export const customersKeys = {
  all: ["customers"] as const,
  detail: (id: string) => ["customers", id] as const,
};

export function useCustomers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...customersKeys.all, params ?? {}],
    queryFn: () => businessService.listCustomers(params),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: id ? customersKeys.detail(id) : ["customers", "noop"],
    queryFn: () => businessService.getCustomer(id as string),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => businessService.createCustomer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.all });
      toast.success("Customer created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      businessService.updateCustomer(id, data),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: customersKeys.all });
      qc.invalidateQueries({ queryKey: customersKeys.detail(v.id) });
      toast.success("Customer updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessService.deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.all });
      toast.success("Customer removed");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
