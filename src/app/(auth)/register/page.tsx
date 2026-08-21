"use client";

import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ROLE_LABELS, type Role } from "@/lib/auth";
import { useAuth } from "@/hooks/queries/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Form schema with validation
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["citizen", "business_owner"] as const),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerAsync: registerUser } = useAuth();
  const navigate = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "citizen",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        // phone: data.phone || "",
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          toast.success("Account created. Redirecting...");
          navigate.push(
            "/login?registered=true",
          );
        },
      },
    );

    // if (error) {
    //   toast.error(error);
    //   return;
    // }
  };

  const onGoogle = async () => {
    // const { error } = await loginWithGoogle();
    // if (error) {
    //   toast.error(error);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-6">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-elegant">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold">LOGMAS</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Odeda LGA
            </div>
          </div>
        </Link>
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-elegant">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join LOGMAS in less than a minute.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">First name</Label>
              <Input
                id="name"
                {...register("firstName")}
                className="mt-1.5"
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="name">Last name</Label>
              <Input
                id="name"
                {...register("lastName")}
                className="mt-1.5"
                aria-invalid={errors.lastName ? "true" : "false"}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
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

            {/* <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" {...register("phone")} className="mt-1.5" />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div> */}

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1.5"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label>I am registering as</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) =>
                  setValue("role", v as RegisterFormData["role"])
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as Role[])
                    .filter(
                      (ele) => ele === "citizen" || ele === "business_owner",
                    )
                    .map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* <p className="text-xs text-muted-foreground mt-1.5">
                Prototype: choose any role to preview that dashboard.
              </p> */}
              {errors.role && (
                <p className="text-sm text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-hero shadow-elegant"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
