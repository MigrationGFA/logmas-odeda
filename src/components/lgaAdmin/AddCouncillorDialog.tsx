


import React from 'react'
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  UserPlus,
  Loader2,
} from "lucide-react";
import { CouncillorFormData, councillorSchema } from '@/app/(dashboard)/dashboard/wards/page';


function AddCouncillorDialog({ wards, onCreate, isCreating }: { wards: any[]; onCreate: (data: CouncillorFormData) => void; isCreating: boolean }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CouncillorFormData>({
    resolver: zodResolver(councillorSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", role: "ward_councillor", wardId: "" },
  });

  const onSubmit = (data: CouncillorFormData) => {
    onCreate(data);
    setOpen(false);
    reset();
  };

  const availableWards = wards.filter((w) => !w.councillors?.length);

  console.log(availableWards.filter(ele=>(ele.id)),"availableWards")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          New Councillor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Ward Councillor Account</DialogTitle>
          <DialogDescription>Provision a new Ward Councillor login.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Name *</Label>
              <Input {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Phone (Optional)</Label>
            <Input {...register("phone")} />
          </div>
          <div>
            <Label>Assign to Ward (Optional)</Label>
            <Select onValueChange={(v) => setValue("wardId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="n">None</SelectItem>
                {availableWards.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating}>{isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCouncillorDialog