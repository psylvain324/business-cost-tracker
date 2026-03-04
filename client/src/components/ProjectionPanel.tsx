/*
 * ProjectionPanel — Financial projections and runway analysis
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useCosts } from "@/contexts/CostContext";
import {
  getTotalMonthlyRecurring,
  getTotalMonthlyAnticipated,
  getTotalStartupCost,
  formatCurrency,
} from "@/lib/costData";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="stat-number text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectionPanel() {
  const { costs } = useCosts();

  const monthlyRecurring = getTotalMonthlyRecurring(costs);
  const monthlyAnticipated = getTotalMonthlyAnticipated(costs);
  const startupTotal = getTotalStartupCost(costs);

  // Generate 12-month projection data
  const months = [
    "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6",
    "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12",
  ];

  const projectionData = months.map((month, i) => {
    const cumulativeRecurring = startupTotal + monthlyRecurring * (i + 1);
    const cumulativeAll = startupTotal + (monthlyRecurring + monthlyAnticipated) * (i + 1);
    return {
      month,
      "Current Costs": cumulativeRecurring,
      "With Anticipated": cumulativeAll,
    };
  });

  const yearEndRecurring = startupTotal + monthlyRecurring * 12;
  const yearEndAll = startupTotal + (monthlyRecurring + monthlyAnticipated) * 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">12-Month Projection</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Cumulative cost projection over the first year
        </p>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradientRecurring" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.015 260)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "oklch(0.5 0.02 260)" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "oklch(0.5 0.02 260)" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "10px", color: "oklch(0.6 0.02 260)" }}
              iconType="circle"
              iconSize={6}
            />
            <Area
              type="monotone"
              dataKey="With Anticipated"
              stroke="#38bdf8"
              fill="url(#gradientAll)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Current Costs"
              stroke="#fbbf24"
              fill="url(#gradientRecurring)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Year-end summary */}
      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Year 1 (Current Only)
          </span>
          <span className="stat-number text-lg font-bold text-amber-glow">
            {formatCurrency(yearEndRecurring)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Year 1 (With Anticipated)
          </span>
          <span className="stat-number text-lg font-bold text-sky-glow">
            {formatCurrency(yearEndAll)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
