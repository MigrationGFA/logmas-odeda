"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useWards } from "@/hooks/queries/useWards";
import { useRevenueCategories } from "@/hooks/queries/useRevenueCategories";
import { Contractor } from "@/services/apiLgaAdmin";

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  wardId: z.string().min(1, "Ward selection is required"),
  levyConfigId: z.string().min(1, "Levy category selection is required"),
});

type AgentFormData = z.infer<typeof agentSchema>;

interface AddAgentDialogProps {
  contractor: Contractor;
  onAddAgent: (data: AgentFormData) => void;
  isAdding: boolean;
}

export function AddAgentDialog({ contractor, onAddAgent, isAdding }: AddAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const { wards } = useWards();
  const { categories } = useRevenueCategories("LEVY");

  // Filter wards based on contractor's assigned wards (if any)
  const availableWards = contractor.wards?.length
    ? wards.filter((ward) => contractor.wards.includes(ward.name))
    : wards;

  // Filter levies based on contractor's scope (if any)
  const availableLevies = useMemo(() => {
    return contractor.scope?.length
      ? categories.filter((cat) => contractor.scope!.includes(cat.name))
      : categories;
  }, [contractor.scope, categories]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      wardId: "",
      levyConfigId: "",
    },
  });

  const onSubmit = (data: AgentFormData) => {
    onAddAgent(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs">
          <UserPlus className="h-3 w-3 mr-1" />
          Add Field Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Field Agent</DialogTitle>
          <DialogDescription>
            Deploy a field collection agent under{" "}
            <span className="font-medium">{contractor.companyName}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              placeholder="e.g., John Doe"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              placeholder="agent@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Phone</Label>
            <Input {...register("phone")} placeholder="+234 801 234 5678" />
          </div>

          <div>
            <Label>Assigned Ward *</Label>
            <Select onValueChange={(value) => setValue("wardId", value)}>
              <SelectTrigger className={errors.wardId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {availableWards.map((ward) => (
                  <SelectItem key={ward.id} value={ward.id}>
                    {ward.name}
                  </SelectItem>
                ))}
                {availableWards.length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    No wards available for this contractor
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.wardId && <p className="text-xs text-red-500 mt-1">{errors.wardId.message}</p>}
          </div>

          <div>
            <Label>Primary Levy Category *</Label>
            <Select onValueChange={(value) => setValue("levyConfigId", value)}>
              <SelectTrigger className={errors.levyConfigId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select levy category" />
              </SelectTrigger>
              <SelectContent>
                {availableLevies.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                {availableLevies.length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    No levy categories available for this contractor
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.levyConfigId && (
              <p className="text-xs text-red-500 mt-1">{errors.levyConfigId.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
