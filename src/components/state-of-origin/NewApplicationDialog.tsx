import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileBadge, Loader2 } from "lucide-react";
import { useCitizenStateOfOrigin } from "@/hooks/queries/useStateOfOrigin";
import { useWards } from "@/hooks/queries/useWards";

import { getTestData } from "@/services/_mock";
import { useRouter } from "next/navigation";
import { FileUpload } from "../FileUpload";

// Schema definition
const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  // wardId: z.string().min(1, "Ward is required"),
  purpose: z.string().optional(),
  nin: z.string().optional(),
  passportUrl: z
    .string()
    .optional()
    .refine((url) => url !== "", {
      message: "Passport photograph is required",
    }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

function NewApplicationDialog({ isCitizen }: { isCitizen: boolean }) {
  const [open, setOpen] = useState(isCitizen);

  const { submitApplicationAsync, isSubmitting } =
    useCitizenStateOfOrigin(true);
  const navigate = useRouter();
  const [testData] = useState(getTestData());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      gender: "male",
      // fullName: testData.fullName,
      // dateOfBirth: testData.dateOfBirth,
      // address: testData.address,
      // phone: testData.phone,
      // email: testData.email,
      // // wardId: testData.wardId,
      // purpose: testData.purpose,
      // nin: testData.nin,
      // passportUrl: "",
    },
  });
  // console.log(testData,"testData")
  // Fetch real wards from backend

  // const { wards, isLoading: wardsLoading, wardOptions } = useWards();

  const onSubmit = async (data: ApplicationFormData) => {
    console.log(data, "form data before submission");

    if (!data.passportUrl) {
      toast.error("Please upload a passport photograph before submitting.");
      return;
    }
    // // console.log(data,"djbjefbjef")
    const res = await submitApplicationAsync({
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      email: data.email,
      // wardId: data.wardId,
      purpose: data.purpose || "",
      nin: data.nin || "",
      passportUrl: data.passportUrl || "",
    });

    if (res) {
      console.log(res, "response from submission");
      setOpen(false);
      navigate.push(`/dashboard/invoices/${res?.invoice.invoiceNumber}`);
      reset();
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-hero shadow-elegant">
          <Plus className="h-4 w-4 mr-1.5" /> New Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-primary" /> State of Origin
            Application
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className="mt-1.5"
                aria-invalid={errors.fullName ? "true" : "false"}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="mt-1.5"
                aria-invalid={errors.dateOfBirth ? "true" : "false"}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other")
                }
                defaultValue="male"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* <div>
              <Label htmlFor="wardId">Ward</Label>
              <Select onValueChange={(value) => setValue("wardId", value)} required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={wardsLoading ? "Loading..." : "Select ward"} />
                </SelectTrigger>
                <SelectContent>
                  {wardsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading wards...
                    </SelectItem>
                  ) : (
                    wards.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.wardId && (
                <p className="text-sm text-destructive mt-1">{errors.wardId.message}</p>
              )}
            </div> */}

            <div className="sm:col-span-2">
              <Label htmlFor="address">Residential Address</Label>
              <Input
                id="address"
                {...register("address")}
                className="mt-1.5"
                aria-invalid={errors.address ? "true" : "false"}
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                className="mt-1.5"
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1.5"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="nin">NIN (Optional)</Label>
              <Input id="nin" {...register("nin")} className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                {...register("purpose")}
                placeholder="e.g. Employment, Admission"
                className="mt-1.5"
              />
            </div>

            {/* <div className="sm:col-span-2">
              <Label>Passport Photograph</Label>
              <Input type="file" accept="image/*" className="mt-1.5" disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Photo upload coming soon. You can attach later.
              </p>
            </div> */}
            <div className="sm:col-span-2">
              <Label>Passport Photograph</Label>
              <FileUpload
                type="passports"
                label="Upload Passport Photograph"
                accept="image/jpeg,image/png"
                value={watch("passportUrl")} // Watch the URL state in react-hook-form
                onChange={(url) =>
                  setValue("passportUrl", url, { shouldValidate: true })
                } // Update form state on success
                preview={true}
                className="mt-1.5"
              />
              {errors.passportUrl && (
                <p className="text-xs text-destructive mt-1">
                  {errors.passportUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/60">
            <div className="text-sm">
              <span className="text-muted-foreground">Application Fee</span>{" "}
              <span className="font-semibold ml-2 text-primary">
                Calculated at payment step
              </span>
            </div>
            <Button
              type="submit"
              className="bg-gradient-hero"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewApplicationDialog;
