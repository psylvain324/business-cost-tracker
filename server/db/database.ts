import Database from "better-sqlite3";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import type { CostItem } from "../../shared/api-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH =
  process.env.DB_PATH || path.join(process.cwd(), "data", "costs.db");

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    initSchema(db);
  }
  return db;
}

function initSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS costs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL CHECK(category IN ('startup','recurring','anticipated')),
      status TEXT NOT NULL CHECK(status IN ('paid','active','pending','recommended')),
      priority TEXT NOT NULL CHECK(priority IN ('essential','important','optional')),
      monthly_cost REAL NOT NULL DEFAULT 0,
      annual_cost REAL NOT NULL DEFAULT 0,
      is_one_time INTEGER NOT NULL DEFAULT 0,
      one_time_cost REAL NOT NULL DEFAULT 0,
      monthly_low REAL,
      monthly_high REAL,
      notes TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      recurring_start_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function rowToCost(row: Record<string, unknown>): CostItem {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    category: (row.category as CostItem["category"]) ?? "recurring",
    status: (row.status as CostItem["status"]) ?? "pending",
    priority: (row.priority as CostItem["priority"]) ?? "important",
    monthlyCost: Number(row.monthly_cost ?? 0),
    annualCost: Number(row.annual_cost ?? 0),
    isOneTime: Boolean(row.is_one_time),
    oneTimeCost: Number(row.one_time_cost ?? 0),
    monthlyLow: row.monthly_low != null ? Number(row.monthly_low) : undefined,
    monthlyHigh: row.monthly_high != null ? Number(row.monthly_high) : undefined,
    notes: String(row.notes ?? ""),
    tag: String(row.tag ?? ""),
    recurringStartDate:
      row.recurring_start_date != null
        ? String(row.recurring_start_date)
        : undefined,
  };
}
