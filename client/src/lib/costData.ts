/*
 * Cost Data Model & Initial Data
 * Design: Command Deck — Dark Executive Dashboard
 * Categories: startup (one-time), recurring (monthly), anticipated (recommended)
 */

export type CostStatus = "paid" | "active" | "inactive" | "pending" | "recommended";
export type CostCategory = "startup" | "recurring" | "anticipated";
export type CostPriority = "essential" | "important" | "optional";
export type RecurringBillingFrequency = "monthly" | "annual";

export interface RecurringActivityPeriod {
  startDate: string;
  endDate?: string;
  restartDate?: string;
}

export interface CostItem {
  id: string;
  name: string;
  description: string;
  category: CostCategory;
  status: CostStatus;
  priority: CostPriority;
  monthlyCost: number;
  annualCost: number;
  isOneTime: boolean;
  oneTimeCost: number;
  monthlyLow?: number;
  monthlyHigh?: number;
  notes: string;
  tag: string;
  paidDate?: string;
  /** Start date for recurring charges (YYYY-MM-DD). Used to compute payments count and total paid. */
  recurringStartDate?: string;
  billingFrequency?: RecurringBillingFrequency;
  activePeriods?: RecurringActivityPeriod[];
}

export const initialCosts: CostItem[] = [
  // ── STARTUP COSTS (Already Paid) ──
  {
    id: "llc-filing",
    name: "LLC Filing",
    description: "State LLC formation filing fee",
    category: "startup",
    status: "paid",
    priority: "essential",
    monthlyCost: 0,
    annualCost: 0,
    isOneTime: true,
    oneTimeCost: 135,
    paidDate: "2026-04-15",
    notes: "Already paid. One-time cost for business formation.",
    tag: "Legal",
  },

  // ── RECURRING COSTS (Known) ──
  {
    id: "manus-subscription",
    name: "Manus AI Subscription",
    description: "Standard plan — AI assistant for business operations",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 20,
    annualCost: 240,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "One-year subscription. Standard plan at $20/mo ($17/mo if billed annually at $204/yr).",
    tag: "AI & Automation",
  },
  {
    id: "phone-numbers",
    name: "Business Phone Numbers (x2)",
    description: "Two dedicated business phone lines for lead management",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 10,
    annualCost: 120,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "$5/each per month for two phone numbers.",
    tag: "Communications",
  },
  {
    id: "sms-messaging",
    name: "SMS Text Messaging",
    description: "500–1,000 SMS texts per month for lead outreach",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 375,
    annualCost: 4500,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 250,
    monthlyHigh: 500,
    notes: "500–1,000 texts/month at $0.50 each. Average estimated at 750 texts ($375/mo).",
    tag: "Communications",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "CRM platform for lead tracking and pipeline management",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 11,
    annualCost: 132,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Starter plan. Core CRM for managing health insurance leads.",
    tag: "CRM & Sales",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Pro",
    description: "AI voice synthesis for automated calls and IVR",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 99,
    annualCost: 1188,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Pro plan for AI voice generation in lead outreach.",
    tag: "AI & Automation",
  },
  {
    id: "domain",
    name: "Website Domain",
    description: "Custom domain for business website",
    category: "recurring",
    status: "active",
    priority: "essential",
    monthlyCost: 7.5,
    annualCost: 90,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 5,
    monthlyHigh: 10,
    notes: "Domain registration/renewal. Estimated $5–$10/month.",
    tag: "Website",
  },

  // ── ANTICIPATED / RECOMMENDED COSTS ──
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Professional business email and productivity suite",
    category: "anticipated",
    status: "recommended",
    priority: "essential",
    monthlyCost: 7,
    annualCost: 84,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Business Starter plan. Professional email (you@yourdomain.com), Google Drive, Docs, Calendar. Critical for credibility with insurance carriers.",
    tag: "Business Operations",
  },
  {
    id: "eo-insurance",
    name: "E&O / Professional Liability Insurance",
    description: "Errors & Omissions insurance for insurance professionals",
    category: "anticipated",
    status: "recommended",
    priority: "essential",
    monthlyCost: 50,
    annualCost: 600,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 42,
    monthlyHigh: 80,
    notes: "Required for most insurance carriers. Protects against claims of negligence or inadequate work. Median cost ~$42–$80/mo.",
    tag: "Insurance & Compliance",
  },
  {
    id: "general-liability",
    name: "General Liability Insurance",
    description: "Basic business liability coverage",
    category: "anticipated",
    status: "recommended",
    priority: "important",
    monthlyCost: 30,
    annualCost: 360,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Covers general business risks. Often bundled with E&O for savings.",
    tag: "Insurance & Compliance",
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Appointment scheduling for lead consultations",
    category: "anticipated",
    status: "recommended",
    priority: "important",
    monthlyCost: 12,
    annualCost: 144,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Standard plan. Automates appointment booking with leads. Integrates with HubSpot and Google Calendar.",
    tag: "Lead Management",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Workflow automation connecting your tools",
    category: "anticipated",
    status: "recommended",
    priority: "important",
    monthlyCost: 20,
    annualCost: 240,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Starter plan. Automates data flow between HubSpot, ElevenLabs, SMS, and other tools. Saves hours of manual work.",
    tag: "AI & Automation",
  },
  {
    id: "accounting-software",
    name: "QuickBooks / FreshBooks",
    description: "Accounting and bookkeeping software",
    category: "anticipated",
    status: "recommended",
    priority: "essential",
    monthlyCost: 20,
    annualCost: 240,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 15,
    monthlyHigh: 30,
    notes: "Track income, expenses, invoices, and tax preparation. Essential for business financial management.",
    tag: "Business Operations",
  },
  {
    id: "hipaa-compliance",
    name: "HIPAA Compliance Platform",
    description: "HIPAA compliance management for handling health data",
    category: "anticipated",
    status: "recommended",
    priority: "essential",
    monthlyCost: 35,
    annualCost: 420,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 25,
    monthlyHigh: 50,
    notes: "Critical for health insurance businesses. Ensures compliance when handling protected health information (PHI). Includes training, policies, and risk assessments.",
    tag: "Insurance & Compliance",
  },
  {
    id: "email-marketing",
    name: "Email Marketing (Mailchimp / SendGrid)",
    description: "Email campaigns for lead nurturing",
    category: "anticipated",
    status: "recommended",
    priority: "important",
    monthlyCost: 15,
    annualCost: 180,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 13,
    monthlyHigh: 20,
    notes: "Automated drip campaigns for lead nurturing. Keeps prospects engaged between consultations.",
    tag: "Marketing",
  },
  {
    id: "web-hosting",
    name: "Web Hosting (Vercel / Netlify)",
    description: "Website hosting and deployment",
    category: "anticipated",
    status: "recommended",
    priority: "important",
    monthlyCost: 10,
    annualCost: 120,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 0,
    monthlyHigh: 20,
    notes: "Free tier available for basic sites. Pro plans for custom domains, analytics, and performance. May already be covered by Manus hosting.",
    tag: "Website",
  },
  {
    id: "social-media",
    name: "Social Media Management (Buffer)",
    description: "Schedule and manage social media posts",
    category: "anticipated",
    status: "recommended",
    priority: "optional",
    monthlyCost: 6,
    annualCost: 72,
    isOneTime: false,
    oneTimeCost: 0,
    notes: "Essentials plan. Schedule posts across platforms to build brand awareness in the health insurance space.",
    tag: "Marketing",
  },
  {
    id: "google-ads",
    name: "Google Ads Budget",
    description: "Pay-per-click advertising for lead generation",
    category: "anticipated",
    status: "recommended",
    priority: "optional",
    monthlyCost: 350,
    annualCost: 4200,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 200,
    monthlyHigh: 500,
    notes: "Variable budget. Target health insurance keywords in your service area. Start small and scale based on ROI.",
    tag: "Advertising",
  },
  {
    id: "facebook-ads",
    name: "Facebook / Meta Ads Budget",
    description: "Social media advertising for lead generation",
    category: "anticipated",
    status: "recommended",
    priority: "optional",
    monthlyCost: 300,
    annualCost: 3600,
    isOneTime: false,
    oneTimeCost: 0,
    monthlyLow: 200,
    monthlyHigh: 500,
    notes: "Variable budget. Effective for targeting demographics interested in health insurance. Pair with retargeting pixels.",
    tag: "Advertising",
  },
];

// Helper functions
export function getStartupCosts(costs: CostItem[]) {
  return costs.filter((c) => c.category === "startup");
}

export function getRecurringCosts(costs: CostItem[]) {
  return costs.filter((c) => c.category === "recurring");
}

export function getAnticipatedCosts(costs: CostItem[]) {
  return costs.filter((c) => c.category === "anticipated");
}

export function getTotalStartupCost(costs: CostItem[]) {
  return getStartupCosts(costs).reduce((sum, c) => sum + c.oneTimeCost, 0);
}

export function getTotalMonthlyRecurring(costs: CostItem[]) {
  return getRecurringCosts(costs).reduce((sum, c) => sum + c.monthlyCost, 0);
}

export function getTotalMonthlyAnticipated(costs: CostItem[]) {
  return getAnticipatedCosts(costs).reduce((sum, c) => sum + c.monthlyCost, 0);
}

export function getTotalAnnualRecurring(costs: CostItem[]) {
  return getRecurringCosts(costs).reduce((sum, c) => sum + c.annualCost, 0);
}

export function getTotalAnnualAnticipated(costs: CostItem[]) {
  return getAnticipatedCosts(costs).reduce((sum, c) => sum + c.annualCost, 0);
}

export function getTotalMonthlyAll(costs: CostItem[]) {
  return costs
    .filter((c) => !c.isOneTime)
    .reduce((sum, c) => sum + c.monthlyCost, 0);
}

export function getTotalAnnualAll(costs: CostItem[]) {
  const monthlyTotal = getTotalMonthlyAll(costs);
  const oneTimeTotal = costs
    .filter((c) => c.isOneTime)
    .reduce((sum, c) => sum + c.oneTimeCost, 0);
  return monthlyTotal * 12 + oneTimeTotal;
}

export function getUniqueTags(costs: CostItem[]) {
  return Array.from(new Set(costs.map((c) => c.tag)));
}

function parseLocalDate(date: string): Date | null {
  if (!date) return null;
  const parsed = new Date(date + "T00:00:00");
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getPaidDateYear(item: CostItem): number {
  const paidDate = item.paidDate ? parseLocalDate(item.paidDate) : null;
  return paidDate ? paidDate.getFullYear() : getCurrentTaxYear();
}

function toMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getBillingFrequency(item: CostItem): RecurringBillingFrequency {
  return item.billingFrequency === "annual" ? "annual" : "monthly";
}

export function getRecurringPaymentAmount(item: CostItem): number {
  if (item.isOneTime) return 0;
  return getBillingFrequency(item) === "annual"
    ? item.annualCost || item.monthlyCost * 12
    : item.monthlyCost;
}

export function getRecurringActivityPeriods(item: CostItem): RecurringActivityPeriod[] {
  if (item.activePeriods?.length) {
    return item.activePeriods
      .filter((period) => period.startDate)
      .slice()
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }
  return item.recurringStartDate ? [{ startDate: item.recurringStartDate }] : [];
}

export function getTaxYear(date: Date): number {
  return date.getFullYear();
}

export function getCurrentTaxYear(): number {
  return getTaxYear(new Date());
}

export interface RecurringPaymentEvent {
  itemId: string;
  itemName: string;
  date: string;
  year: number;
  month: number;
  amount: number;
  billingFrequency: RecurringBillingFrequency;
}

export function getRecurringPaymentEvents(
  item: CostItem,
  upto: Date = new Date()
): RecurringPaymentEvent[] {
  if (item.isOneTime) return [];
  const amount = getRecurringPaymentAmount(item);
  if (amount <= 0) return [];

  const stepMonths = getBillingFrequency(item) === "annual" ? 12 : 1;
  const cutoff = toMonthStart(upto);

  return getRecurringActivityPeriods(item).flatMap((period) => {
    const start = parseLocalDate(period.startDate);
    if (!start) return [];

    const periodEnd = period.endDate ? parseLocalDate(period.endDate) : cutoff;
    if (!periodEnd) return [];

    const first = toMonthStart(start);
    const last = toMonthStart(periodEnd < cutoff ? periodEnd : cutoff);
    if (first > last) return [];

    const events: RecurringPaymentEvent[] = [];
    for (let cur = first; cur <= last; cur = addMonths(cur, stepMonths)) {
      events.push({
        itemId: item.id,
        itemName: item.name,
        date: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-01`,
        year: cur.getFullYear(),
        month: cur.getMonth(),
        amount,
        billingFrequency: getBillingFrequency(item),
      });
    }
    return events;
  });
}

/** Number of monthly payments since recurring start date (inclusive of current month). */
export function getRecurringPaymentsCount(
  startDate: string,
  billingFrequency: RecurringBillingFrequency = "monthly"
): number {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  if (start > now) return 0;
  const monthsElapsed =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const step = billingFrequency === "annual" ? 12 : 1;
  return Math.max(0, Math.floor(monthsElapsed / step) + 1);
}

/** Total amount paid for a recurring item based on start date. */
export function getRecurringTotalPaid(item: CostItem): number {
  return getRecurringPaymentEvents(item).reduce((sum, event) => sum + event.amount, 0);
}

/** Summary of paid recurring items: { count, totalAmount }. */
export function getRecurringPaidSummary(costs: CostItem[]) {
  const recurringWithStart = costs.filter(
    (c) => c.category === "recurring" && !c.isOneTime && getRecurringActivityPeriods(c).length > 0
  );
  const totalPayments = recurringWithStart.reduce(
    (sum, c) => sum + getRecurringPaymentEvents(c).length,
    0
  );
  const totalAmount = recurringWithStart.reduce(
    (sum, c) => sum + getRecurringTotalPaid(c),
    0
  );
  return { itemCount: recurringWithStart.length, totalPayments, totalAmount };
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Return an array of { year, monthIndex } for every monthly payment since start (inclusive). */
export function getPaidMonthsSinceStart(startDate: string, upto: Date = new Date()) {
  const start = new Date(startDate + "T00:00:00");
  if (start > upto) return [];
  const months: { year: number; month: number }[] = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = new Date(upto.getFullYear(), upto.getMonth(), 1);
  while (cur <= end) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months;
}

/** Group paid months by year and return an ordered object { [year]: string[] } (months short names). */
export function getPaidMonthsGrouped(item: CostItem, upto: Date = new Date()) {
  if (item.isOneTime) return {} as Record<number, string[]>;
  const months = getRecurringPaymentEvents(item, upto);
  const grouped: Record<number, string[]> = {};
  months.forEach(({ year, month, billingFrequency }) => {
    grouped[year] = grouped[year] || [];
    grouped[year].push(billingFrequency === "annual" ? `${MONTH_NAMES[month]} annual` : MONTH_NAMES[month]);
  });
  return grouped;
}

export function getPaidItems(costs: CostItem[]) {
  return costs.filter((c) => c.status === "paid" || getRecurringTotalPaid(c) > 0);
}

export function getPaidTotalForItem(item: CostItem): number {
  const oneTimePaid = item.isOneTime && item.status === "paid" ? item.oneTimeCost : 0;
  return oneTimePaid + getRecurringTotalPaid(item);
}

export function getPaidTotalsByTaxYear(costs: CostItem[], upto: Date = new Date()) {
  const totals: Record<number, number> = {};

  costs.forEach((item) => {
    if (item.isOneTime && item.status === "paid") {
      const year = getPaidDateYear(item);
      totals[year] = (totals[year] || 0) + item.oneTimeCost;
      return;
    }

    getRecurringPaymentEvents(item, upto).forEach((event) => {
      totals[event.year] = (totals[event.year] || 0) + event.amount;
    });
  });

  return totals;
}

export function getPaidTotal(costs: CostItem[]) {
  return Object.values(getPaidTotalsByTaxYear(costs)).reduce((sum, amount) => sum + amount, 0);
}

export function getAvailableTaxYears(costs: CostItem[]) {
  const years = new Set<number>([getCurrentTaxYear()]);
  Object.keys(getPaidTotalsByTaxYear(costs)).forEach((year) => years.add(Number(year)));
  return Array.from(years).sort((a, b) => b - a);
}

export function getPaidTotalForTaxYear(costs: CostItem[], year: number) {
  return getPaidTotalsByTaxYear(costs)[year] || 0;
}

export function getCostsByTag(costs: CostItem[], tag: string) {
  return costs.filter((c) => c.tag === tag);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return formatCurrency(amount);
}
