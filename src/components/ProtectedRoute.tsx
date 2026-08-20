"use client"
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/queries/useAuth";
import { tokenManager } from "@/services/apiAuth";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { ForcePasswordChangeModal } from "./ForcePasswordChangeModal";
import { toast } from "sonner";

export function FullPageLoader({title="Page"}:{title?:string}) {
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
        <div className="h-20 w-20 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elegant animate-pulse">
          <ShieldCheck className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Loading your {title ?? "dashboard"}</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait...</p>
        </div>
        
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
  const [open, setOpen] = useState(user?.passwordResetRequired ?? false);

  useEffect(() => {
    if (!isLoadingUser && user) {
      setOpen(user.passwordResetRequired ?? false);
    }
  }, [isLoadingUser, user]);

  return (
    <>
      {children}
      <ForcePasswordChangeModal
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

interface ProtectedRouteProps {
  children: ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

// Routes that citizens/business owners should be redirected to onboarding
const ONBOARDING_REQUIRED_ROUTES = ['/dashboard', '/dashboard/services', '/dashboard/applications'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useRouter();
  const pathname = usePathname();
  const { isLoadingUser, user } = useAuth();
  const token = tokenManager.getAccessToken();

  useEffect(() => {
    // If not loading and no token, redirect to login
    if (!isLoadingUser && !token) {
      navigate.push("/login");
      return;
    }

    // If user is authenticated
    if (!isLoadingUser && token && user) {
      const isCitizenOrBusiness = user.role === 'citizen' || user.role === 'business_owner';
      const isOnboardingRoute = pathname === '/onboarding';
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      
      // Check if user needs onboarding
      const needsOnboarding = isCitizenOrBusiness && !user.onboardingCompleted;
      
      // Redirect to onboarding if needed and not already on onboarding
      if (needsOnboarding && !isOnboardingRoute && !isPublicRoute) {
        navigate.push("/onboarding");
        toast.info("Please complete your profile to continue.");
        return;
      }

      // If on onboarding but onboarding is completed, redirect to dashboard
      if (isOnboardingRoute && !needsOnboarding) {
        navigate.push("/dashboard");
        return;
      }

      // If on login/register but already authenticated, redirect to dashboard
      if (isPublicRoute) {
        navigate.push("/dashboard");
        return;
      }
    }
  }, [isLoadingUser, token, user, navigate, pathname]);

  // Show loading state
  if (isLoadingUser) {
    return <FullPageLoader />;
  }

  // If no token, don't render children (will redirect)
  if (!token) {
    return <FullPageLoader />;
  }

  // Render children if authenticated
  return <>{children}</>;
}