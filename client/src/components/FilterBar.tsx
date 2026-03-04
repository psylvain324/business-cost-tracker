/*
 * FilterBar — Search and category filter controls
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useCosts } from "@/contexts/CostContext";
import type { CostCategory } from "@/lib/costData";
import { Search, LayoutGrid, Rocket, RefreshCw, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddCostDialog from "./AddCostDialog";

const filters: Array<{ value: CostCategory | "all"; label: string; icon: typeof LayoutGrid }> = [
  { value: "all", label: "All Costs", icon: LayoutGrid },
  { value: "startup", label: "Startup", icon: Rocket },
  { value: "recurring", label: "Recurring", icon: RefreshCw },
  { value: "anticipated", label: "Anticipated", icon: Lightbulb },
];

export default function FilterBar() {
  const { activeFilter, setActiveFilter, searchQuery, setSearchQuery, filteredCosts } = useCosts();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-secondary/80 rounded-lg p-0.5">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search costs..."
          className="pl-8 h-8 text-xs bg-secondary border-border text-foreground"
        />
      </div>

      {/* Count + Add button */}
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-xs text-muted-foreground">
          {filteredCosts.length} items
        </span>
        <AddCostDialog />
      </div>
    </div>
  );
}
