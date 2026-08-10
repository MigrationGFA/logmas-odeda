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

import { MoreHorizontal, Plus, Power, Search, SlidersHorizontal } from "lucide-react";
import {
  useTogglePermitConfig,
} from "@/hooks/queries/usePermitConfigs";
import { useRevenueCategories } from "@/hooks/queries/useRevenueCategories";
import { usePermitConfigs } from "@/hooks/queries/useTreasurer";
import PermitConfigDialog from "./PermitCOnfigDialog";
import { FilterBar, formatNgn, SkeletonRows } from "@/app/(dashboard)/dashboard/levies/page";

function PermitConfigTab() {
  const { useGetPermitConfigs } = usePermitConfigs();

  const { data: permitConfigs, isLoading } = useGetPermitConfigs();
  const toggle = useTogglePermitConfig();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { categories, isLoading: isGettingCat } = useRevenueCategories("PERMIT");
  const allCat = categories.map((c) => ({ value: c.slug, label: c.name }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return permitConfigs?.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q);
      const matchCat = filterCategory === "all" || p.category.slug === filterCategory;
      return matchQ && matchCat;
    });
  }, [permitConfigs, search, filterCategory]);

//   console.log(filtered, "filtered");
  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={filterCategory}
        onCategory={setFilterCategory}
        categories={allCat}
        action={<PermitConfigDialog />}
      />

      <Card className="p-0 bg-gradient-card border-border/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / Tier</TableHead>
              {/* <TableHead>System Code</TableHead> */}
              <TableHead>Revenue Category</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows cols={6} />
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No permit framework configurations yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((p) => {
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    {/* <TableCell className="font-mono text-xs uppercase">{p.code}</TableCell> */}
                    <TableCell>{p.category.name}</TableCell>
                    <TableCell className="font-semibold">{formatNgn(p.baseAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.isActive
                            ? "bg-success/15 text-success border-success/30"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <PermitConfigDialog
                            existing={p}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Modify Price / Edit Properties
                              </DropdownMenuItem>
                            }
                          />
                          <DropdownMenuItem onSelect={() => toggle.mutate(p.id)}>
                            <Power className="h-4 w-4 mr-2" />
                            {p.isActive ? "Deactivate Rule" : "Re-activate Rule"}
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            className="text-destructive"
                            onSelect={() => remove.mutate(p.id)}
                          >
                            Delete
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default PermitConfigTab;
