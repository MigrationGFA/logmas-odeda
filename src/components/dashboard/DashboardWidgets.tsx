"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/shared";
import { ArrowRight } from "lucide-react";

interface MiniChartProps {
  revenueTrendChart?: { month: string; amount: number }[];
}

export function MiniChart({ revenueTrendChart = [] }: MiniChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const revenueData = revenueTrendChart;
  const max = Math.max(...revenueData.map((r) => r.amount), 1);

  const getPercentageChange = () => {
    if (revenueData.length < 2) return null;
    const lastTwo = revenueData.slice(-2);
    const prevAmount = lastTwo[0]?.amount || 0;
    const currentAmount = lastTwo[1]?.amount || 0;
    if (prevAmount === 0) return null;
    return ((currentAmount - prevAmount) / prevAmount) * 100;
  };

  const percentageChange = getPercentageChange();
  const isPositive = (percentageChange || 0) >= 0;

  const formatMonthLabel = (label: string) => {
    if (!label) return "N/A";
    if (isNaN(Date.parse(label))) {
      return label;
    }
    const date = new Date(label);
    return date.toLocaleDateString("default", { month: "short" });
  };

  if (revenueData.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border-border/40 lg:col-span-2 flex items-center justify-center h-56 text-sm text-muted-foreground">
        No trend data available
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/40 lg:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground">Last {revenueData.length} periods</p>
        </div>
        {percentageChange !== null && (
          <Badge
            className={`${isPositive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"} border-none`}
          >
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </Badge>
        )}
      </div>

      <div className="flex items-end gap-1.5 h-40">
        {revenueData.map((r, i) => {
          const columnHeight = max > 1 ? (r.amount / max) * 100 : 0;

          return (
            <div
              key={`${r.month}-${i}`}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
              title={`₦${r.amount.toLocaleString()}`}
            >
              <div
                className="w-full rounded-t-md bg-gradient-hero transition-all duration-700 min-h-[2px]"
                style={{
                  height: mounted ? `${columnHeight}%` : "0%",
                  transitionDelay: `${i * 20}ms`,
                }}
              />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatMonthLabel(r.month)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export interface RecentInvoiceItem {
  id: string;
  reference: string;
  customerName: string;
  amount: number;
  status: string;
}

interface RecentInvoicesProps {
  limit?: number;
  invoices?: RecentInvoiceItem[];
}

export function RecentInvoices({ limit = 5, invoices }: RecentInvoicesProps) {
  return (
    <Card className="p-0 bg-gradient-card border-border/40 overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="font-semibold">Recent Invoices</h3>
          <p className="text-xs text-muted-foreground">Latest billing activity</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/invoices">
            View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.slice(0, limit).map((i) => (
            <TableRow key={i.id}>
              <TableCell className="font-mono text-xs">
                <div className="truncate max-w-20 md:max-w-35">{i.reference}</div>
              </TableCell>
              <TableCell>{i.customerName}</TableCell>
              <TableCell>₦{i.amount.toLocaleString()}</TableCell>
              <TableCell>
                <StatusBadge status={i.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/invoices/${i.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export function QuickActions({
  items,
}: {
  items: { icon: React.ComponentType<{ className?: string }>; label: string; to: string }[];
}) {
  return (
    <Card className="p-5 bg-gradient-card border-border/40">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((q) => {
          const Icon = q.icon;
          return (
            <Button
              key={q.label}
              asChild
              variant="outline"
              className="h-auto py-3 px-3 flex-col gap-1.5 hover:border-primary hover:bg-primary/5"
            >
              <Link href={q.to}>
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{q.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
