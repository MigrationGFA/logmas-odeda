"use client";
import { useAuth } from "@/hooks/queries/useAuth";

import FieldOfficerView from "./FieldOfficerView";
import BusinessOwnerView from "./BusinessOwnerView";
import SuperAdminView from "./SuperAdminView";

export const NGN = (n: number) => `₦${n.toLocaleString()}`;

export function statusClass(s: string) {
  switch (s) {
    case "issued":
      return "bg-success/15 text-success border-success/30";
    case "paid":
      return "bg-info/15 text-info border-info/30";
    case "pending_payment":
      return "bg-warning/15 text-warning-foreground border-warning/30";
    case "expired":
      return "bg-destructive/15 text-destructive border-destructive/30";
    default:
      return "";
  }
}

export default function PermitsPage() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "field_officer") return <FieldOfficerView />;
  if (role === "business_owner" || role === "citizen")
    return <BusinessOwnerView />;
  return <SuperAdminView />;
}
