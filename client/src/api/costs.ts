/**
 * Costs API service
 * Fetches and persists cost data to your backend API.
 * Configure VITE_API_BASE_URL in .env to enable.
 */

import {
  apiGet,
  apiPost,
  apiPatch,
  apiPut,
  apiDelete,
  isApiConfigured,
} from "./client";
import type { CostItem, CreateCostBody, UpdateCostBody } from "@shared/api-types";

const COSTS_PATH = "/api/costs";

/**
 * List all costs. Returns empty array if API returns non-array or error.
 */
export async function listCosts(): Promise<CostItem[]> {
  if (!isApiConfigured()) return [];
  try {
    const data = await apiGet<CostItem[] | { costs: CostItem[] }>(COSTS_PATH);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "costs" in data && Array.isArray(data.costs)) {
      return data.costs;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Create a new cost. Returns the created item with server-assigned id if applicable.
 */
export async function createCost(body: CreateCostBody): Promise<CostItem> {
  const created = await apiPost<CostItem>(COSTS_PATH, body);
  return created;
}

/**
 * Update an existing cost by id.
 */
export async function updateCost(id: string, body: UpdateCostBody): Promise<CostItem> {
  const updated = await apiPatch<CostItem>(`${COSTS_PATH}/${id}`, body);
  return updated;
}

/**
 * Delete a cost by id.
 */
export async function deleteCost(id: string): Promise<void> {
  await apiDelete(`${COSTS_PATH}/${id}`);
}

/**
 * Bulk replace all costs (optional - use if your API supports PUT /api/costs).
 */
export async function replaceCosts(costs: CostItem[]): Promise<CostItem[]> {
  const data = await apiPut<CostItem[] | { costs: CostItem[] }>(COSTS_PATH, { costs });
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "costs" in data && Array.isArray(data.costs)) {
    return data.costs;
  }
  return costs;
}

export { isApiConfigured };
