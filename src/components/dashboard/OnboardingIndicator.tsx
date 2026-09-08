"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/queries/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, UserCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export function OnboardingIndicator() {
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only citizens and business owners need onboarding
  const isCitizenOrBusiness =
    user?.role === "citizen" || user?.role === "business_owner";
  const needsOnboarding = isCitizenOrBusiness && !user?.onboardingCompleted;

  useEffect(() => {
    if (user && needsOnboarding) {
      const storageKey = `onboarding_indicator_dismissed_${user.id}`;
      const dismissed = sessionStorage.getItem(storageKey);
      if (!dismissed) {
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(true);
    }
  }, [user, needsOnboarding]);

  const handleDismiss = () => {
    if (user?.id) {
      sessionStorage.setItem(`onboarding_indicator_dismissed_${user.id}`, "true");
    }
    setIsDismissed(true);
  };

  if (!needsOnboarding || isDismissed) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent border-b border-amber-500/20 px-4 py-2.5 transition-all">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Complete Your Citizen Profile
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400">
                  Recommended
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                Set your ward, emergency contact and passport photo to facilitate quick certificate issuance and tax clearance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsModalOpen(true)}
              className="h-8 text-xs font-medium bg-primary text-primary-foreground shadow-xs gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Complete Profile
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDismiss}
              title="Dismiss notification"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </div>

      <OnboardingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCompleted={() => {
          setIsDismissed(true);
        }}
      />
    </>
  );
}
