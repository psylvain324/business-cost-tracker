/**
 * Cost repository - CRUD operations for costs table
 */

import type { CostItem, CreateCostBody, UpdateCostBody } from "../../shared/api-types.js";
import { getDb } from "./database.js";
import { nanoid } from "nanoid";

function parseActivePeriods(value: unknown): CostItem["activePeriods"] {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function rowToCost(row: Record<string, unknown>): CostItem {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    category: row.category as CostItem["category"],
    status: row.status as CostItem["status"],
    priority: row.priority as CostItem["priority"],
    monthlyCost: Number(row.monthly_cost),
    annualCost: Number(row.annual_cost),
    isOneTime: Boolean(row.is_one_time),
    oneTimeCost: Number(row.one_time_cost),
    monthlyLow: row.monthly_low != null ? Number(row.monthly_low) : undefined,
    monthlyHigh: row.monthly_high != null ? Number(row.monthly_high) : undefined,
    notes: String(row.notes ?? ""),
    tag: String(row.tag ?? ""),
    paidDate: row.paid_date != null ? String(row.paid_date) : undefined,
    recurringStartDate:
      row.recurring_start_date != null ? String(row.recurring_start_date) : undefined,
    billingFrequency:
      row.billing_frequency === "annual" || row.billing_frequency === "monthly"
        ? row.billing_frequency
        : undefined,
    activePeriods: parseActivePeriods(row.active_periods),
  };
}

export function listCosts(): CostItem[] {
  const database = getDb();
  const rows = database.prepare("SELECT * FROM costs ORDER BY created_at ASC").all();
  return (rows as Record<string, unknown>[]).map(rowToCost);
}

export function getCostById(id: string): CostItem | null {
  const database = getDb();
  const row = database.prepare("SELECT * FROM costs WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToCost(row) : null;
}

export function createCost(body: CreateCostBody): CostItem {
  const id = body.id ?? nanoid();
  const database = getDb();
  database
    .prepare(
      `INSERT INTO costs (
        id, name, description, category, status, priority,
        monthly_cost, annual_cost, is_one_time, one_time_cost,
        monthly_low, monthly_high, notes, tag, paid_date, recurring_start_date, billing_frequency, active_periods
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      body.name,
      body.description,
      body.category,
      body.status,
      body.priority,
      body.monthlyCost,
      body.annualCost,
      body.isOneTime ? 1 : 0,
      body.oneTimeCost,
      body.monthlyLow ?? null,
      body.monthlyHigh ?? null,
      body.notes ?? "",
      body.tag ?? "",
      body.paidDate ?? null,
      body.recurringStartDate ?? null,
      body.billingFrequency ?? null,
      body.activePeriods ? JSON.stringify(body.activePeriods) : null
    );
  return getCostById(id)!;
}

export function updateCost(id: string, body: UpdateCostBody): CostItem | null {
  const existing = getCostById(id);
  if (!existing) return null;

  const merged: CostItem = {
    ...existing,
    ...body,
    id,
  };

  const database = getDb();
  database
    .prepare(
      `UPDATE costs SET
        name = ?, description = ?, category = ?, status = ?, priority = ?,
        monthly_cost = ?, annual_cost = ?, is_one_time = ?, one_time_cost = ?,
        monthly_low = ?, monthly_high = ?, notes = ?, tag = ?, paid_date = ?, recurring_start_date = ?,
        billing_frequency = ?, active_periods = ?,
        updated_at = datetime('now')
      WHERE id = ?`
    )
    .run(
      merged.name,
      merged.description,
      merged.category,
      merged.status,
      merged.priority,
      merged.monthlyCost,
      merged.annualCost,
      merged.isOneTime ? 1 : 0,
      merged.oneTimeCost,
      merged.monthlyLow ?? null,
      merged.monthlyHigh ?? null,
      merged.notes,
      merged.tag,
      merged.paidDate ?? null,
      merged.recurringStartDate ?? null,
      merged.billingFrequency ?? null,
      merged.activePeriods ? JSON.stringify(merged.activePeriods) : null,
      id
    );
  return getCostById(id);
}

export function deleteCost(id: string): boolean {
  const database = getDb();
  const result = database.prepare("DELETE FROM costs WHERE id = ?").run(id);
  return result.changes > 0;
}
