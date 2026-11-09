import type { Metadata } from "next";
import { LGA_CONFIG } from "@/config/lga.config";

export const metadata: Metadata = {
  title: `Coming Soon | ${LGA_CONFIG.identity.formalTitle}`,
  description: `The official website of ${LGA_CONFIG.identity.formalTitle}, ${LGA_CONFIG.identity.state} is coming soon.`,
};

// Public holding page shown on the council's domain until the official
// launch. The host gate in src/proxy.ts rewrites public-domain traffic
// here; the full site stays reachable on the project's other hosts.
export default function ComingSoonPage() {
  const { identity } = LGA_CONFIG;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold tracking-wide text-primary-foreground"
      >
        {identity.acronym}
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        {identity.state}
      </p>
      <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {identity.formalTitle}
      </h1>
      <p className="mt-3 text-base italic text-muted-foreground">
        &ldquo;{identity.motto}&rdquo;
      </p>

      <div className="mt-10 w-full max-w-xl rounded-2xl border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-card-foreground">
          Our website is coming soon
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The official online home of {identity.councilName} is being prepared.
          Soon you will be able to apply for council services, make payments and
          track your applications here. Please check back shortly.
        </p>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {identity.councilName}. All rights
        reserved.
      </p>
    </main>
  );
}
