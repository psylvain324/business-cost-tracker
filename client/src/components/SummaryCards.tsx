/*
 * SummaryCards — Top financial overview strip
 * Design: Command Deck — glowing stat cards with monospaced numbers
 */

import { useCosts } from "@/contexts/CostContext";
import {
  getTotalMonthlyRecurring,
  getTotalMonthlyAnticipated,
  getTotalAnnualAll,
  getTotalMonthlyAll,
  formatCurrency,
  getRecurringCosts,
  getAnticipatedCosts,
  getPaidTotal,
  getCurrentTaxYear,
  getPaidTotalForTaxYear,
} from "@/lib/costData";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, CalendarClock, Layers } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function SummaryCards() {
  const { costs } = useCosts();

  const paidTotal = getPaidTotal(costs);
  const currentTaxYear = getCurrentTaxYear();
  const currentTaxYearPaid = getPaidTotalForTaxYear(costs, currentTaxYear);
  const monthlyRecurring = getTotalMonthlyRecurring(costs);
  const monthlyAnticipated = getTotalMonthlyAnticipated(costs);
  const monthlyAll = getTotalMonthlyAll(costs);
  const annualAll = getTotalAnnualAll(costs);
  const recurringCount = getRecurringCosts(costs).length;
  const anticipatedCount = getAnticipatedCosts(costs).length;

  const cards = [
    {
      label: "Total Paid",
      value: formatCurrency(paidTotal),
      sublabel: `${formatCurrency(currentTaxYearPaid)} in ${currentTaxYear}`,
      icon: DollarSign,
      glowClass: "glow-emerald",
      accentColor: "text-emerald-glow",
      bgAccent: "bg-emerald-glow/10",
    },
    {
      label: "Monthly Recurring",
      value: formatCurrency(monthlyRecurring),
      sublabel: `${recurringCount} active services`,
      icon: TrendingUp,
      glowClass: "glow-amber",
      accentColor: "text-amber-glow",
      bgAccent: "bg-amber-glow/10",
    },
    {
      label: "Monthly Anticipated",
      value: formatCurrency(monthlyAnticipated),
      sublabel: `${anticipatedCount} recommended`,
      icon: CalendarClock,
      glowClass: "glow-sky",
      accentColor: "text-sky-glow",
      bgAccent: "bg-sky-glow/10",
    },
    {
      label: "Total Monthly Burn",
      value: formatCurrency(monthlyAll),
      sublabel: `${formatCurrency(annualAll)}/year projected`,
      icon: Layers,
      glowClass: "glow-rose",
      accentColor: "text-rose-glow",
      bgAccent: "bg-rose-glow/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className={`glass-card rounded-xl p-5 ${card.glowClass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg ${card.bgAccent}`}>
              <card.icon className={`w-4 h-4 ${card.accentColor}`} />
            </div>
          </div>
          <div className={`stat-number text-2xl font-bold ${card.accentColor} mb-1`}>
            {card.value}
          </div>
          <p className="text-xs text-muted-foreground">{card.sublabel}</p>
        </motion.div>
      ))}
    </div>
  );
}
