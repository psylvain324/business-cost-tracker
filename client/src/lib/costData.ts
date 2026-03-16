/*
 * Cost Data Model & Initial Data
 * Design: Command Deck — Dark Executive Dashboard
 * Categories: startup (one-time), recurring (monthly), anticipated (recommended)
 */

export type CostStatus = "paid" | "active" | "pending" | "recommended";
export type CostCategory = "startup" | "recurring" | "anticipated";
export type CostPriority = "essential" | "important" | "optional";

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
  /** Start date for recurring charges (YYYY-MM-DD). Used to compute payments count and total paid. */
  recurringStartDate?: string;
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

/** Number of monthly payments since recurring start date (inclusive of current month). */
export function getRecurringPaymentsCount(startDate: string): number {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  if (start > now) return 0;
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth()) +
    1;
  return Math.max(0, months);
}

/** Total amount paid for a recurring item based on start date. */
export function getRecurringTotalPaid(item: CostItem): number {
  if (item.isOneTime || !item.recurringStartDate) return 0;
  const count = getRecurringPaymentsCount(item.recurringStartDate);
  return count * item.monthlyCost;
}

/** Summary of paid recurring items: { count, totalAmount }. */
export function getRecurringPaidSummary(costs: CostItem[]) {
  const recurringWithStart = costs.filter(
    (c) => c.category === "recurring" && !c.isOneTime && c.recurringStartDate
  );
  const totalPayments = recurringWithStart.reduce(
    (sum, c) => sum + getRecurringPaymentsCount(c.recurringStartDate!),
    0
  );
  const totalAmount = recurringWithStart.reduce(
    (sum, c) => sum + getRecurringTotalPaid(c),
    0
  );
  return { itemCount: recurringWithStart.length, totalPayments, totalAmount };
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
