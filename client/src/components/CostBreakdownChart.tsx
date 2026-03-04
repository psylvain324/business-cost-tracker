/*
 * CostBreakdownChart — Visual breakdown of costs by category and tag
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useCosts } from "@/contexts/CostContext";
import { getUniqueTags, formatCurrency } from "@/lib/costData";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

const COLORS = [
  "#34d399", // emerald
  "#fbbf24", // amber
  "#38bdf8", // sky
  "#f87171", // rose
  "#a78bfa", // violet
  "#2dd4bf", // teal
  "#fb923c", // orange
  "#818cf8", // indigo
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-foreground font-medium">{payload[0].name}</p>
      <p className="stat-number text-foreground mt-0.5">
        {formatCurrency(payload[0].value)}<span className="text-muted-foreground">/mo</span>
      </p>
    </div>
  );
}

export default function CostBreakdownChart() {
  const { costs } = useCosts();
  const [view, setView] = useState<"pie" | "bar">("pie");

  const tags = getUniqueTags(costs);
  const tagData = tags
    .map((tag) => {
      const tagCosts = costs.filter((c) => c.tag === tag);
      const monthly = tagCosts.reduce(
        (sum, c) => sum + (c.isOneTime ? 0 : c.monthlyCost),
        0
      );
      return { name: tag, value: monthly };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const categoryData = [
    {
      name: "Recurring",
      value: costs
        .filter((c) => c.category === "recurring")
        .reduce((sum, c) => sum + c.monthlyCost, 0),
    },
    {
      name: "Anticipated",
      value: costs
        .filter((c) => c.category === "anticipated")
        .reduce((sum, c) => sum + c.monthlyCost, 0),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Cost Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly spend by category</p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setView("pie")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === "pie"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pie
          </button>
          <button
            onClick={() => setView("bar")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === "bar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {view === "pie" ? (
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="w-full lg:w-1/2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tagData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {tagData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={0.85}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 space-y-2">
            {tagData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground flex-1 truncate">
                  {item.name}
                </span>
                <span className="stat-number text-xs text-foreground">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tagData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.015 260)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "oklch(0.6 0.02 260)" }}
                tickFormatter={(v) => `$${v}`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "oklch(0.6 0.02 260)" }}
                width={120}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                {tagData.map((_entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category summary */}
      <div className="mt-4 pt-4 border-t border-border/50 flex gap-6">
        {categoryData.map((cat) => (
          <div key={cat.name}>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {cat.name}
            </span>
            <div className="stat-number text-lg font-bold text-foreground">
              {formatCurrency(cat.value)}
              <span className="text-xs text-muted-foreground font-normal">/mo</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
