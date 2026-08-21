"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  MailCheck,
  ArrowLeft,
  Send,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FullPageLoader } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/queries/useAuth";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<FullPageLoader title="verify token page" />}>
      <Page />
    </Suspense>
  );
}

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    verifyEmail, 
    isVerifying, 
    verifyError,
    resendVerification, 
    isResending, 
    resendError, 
    resendSuccess 
  } = useAuth();

  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "resend"
  >("verifying");

  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      setErrorDetails("The verification link you used appears to be incomplete or malformed.");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail({ token });
        
        setStatus("success");
        setMessage(result.message || "Your email has been verified successfully!");

        setTimeout(() => {
          router.push(`/login?verified=true?email=${emailParam}`);
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage("Verification failed.");
        setErrorDetails(
          error.message || "Unable to verify your email. Please try again or contact support.",
        );
      }
    };

    verify();
  }, [searchParams, router, verifyEmail]);

  // Handle resend verification
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    // Check cooldown
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before resending.`);
      return;
    }

    try {
      await resendVerification({ email });
      
      // Start cooldown timer (60 seconds)
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setStatus("resend");
      setMessage(`Verification email resent to ${email}`);
      
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email.");
    }
  };

  // Handle manual email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle error from verify mutation
  useEffect(() => {
    if (verifyError) {
      setStatus("error");
      setMessage("Verification failed.");
      setErrorDetails(verifyError.message || "Unable to verify your email.");
    }
  }, [verifyError]);

  // Handle error from resend mutation
  useEffect(() => {
    if (resendError) {
      toast.error(resendError.message || "Failed to resend verification email.");
    }
  }, [resendError]);

  // Loading State
  if (status === "verifying" || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6 bg-gradient-card border-border/40">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Verifying your email
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
          <div className="flex justify-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
            <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-100" />
            <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-200" />
          </div>
        </Card>
      </div>
    );
  }

  // Error State with Resend Option
  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 space-y-6 bg-gradient-card border-border/40">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
              Verification Failed
            </h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            {errorDetails && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <p className="text-xs text-muted-foreground">{errorDetails}</p>
              </div>
            )}
          </div>

          {/* Resend Verification Section */}
          <div className="border-t border-border/40 pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-semibold">Need a new verification link?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your email address and we'll send you a new verification link.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="resend-email">Email Address</Label>
                  <Input
                    id="resend-email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className="mt-1.5"
                    disabled={isResending}
                  />
                </div>

                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || resendCooldown > 0 || !email}
                  className="w-full gap-2"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Wait {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
                    <MailCheck className="h-4 w-4" />
                    {resendSuccess}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push("/register")}
              className="w-full text-xs"
            >
              Create a new account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Resend Success State
  if (status === "resend") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6 bg-gradient-card border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <MailCheck className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
              Verification Email Sent!
            </h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-muted-foreground">
                Please check your inbox and spam folder. The link will expire in 24 hours.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full gap-2"
            >
              Go to Login
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="w-full"
            >
              {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Resend Again"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-gradient-card border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
            Email Verified! 🎉
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <MailCheck className="h-4 w-4 text-emerald-500" />
              You can now sign in to your account
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/login?verified=true")}
            className="w-full bg-gradient-hero shadow-elegant hover:shadow-glow transition-smooth"
          >
            Continue to Login
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Redirecting automatically in a few seconds...
          </div>
        </div>
      </Card>
    </div>
  );
}