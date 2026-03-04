/*
 * CostTable — Interactive cost listing with category sections
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useCosts } from "@/contexts/CostContext";
import { formatCurrency, type CostItem, type CostCategory } from "@/lib/costData";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  Clock,
  Lightbulb,
  Zap,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const statusConfig = {
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    className: "bg-emerald-glow/15 text-emerald-glow border-emerald-glow/30",
  },
  active: {
    icon: Zap,
    label: "Active",
    className: "bg-amber-glow/15 text-amber-glow border-amber-glow/30",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-sky-glow/15 text-sky-glow border-sky-glow/30",
  },
  recommended: {
    icon: Lightbulb,
    label: "Recommended",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const categoryConfig: Record<CostCategory, { title: string; description: string; accent: string }> = {
  startup: {
    title: "Startup Costs",
    description: "One-time expenses to get your business off the ground",
    accent: "border-l-emerald-glow",
  },
  recurring: {
    title: "Recurring Costs",
    description: "Monthly expenses for active services and subscriptions",
    accent: "border-l-amber-glow",
  },
  anticipated: {
    title: "Anticipated & Recommended",
    description: "Recommended tools and services for your health insurance lead management business",
    accent: "border-l-sky-glow",
  },
};

function CostRow({ item, index }: { item: CostItem; index: number }) {
  const { toggleStatus, removeCost } = useCosts();
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group"
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStatus(item.id);
              }}
              className="shrink-0"
            >
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 ${status.className} transition-all hover:scale-105`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-popover text-popover-foreground">
            Click to change status
          </TooltipContent>
        </Tooltip>

        {/* Name and tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {item.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
              {item.tag}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {item.description}
          </p>
        </div>

        {/* Cost */}
        <div className="text-right shrink-0">
          {item.isOneTime ? (
            <div className="stat-number text-sm font-semibold text-foreground">
              {formatCurrency(item.oneTimeCost)}
              <span className="text-[10px] text-muted-foreground ml-1">one-time</span>
            </div>
          ) : (
            <div>
              <div className="stat-number text-sm font-semibold text-foreground">
                {formatCurrency(item.monthlyCost)}
                <span className="text-[10px] text-muted-foreground ml-1">/mo</span>
              </div>
              {item.monthlyLow !== undefined && item.monthlyHigh !== undefined && (
                <div className="text-[10px] text-muted-foreground stat-number">
                  {formatCurrency(item.monthlyLow)}–{formatCurrency(item.monthlyHigh)} range
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 ml-4 border-l-2 border-border space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.notes}
                </p>
              </div>
              {!item.isOneTime && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>
                    Annual: <span className="stat-number text-foreground">{formatCurrency(item.annualCost)}</span>
                  </span>
                  <span>
                    Priority:{" "}
                    <span className={`capitalize ${
                      item.priority === "essential"
                        ? "text-emerald-glow"
                        : item.priority === "important"
                        ? "text-amber-glow"
                        : "text-muted-foreground"
                    }`}>
                      {item.priority}
                    </span>
                  </span>
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCost(item.id);
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategorySection({ category }: { category: CostCategory }) {
  const { filteredCosts } = useCosts();
  const config = categoryConfig[category];
  const items = filteredCosts.filter((c) => c.category === category);

  if (items.length === 0) return null;

  const totalMonthly = items.reduce(
    (sum, c) => sum + (c.isOneTime ? 0 : c.monthlyCost),
    0
  );
  const totalOneTime = items.reduce(
    (sum, c) => sum + (c.isOneTime ? c.oneTimeCost : 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card rounded-xl overflow-hidden border-l-4 ${config.accent}`}
    >
      <div className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">{config.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
          </div>
          <div className="text-right">
            {totalOneTime > 0 && (
              <div className="stat-number text-sm font-semibold text-emerald-glow">
                {formatCurrency(totalOneTime)} <span className="text-[10px] text-muted-foreground">total</span>
              </div>
            )}
            {totalMonthly > 0 && (
              <div className="stat-number text-sm font-semibold text-foreground">
                {formatCurrency(totalMonthly)} <span className="text-[10px] text-muted-foreground">/mo</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <AnimatePresence>
          {items.map((item, i) => (
            <CostRow key={item.id} item={item} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CostTable() {
  return (
    <div className="space-y-5">
      <CategorySection category="startup" />
      <CategorySection category="recurring" />
      <CategorySection category="anticipated" />
    </div>
  );
}
