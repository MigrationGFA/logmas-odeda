"use client";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, TEST_CREDENTIALS } from "@/lib/auth";
import { useAuth } from "@/hooks/queries/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FullPageLoader } from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <Suspense fallback={<FullPageLoader title="login page" />}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  //   const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  // console.log(tokenManager.getAccessToken(),"lol")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    login({ email, password });
  };

  const fill = (c: (typeof TEST_CREDENTIALS)[number]) => {
    setEmail(c.email);
    setPassword(c.password);
    login({ email: c.email, password: c.password });
  };

  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (reason === 'suspended') {
      toast.error('Your account has been suspended. Please contact the LGA Secretariat.');
    }
  }, [reason]);

  useEffect(() => {
    if (loginError) {
      toast.error(loginError.message || "Invalid email or password");
    }
  }, [loginError]);
  // console.log(loginError,"loginError")

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">LOGMAS</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Odeda LGA
            </div>
          </div>
        </Link>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Building a Smarter Odeda Local Government
          </h1>
          <p className="opacity-90">
            Delivering transparent governance, digital public services, and
            sustainable development for every resident.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { k: "150K+", v: "Population" },
              { k: "1976", v: "Established" },
              { k: "10", v: "Wards" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl bg-white/10 backdrop-blur p-3 border border-white/15"
              >
                <div className="text-xl font-bold">{s.k}</div>
                <div className="text-xs opacity-80">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs opacity-70">
          © {new Date().getFullYear()} Odeda Local Government Area
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-hero flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">LOGMAS</span>
            </Link>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* <Button
            type="button"
            variant="outline"
            onClick={onGoogle}
            disabled={isLoggingIn}
            className="w-full"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            Continue with Google
          </Button> */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-hero shadow-elegant hover:shadow-glow transition-smooth"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

            <Card className="p-4 bg-secondary/40 border-border/40">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold uppercase tracking-wider">
                  Demo accounts
                </div>
                <Badge variant="outline" className="text-[10px]">
                  click to login
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {TEST_CREDENTIALS.map((c) => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => fill(c)}
                    className="text-left text-xs p-2 rounded-md bg-background hover:bg-primary hover:text-primary-foreground border border-border/60 transition-smooth"
                  >
                    {ROLE_LABELS[c.role]}
                  </button>
                ))}
              </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
