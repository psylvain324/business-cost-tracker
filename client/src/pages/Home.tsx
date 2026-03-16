/*
 * Home — Main Dashboard Page
 * Design: Command Deck — Dark Executive Dashboard
 * Layout: Full-width with hero header, summary strip, and content grid
 */

import SummaryCards from "@/components/SummaryCards";
import CostTable from "@/components/CostTable";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import ProjectionPanel from "@/components/ProjectionPanel";
import FilterBar from "@/components/FilterBar";
import { motion } from "framer-motion";
import {
  BarChart3,
  Shield,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCosts } from "@/contexts/CostContext";
import { formatCurrency, getTotalMonthlyAll, getTotalAnnualAll, getTotalStartupCost } from "@/lib/costData";
import { toast } from "sonner";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663397693691/2FEnuq8s4HzSDKy69vebiX/hero-abstract-dark-L4PDgFVhuMReh59i3JirKy.webp";

function exportToCSV(costs: Array<{
  name: string;
  category: string;
  status: string;
  priority: string;
  monthlyCost: number;
  annualCost: number;
  isOneTime: boolean;
  oneTimeCost: number;
  tag: string;
  notes: string;
}>) {
  const headers = ["Name", "Category", "Status", "Priority", "Monthly Cost", "Annual Cost", "One-Time Cost", "Tag", "Notes"];
  const rows = costs.map((c) => [
    c.name,
    c.category,
    c.status,
    c.priority,
    c.isOneTime ? "0" : c.monthlyCost.toFixed(2),
    c.isOneTime ? "0" : c.annualCost.toFixed(2),
    c.isOneTime ? c.oneTimeCost.toFixed(2) : "0",
    c.tag,
    `"${c.notes.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "business-costs.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported costs to CSV");
}

export default function Home() {
  const { costs, isLoading, error, refetch } = useCosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative container py-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-glow" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-glow font-medium">
                      Health Insurance Lead Management
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  Business Cost Tracker
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                  Track startup expenses, recurring subscriptions, and anticipated costs for your health insurance lead management business.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(costs)}
                  className="border-border text-foreground bg-transparent hover:bg-secondary gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Quick stats in header */}
            <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-border/30">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Startup Invested
                </span>
                <div className="stat-number text-lg font-bold text-emerald-glow">
                  {formatCurrency(getTotalStartupCost(costs))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Monthly Burn Rate
                </span>
                <div className="stat-number text-lg font-bold text-amber-glow">
                  {formatCurrency(getTotalMonthlyAll(costs))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Year 1 Projected
                </span>
                <div className="stat-number text-lg font-bold text-sky-glow">
                  {formatCurrency(getTotalAnnualAll(costs))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total Items
                </span>
                <div className="stat-number text-lg font-bold text-foreground">
                  {costs.length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="container py-2">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="shrink-0">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground text-sm">Loading costs…</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <SummaryCards />

        {/* Filter Bar */}
        <FilterBar />

        {/* Content Grid: Table + Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cost Table — takes 2 columns */}
          <div className="xl:col-span-2">
            <CostTable />
          </div>

          {/* Charts sidebar */}
          <div className="space-y-5">
            <CostBreakdownChart />
            <ProjectionPanel />
          </div>
        </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Business Cost Tracker — Health Insurance Lead Management
          </p>
          <p className="text-[10px] text-muted-foreground">
            Data stored locally in your browser. Export to CSV for backup.
          </p>
        </div>
      </footer>
    </div>
  );
}
