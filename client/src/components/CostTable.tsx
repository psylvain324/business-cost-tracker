/*
 * CostTable — Interactive cost listing with category sections
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useCosts } from "@/contexts/CostContext";
import {
  formatCurrency,
  getRecurringTotalPaid,
  getRecurringPaidSummary,
  getPaidMonthsGrouped,
  getRecurringPaymentEvents,
  getRecurringPaymentAmount,
  getRecurringActivityPeriods,
  getPaidItems,
  getPaidTotalForItem,
  getAvailableTaxYears,
  getPaidTotalForTaxYear,
  getPaidTotal,
  type CostItem,
  type CostCategory,
  type RecurringActivityPeriod,
} from "@/lib/costData";
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
  Pencil,
  Info,
  ChevronDown,
  ChevronUp,
  CalendarX,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditCostDialog from "./EditCostDialog";

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
  inactive: {
    icon: CalendarX,
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
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

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeActivityPeriods(item: CostItem): RecurringActivityPeriod[] {
  const periods = getRecurringActivityPeriods(item);
  return periods.length ? periods : [];
}

function CostRow({ item, index }: { item: CostItem; index: number }) {
  const { toggleStatus, removeCost, updateCost } = useCosts();
  const [expanded, setExpanded] = useState(false);
  const [editingItem, setEditingItem] = useState<CostItem | null>(null);
  const [restartDate, setRestartDate] = useState("");
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;
  const paymentCount = getRecurringPaymentEvents(item).length;
  const recurringPaidTotal = getRecurringTotalPaid(item);
  const recurringPaymentAmount = getRecurringPaymentAmount(item);
  const billingLabel = item.billingFrequency === "annual" ? "/yr" : "/mo";

  const updateActivityPeriods = (periods: RecurringActivityPeriod[]) => {
    updateCost(item.id, {
      activePeriods: periods,
      recurringStartDate: periods[0]?.startDate,
    }).catch(() => toast.error("Failed to update activity history"));
  };

  const deactivateItem = () => {
    const today = todayIso();
    const periods = normalizeActivityPeriods(item);
    const nextPeriods =
      periods.length > 0
        ? periods.map((period, i) =>
            i === periods.length - 1 && !period.endDate
              ? { ...period, endDate: today, restartDate: restartDate || undefined }
              : period
          )
        : item.recurringStartDate
          ? [{ startDate: item.recurringStartDate, endDate: today, restartDate: restartDate || undefined }]
          : [];

    const withRestart = restartDate
      ? [...nextPeriods, { startDate: restartDate }]
      : nextPeriods;

    updateCost(item.id, {
      status: "inactive",
      activePeriods: withRestart,
      recurringStartDate: withRestart[0]?.startDate ?? item.recurringStartDate,
    })
      .then(() => setRestartDate(""))
      .catch(() => toast.error("Failed to make item inactive"));
  };

  const reactivateItem = () => {
    const today = todayIso();
    const periods = normalizeActivityPeriods(item);
    const hasOpenPeriod = periods.some((period) => !period.endDate);
    const nextPeriods = hasOpenPeriod ? periods : [...periods, { startDate: today }];

    updateCost(item.id, {
      status: "active",
      activePeriods: nextPeriods,
      recurringStartDate: nextPeriods[0]?.startDate ?? today,
    }).catch(() => toast.error("Failed to reactivate item"));
  };

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
                {formatCurrency(recurringPaymentAmount)}
                <span className="text-[10px] text-muted-foreground ml-1">{billingLabel}</span>
              </div>
              {paymentCount > 0 && (
                <div className="text-[10px] text-emerald-glow stat-number">
                  {paymentCount} paid · {formatCurrency(recurringPaidTotal)} total
                </div>
              )}
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
              {item.status === "paid" && item.paidDate && (
                <div className="text-xs text-muted-foreground">
                  Paid date: <span className="stat-number text-foreground">{item.paidDate}</span>
                </div>
              )}
              {!item.isOneTime && (
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>
                    Annual: <span className="stat-number text-foreground">{formatCurrency(item.annualCost)}</span>
                  </span>
                  <span>
                    Billing:{" "}
                    <span className="capitalize text-foreground">
                      {item.billingFrequency ?? "monthly"}
                    </span>
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
                  {item.category === "recurring" && (
                    <span className="flex items-center gap-2">
                      Start date:{" "}
                      <input
                        type="date"
                        value={item.recurringStartDate ?? ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          const val = e.target.value || undefined;
                          updateCost(item.id, {
                            recurringStartDate: val,
                            activePeriods: val && !item.activePeriods?.length
                              ? [{ startDate: val }]
                              : item.activePeriods,
                          }).catch(() => toast.error("Failed to update start date"));
                        }}
                        className="text-foreground bg-secondary border border-border rounded px-2 py-1 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </span>
                  )}
                  {item.category === "recurring" && (
                    <div className="w-full mt-2 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.status === "active" ? (
                          <>
                            <span className="text-[11px] text-muted-foreground">
                              Restart date
                            </span>
                            <input
                              type="date"
                              value={restartDate}
                              onChange={(e) => setRestartDate(e.target.value)}
                              className="text-foreground bg-secondary border border-border rounded px-2 py-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deactivateItem();
                              }}
                              className="h-7 text-xs border-border bg-transparent"
                            >
                              <CalendarX className="w-3 h-3 mr-1" />
                              Make inactive
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              reactivateItem();
                            }}
                            className="h-7 text-xs border-border bg-transparent"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reactivate today
                          </Button>
                        )}
                      </div>

                      {normalizeActivityPeriods(item).length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[11px] text-muted-foreground">Activity periods</div>
                          {normalizeActivityPeriods(item).map((period, periodIndex) => (
                            <div key={`${period.startDate}-${periodIndex}`} className="flex flex-wrap gap-2 items-center">
                              <input
                                type="date"
                                value={period.startDate}
                                onChange={(e) => {
                                  const next = normalizeActivityPeriods(item).map((p, i) =>
                                    i === periodIndex ? { ...p, startDate: e.target.value } : p
                                  );
                                  updateActivityPeriods(next);
                                }}
                                className="text-foreground bg-secondary border border-border rounded px-2 py-1 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="text-[11px] text-muted-foreground">to</span>
                              <input
                                type="date"
                                value={period.endDate ?? ""}
                                onChange={(e) => {
                                  const endDate = e.target.value || undefined;
                                  const next = normalizeActivityPeriods(item).map((p, i) =>
                                    i === periodIndex ? { ...p, endDate } : p
                                  );
                                  updateActivityPeriods(next);
                                }}
                                className="text-foreground bg-secondary border border-border rounded px-2 py-1 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {period.restartDate && (
                                <span className="text-[11px] text-muted-foreground">
                                  restarts {period.restartDate}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {item.category === "recurring" && paymentCount > 0 && (
                    <div className="w-full mt-2">
                      <div className="text-[11px] text-muted-foreground mb-1">Paid months</div>
                      <div className="space-y-1">
                        {Object.keys(getPaidMonthsGrouped(item))
                          .sort((a, b) => Number(b) - Number(a))
                          .map((year) => (
                            <div key={year} className="flex items-start gap-3">
                              <div className="w-10 text-[11px] text-muted-foreground">{year}</div>
                              <div className="flex flex-wrap gap-1">
                                {getPaidMonthsGrouped(item)[Number(year)].map((m) => (
                                  <span key={m} className="px-2 py-0.5 bg-emerald-glow/10 text-emerald-glow rounded text-[11px]">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                  }}
                  className="h-7 text-xs text-foreground hover:bg-secondary"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await removeCost(item.id);
                    } catch {
                      toast.error("Failed to remove cost");
                    }
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

      <EditCostDialog
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      />
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
  const paidSummary =
    category === "recurring" ? getRecurringPaidSummary(filteredCosts) : null;

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
          <div className="text-right space-y-0.5">
            {paidSummary && paidSummary.totalPayments > 0 && (
              <div className="stat-number text-xs font-medium text-emerald-glow">
                {paidSummary.totalPayments} paid · {formatCurrency(paidSummary.totalAmount)} total
              </div>
            )}
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
  const { costs, filteredCosts } = useCosts();
  const taxYears = getAvailableTaxYears(costs);
  const [selectedTaxYear, setSelectedTaxYear] = useState(taxYears[0] ?? new Date().getFullYear());
  const paidItems = getPaidItems(filteredCosts);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-glow"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Paid Totals</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Startup costs plus subscription payments tracked from active dates.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total paid
              </div>
              <div className="stat-number text-xl font-bold text-emerald-glow">
                {formatCurrency(getPaidTotal(costs))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Tax year
              </div>
              <select
                value={selectedTaxYear}
                onChange={(e) => setSelectedTaxYear(Number(e.target.value))}
                className="mt-1 text-foreground bg-secondary border border-border rounded px-2 py-1 text-xs"
              >
                {taxYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Paid in {selectedTaxYear}
              </div>
              <div className="stat-number text-xl font-bold text-sky-glow">
                {formatCurrency(getPaidTotalForTaxYear(costs, selectedTaxYear))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {paidItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-xl overflow-hidden border-l-4 border-l-emerald-glow"
        >
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Paid Items</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  One-time paid costs and subscriptions with tracked payments.
                </p>
              </div>
              <div className="stat-number text-sm font-semibold text-emerald-glow">
                {formatCurrency(paidItems.reduce((sum, item) => sum + getPaidTotalForItem(item), 0))}
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1.5">
            <AnimatePresence>
              {paidItems.map((item, i) => (
                <CostRow key={`paid-${item.id}`} item={item} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <CategorySection category="startup" />
      <CategorySection category="recurring" />
      <CategorySection category="anticipated" />
    </div>
  );
}
