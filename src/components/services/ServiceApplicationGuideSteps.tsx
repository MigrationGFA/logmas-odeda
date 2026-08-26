"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  UserCheck,
  CreditCard,
  MailCheck,
  FileCheck2,
  LogIn,
  UploadCloud,
  ArrowRight,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const SERVICE_APPLICATION_STEPS = [
  {
    step: 1,
    title: "Fill Applicant Payment Details",
    description: "Fill applicant payment details with valid and correct Email Address and phone number.",
    highlight: "Valid & correct Email and Phone",
    icon: UserCheck,
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    step: 2,
    title: "Make Payment Online",
    description: "Make payment online as directed after completion of Step 1.",
    highlight: "Secure instant statutory fee payment",
    icon: CreditCard,
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    step: 3,
    title: "Check Email for Login Details",
    description: "Check your email address for login details and continue to login with those login credentials or click on the Login button on the website.",
    highlight: "Auto-generated login details sent to email",
    icon: MailCheck,
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    step: 4,
    title: "Get Documents Ready",
    description: "Before you log in, ensure you get your required statutory documents ready for upload.",
    highlight: "Prepare digital copies of documents",
    icon: FileCheck2,
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    step: 5,
    title: "Enter Account Credentials at Login",
    description: "At the Login Page, enter the credentials/account details sent to your email address.",
    highlight: "Sign in with received credentials",
    icon: LogIn,
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    step: 6,
    title: "Fill Application Form & Upload Documents",
    description: "Fill in the application form with your details and upload your necessary documents step by step.",
    highlight: "Step-by-step form & document submission",
    icon: UploadCloud,
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
];

interface ServiceApplicationGuideStepsProps {
  compact?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ServiceApplicationGuideSteps({
  compact = false,
  className = "",
  title = "Official 6-Step Application & Payment Process",
  subtitle = "Please review these official guidelines before making payment for any statutory service.",
}: ServiceApplicationGuideStepsProps) {
  if (compact) {
    return (
      <Card id="service-steps-compact" className={`p-4 bg-muted/30 border-border/60 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <h4 className="font-semibold text-xs text-foreground uppercase tracking-wide">
            Important Steps Before Payment
          </h4>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_APPLICATION_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background border border-border/40 text-xs shadow-2xs"
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-[11px] leading-tight">
                    {s.title}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div id="service-steps-full" className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
              <ShieldCheck className="h-3 w-3 mr-1" /> Statutory Application Guide
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              Mandatory Steps
            </Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Auto Account Creation on Payment
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_APPLICATION_STEPS.map((s, index) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.step}
              id={`application-step-${s.step}`}
              className="p-4 bg-gradient-card border-border/60 hover:shadow-elegant transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                      {s.step}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Step 0{s.step}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${s.badgeColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                  {s.title}
                </h4>

                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                  {s.highlight}
                </span>
                {index < SERVICE_APPLICATION_STEPS.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
