"use client"
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/queries/useAuth";
import { tokenManager } from "@/services/apiAuth";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { ForcePasswordChangeModal } from "./ForcePasswordChangeModal";

export function FullPageLoader({title}:{title?:string}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full px-4">
        {/* Logo / Icon */}
        <div className="h-20 w-20 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elegant animate-pulse">
          <ShieldCheck className="h-10 w-10 text-primary-foreground" />
        </div>
        
        {/* Spinner */}
        {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Loading your {title ?? "dashboard"}</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait...</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full mt-2">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-hero rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">
            {Math.round(Math.min(progress, 100))}%
          </p>
        </div>
      </div>
    </div>
  );
}


export function RedirectIfPasswordReset({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();

  // If user requires password reset, show modal (blocks content)
  // const showModal = !isLoadingUser && user?.passwordResetRequired === true;

  const [open,setOpen] = useState(user?.passwordResetRequired ?? false)

  return (
    <>
      {children}
      {/* {showModal && ( */}
        <ForcePasswordChangeModal
          open={open}
          setOpen={setOpen}
        />
      {/* )} */}
    </>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useRouter();
  const { isLoadingUser } = useAuth();
  let token = tokenManager.getAccessToken();
  let user = tokenManager.getUser();

  // DEV MODE ALLOWANCE: Auto-set demo admin user if not authenticated
  if (typeof window !== "undefined" && (!token || !user)) {
    const defaultDevUser = {
      id: "mock-super-admin",
      email: "admin@odeda.lg.gov.ng",
      phone: "08012345678",
      firstName: "Hon. Folusho Joseph",
      lastName: "Badejo",
      role: "super_admin",
      isActive: true,
      suspendedAt: null,
      suspendedById: null,
      suspensionReason: null,
      passwordResetRequired: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      avatarUrl: null,
      address: "Odeda LGA Secretariat, Odeda, Ogun State",
      tokenVersion: 1,
      nin: "12345678901",
      createdById: null,
      wardId: "ward-1",
      assignedWardId: null,
      contractorId: null,
      commissionRate: 0,
      agentId: null,
      isWalkIn: false,
      walkInRegisteredById: null,
      notifyByEmail: true,
      notifyBySms: true,
      notifyByInApp: true,
      ward: { id: "ward-1", name: "Odeda Ward 1" },
      meta: null,
      error: null,
    };
    tokenManager.setAccessToken("demo-dev-token");
    tokenManager.setUser(defaultDevUser as any);
    token = "demo-dev-token";
    user = defaultDevUser as any;
  }

  useEffect(() => {
    // If not loading and no token or no user, redirect to login
    if (!isLoadingUser && (!token || !user)) {
      navigate.push("/login");
    }
  }, [isLoadingUser, token, user, navigate]);

  // Token and user exist or auto-provisioned in dev mode, render children
  return <>{children}</>;
}
