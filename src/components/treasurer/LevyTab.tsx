/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal,  Power, SlidersHorizontal } from "lucide-react";

import LevyDialog from "@/components/treasurer/LevyDialog";

import { useLevyConfigs } from "@/hooks/queries/useTreasurer";
import { useRevenueCategories } from "@/hooks/queries/useRevenueCategories";
import { FilterBar, formatNgn, SkeletonRows } from "@/app/(dashboard)/dashboard/levies/page";
import { LevyConfig } from "@/services/apiTreasurer";

function LevyTab() {
  const { useGetLevyConfigs, toggleLevyConfig, isToggling } = useLevyConfigs();

  const { categories, isLoading: isGettingCat } = useRevenueCategories("LEVY");
  const { data, isLoading, refetch } = useGetLevyConfigs({
    page: 1,
    limit: 100,
    isActive: undefined, // Get both active and inactive
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const configs = useMemo(() => data ?? [], [data]);

  const items = useMemo(() => {
    if (!configs) return [];
    return configs.map((config:LevyConfig) => ({
      id: config.id,
      category: config.category,
      description: config.description,
      name: config.name,
      mode: config.mode,
      unitPrice: config.amount,
      active: config.isActive,
      billingCycle: config.billingCycle,
      penaltyRate: config.penaltyRate,
      effectiveFrom: config.effectiveFrom,
      effectiveTo: config.effectiveTo,
    }));
  }, [configs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items?.filter((l:any) => {
      const matchQ =
        !q || l?.description.toLowerCase().includes(q) || l.name.toLowerCase().includes(q);
      const matchCat = filterCategory === "all" || l.category.slug === filterCategory;
      //   console.log(l.category.name,filterCategory,"fnekfnekfne")
      return matchQ && matchCat;
    });
  }, [items, search, filterCategory]);

  console.log(categories, "categories");

  const allCat = categories.filter(ele=>(ele.type === "LEVY")).map((c) => ({ value: c.slug, label: c.name }));
  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={filterCategory}
        onCategory={setFilterCategory}
        categories={allCat}
        action={<LevyDialog />}
      />

      <Card className="p-0 bg-gradient-card border-border/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / Tier</TableHead>
              <TableHead>Revenue Category</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Base Price (₦)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows cols={6} />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No levy configurations found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((l:any) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`relative h-2 w-2`}>
                        <div
                          className={`absolute h-2 w-2 rounded-full ${l.active ? "bg-green-500" : "bg-red-500"}`}
                        />
                        {l.active && (
                          <div className="absolute h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
                        )}
                      </div>
                      {l.name}
                    </div>
                  </TableCell>
                  <TableCell>{l.category.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={"bg-muted text-muted-foreground capitalize"}
                    >
                      {l.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs capitalize">{l.billingCycle}</TableCell>
                  <TableCell className="font-semibold">{formatNgn(l.unitPrice)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <LevyDialog
                          existing={l}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <SlidersHorizontal className="h-4 w-4 mr-2" />
                              Modify Price / Edit Properties
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuItem onSelect={() => toggleLevyConfig(l.id)}>
                          <Power className="h-4 w-4 mr-2" />
                          {l.active ? "Deactivate Rule" : "Re-activate Rule"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default LevyTab;
