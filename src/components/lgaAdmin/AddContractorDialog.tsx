import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRevenueCategories } from "@/hooks/queries/useRevenueCategories";
import { useWards } from "@/hooks/queries/useWards";

const contractorSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  commission: z.number().min(0).max(100).optional(),
  scopeIds: z.array(z.string()).min(1, "Select at least one levy category"),
  wardIds: z.array(z.string()).min(1, "Select at least one ward"),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface AddContractorDialogProps {
  onCreate: (data: ContractorFormData) => void;
  isCreating: boolean;
}

export function AddContractorDialog({ onCreate, isCreating }: AddContractorDialogProps) {
  const [open, setOpen] = useState(false);
  const { categories } = useRevenueCategories("LEVY");
  const { wards } = useWards();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: { 
      companyName: "Lover", 
      contactName: "kvknrvk", 
      email: "kfnfk@nfkfr.rfmrf", 
      phone: "1", 
      address: "flfrfr", 
      commission: 0,
      scopeIds: [],
      wardIds: [],
    },
  });

  const selectedScopeIds = watch("scopeIds");
  const selectedWardIds = watch("wardIds");

  const handleAddScope = (scopeId: string) => {
    if (!selectedScopeIds.includes(scopeId)) {
      setValue("scopeIds", [...selectedScopeIds, scopeId]);
    }
  };

  const handleRemoveScope = (scopeId: string) => {
    setValue("scopeIds", selectedScopeIds.filter(id => id !== scopeId));
  };

  const handleAddWard = (wardId: string) => {
    if (!selectedWardIds.includes(wardId)) {
      setValue("wardIds", [...selectedWardIds, wardId]);
    }
  };

  const handleRemoveWard = (wardId: string) => {
    setValue("wardIds", selectedWardIds.filter(id => id !== wardId));
  };

  const selectedScopes = categories.filter(cat => selectedScopeIds.includes(cat.id));
  const selectedWards = wards.filter(ward => selectedWardIds.includes(ward.id));

  const onSubmit = (data: ContractorFormData) => {
    console.log(data);
    
    onCreate(data);
    // setOpen(false);
    // reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-hero shadow-elegant">
          <Plus className="h-4 w-4 mr-1.5" />
          New Contractor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Onboard New Contractor</DialogTitle>
          <DialogDescription>
            Create a revenue collection contractor account. They will be able to deploy and manage
            their own field agents under the LGA.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name *</Label>
              <Input {...register("companyName")} className={errors.companyName ? "border-red-500" : ""} />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
            </div>
            <div>
              <Label>Contact Person *</Label>
              <Input {...register("contactName")} className={errors.contactName ? "border-red-500" : ""} />
              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName.message}</p>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Textarea {...register("address")} rows={2} />
          </div>

          {/* Commission Rate */}
          <div>
            <Label>Commission Rate (%)</Label>
            <Input type="number" {...register("commission", { valueAsNumber: true })} step="0.5" />
            <p className="text-xs text-muted-foreground mt-1">Percentage of collected revenue</p>
          </div>

          {/* Scope of Collection (Levies) - Multi Select */}
          <div>
            <Label>Scope of Collection (Levies) *</Label>
            <div className="flex gap-2 mt-1.5">
              <Select onValueChange={handleAddScope}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select levy category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(cat => !selectedScopeIds.includes(cat.id))
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedScopes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedScopes.map((scope) => (
                  <Badge key={scope.id} variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                    {scope.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveScope(scope.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.scopeIds && (
              <p className="text-xs text-red-500 mt-1">{errors.scopeIds.message}</p>
            )}
          </div>

          {/* Assigned Wards - Multi Select */}
          <div>
            <Label>Assigned Wards *</Label>
            <div className="flex gap-2 mt-1.5">
              <Select onValueChange={handleAddWard}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select ward..." />
                </SelectTrigger>
                <SelectContent>
                  {wards
                    .filter(ward => !selectedWardIds.includes(ward.id))
                    .map((ward) => (
                      <SelectItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedWards.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedWards.map((ward) => (
                  <Badge key={ward.id} variant="outline" className="gap-1 pl-2 pr-1 py-1">
                    {ward.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveWard(ward.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.wardIds && (
              <p className="text-xs text-red-500 mt-1">{errors.wardIds.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Contractor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}