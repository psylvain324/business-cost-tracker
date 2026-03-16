/**
 * API types for Business Cost Tracker
 * Shared between client and API - ensure request/response shapes match.
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
  recurringStartDate?: string;
}

/** Body for creating a new cost (id optional, server may generate) */
export type CreateCostBody = Omit<CostItem, "id"> & { id?: string };

/** Body for updating a cost (all fields optional except id) */
export type UpdateCostBody = Partial<Omit<CostItem, "id">>;
