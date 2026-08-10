/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLevyConfigs } from "@/hooks/queries/useTreasurer";
import { useQueryClient } from "@tanstack/react-query";
import { useRevenueCategories } from "@/hooks/queries/useRevenueCategories";

const levySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  mode: z.enum(["fixed", "variable"]),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  billingCycle: z.enum(["daily", "weekly", "monthly", "yearly", "one_time"]),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
});

type LevyFormData = z.infer<typeof levySchema>;

interface LevyDialogProps {
  existing?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function LevyDialog({ existing, trigger, onSuccess }: LevyDialogProps) {
  const [open, setOpen] = useState(false);
  const { createLevyConfigAsync, isCreating, updateLevyConfigAsync, isUpdating } = useLevyConfigs();

  const isEditing = !!existing;
  const isLoading = isCreating || isUpdating;

  const { categories:data, isLoading: isGettingCat } = useRevenueCategories("LEVY");

  // Pull dynamically populated categories from TanStack Cache
  const cachedCat = data

  // Maps id (UUID string) as value instead of the old hardcoded text slug
  const categories =
    cachedCat?.filter((ele: any) => ele.type === "LEVY").map((ele: any) => ({
      value: ele.id,
      label: ele.name,
    })) ?? [];

    // console.log(categories,"categories",cachedCat)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LevyFormData>({
    resolver: zodResolver(levySchema),
    defaultValues: {
      name: "",
      mode: "fixed",
      categoryId: "", // tracks UUID now
      description: "",
      amount: 0,
      billingCycle: "yearly",
      effectiveFrom: new Date().toISOString().split("T")[0],
      effectiveTo: "",
    },
  });

  useEffect(() => {
    if (existing && open) {
      reset({
        name: existing.name || "",
        categoryId: existing.categoryId || existing.category?.id || "", // safely hooks relational objects
        description: existing.description || "",
        mode: existing.mode || "fixed",
        amount: existing.unitPrice || existing.amount,
        billingCycle: existing.billingCycle || "yearly",
        effectiveFrom:
          existing.effectiveFrom?.split("T")[0] || new Date().toISOString().split("T")[0],
        effectiveTo: existing.effectiveTo?.split("T")[0] || "",
      });
    } else if (!open) {
      reset();
    }
  }, [existing, open, reset]);

  const onSubmit = async (data: LevyFormData) => {
    try {
      if (isEditing) {
        const updatedValue = await updateLevyConfigAsync({
          id: existing.id,
          data: {
            name: data.name,
            mode: data.mode,
            description: data.description,
            amount: data.amount,
            billingCycle: data.billingCycle,
            effectiveTo: data.effectiveTo === "" ? undefined : data.effectiveTo, // strips out empty input values safely
          },
        });

        if (updatedValue) {
          setOpen(false);
        }
      } else {
        const newData = await createLevyConfigAsync({
          name: data.name,
          mode: data.mode,
          categoryId: data.categoryId, // sent down precisely to backend router handlers
          description: data.description,
          amount: data.amount,
          billingCycle: data.billingCycle,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo === "" ? undefined : data.effectiveTo,
        });
        if (newData) {
          setOpen(false);
        }
      }
      onSuccess?.();
    } catch (error) {
      // Mutation handler boundary catches failure toast notifications automatically
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Create Levy</Button>}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Levy Configuration" : "Create New Levy Configuration"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g., Annual Trade Permit"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Category *</Label>
              <Select
                value={watch("categoryId")}
                onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}
                disabled={isGettingCat || isEditing}
              >
                <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} rows={2} placeholder="Optional description" />
            </div>
            <div>
              <Label>Mode</Label>
             <Select
                value={watch("mode")}
                onValueChange={(v) => setValue("mode", v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Amount (₦) *</Label>
              <Input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label>Billing Cycle</Label>
              <Select
                value={watch("billingCycle")}
                onValueChange={(v) => setValue("billingCycle", v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Effective From</Label>
              <Input type="date" {...register("effectiveFrom")} />
            </div>

            <div>
              <Label>Effective To (Optional)</Label>
              <Input type="date" {...register("effectiveTo")} />
              <p className="text-xs text-muted-foreground mt-1">Leave empty for indefinite</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-hero">
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {isEditing ? "Update" : "Create"} Levy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
