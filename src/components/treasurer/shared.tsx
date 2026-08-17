import React from "react";
import { type LevyCategory, type LevyPrice } from "@/lib/store";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const LEVY_CATEGORIES: LevyCategory[] = [
  "Certificate Fees",
  "Tenement Rate",
  "Haulage Fees",
  "Liquor Licence Fees",
  "Viewing Centre Licence",
  "Quarry Fees & Permits",
  "Street Naming & Property Numbering",
  "Kiosk Licence",
  "Environmental Sanitation",
  "Trade Permit Fees",
  "Market Levy",
  "Other",
];

export const formatNgn = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export const levyCode = (l: LevyPrice) =>
  l.code ??
  l.category
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 4)
    .toUpperCase() +
    "_" +
    l.id.slice(-4).toUpperCase();

export function FilterBar({
  search,
  onSearch,
  category,
  onCategory,
  categories,
  action,
}: {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  categories: { value: string; label: string }[];
  action: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="relative md:col-span-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name"
          className="pl-9"
        />
      </div>
      <div className="md:col-span-4">
        <Select value={category} onValueChange={onCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 flex md:justify-end">{action}</div>
    </div>
  );
}

export function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
