import Database from "better-sqlite3";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import type { CostItem } from "../../shared/api-types";
import { initialCosts } from "../../client/src/lib/costData.js";

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

let db: any | null = null;

export function getDb(): any {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    initSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function seedIfEmpty(sqlite: any) {
  const row = sqlite.prepare("SELECT COUNT(*) as n FROM costs").get() as { n: number };
  if (row.n > 0) return;
  const stmt = sqlite.prepare(`
    INSERT INTO costs (id, name, description, category, status, priority,
      monthly_cost, annual_cost, is_one_time, one_time_cost,
      monthly_low, monthly_high, notes, tag, paid_date, recurring_start_date, billing_frequency, active_periods)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of initialCosts) {
    stmt.run(
      c.id, c.name, c.description, c.category, c.status, c.priority,
      c.monthlyCost, c.annualCost, c.isOneTime ? 1 : 0, c.oneTimeCost,
      c.monthlyLow ?? null, c.monthlyHigh ?? null, c.notes ?? "", c.tag ?? "",
      c.paidDate ?? null,
      c.recurringStartDate ?? null,
      c.billingFrequency ?? null,
      c.activePeriods ? JSON.stringify(c.activePeriods) : null
    );
  }
}

function initSchema(sqlite: any) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS costs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL CHECK(category IN ('startup','recurring','anticipated')),
      status TEXT NOT NULL CHECK(status IN ('paid','active','inactive','pending','recommended')),
      priority TEXT NOT NULL CHECK(priority IN ('essential','important','optional')),
      monthly_cost REAL NOT NULL DEFAULT 0,
      annual_cost REAL NOT NULL DEFAULT 0,
      is_one_time INTEGER NOT NULL DEFAULT 0,
      one_time_cost REAL NOT NULL DEFAULT 0,
      monthly_low REAL,
      monthly_high REAL,
      notes TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      paid_date TEXT,
      recurring_start_date TEXT,
      billing_frequency TEXT CHECK(billing_frequency IN ('monthly','annual')),
      active_periods TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
  migrateInactiveStatusCheck(sqlite);
  const columns = sqlite.prepare("PRAGMA table_info(costs)").all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));
  if (!columnNames.has("billing_frequency")) {
    sqlite.exec("ALTER TABLE costs ADD COLUMN billing_frequency TEXT CHECK(billing_frequency IN ('monthly','annual'))");
  }
  if (!columnNames.has("active_periods")) {
    sqlite.exec("ALTER TABLE costs ADD COLUMN active_periods TEXT");
  }
  if (!columnNames.has("paid_date")) {
    sqlite.exec("ALTER TABLE costs ADD COLUMN paid_date TEXT");
  }
}

function migrateInactiveStatusCheck(sqlite: any) {
  const table = sqlite
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'costs'")
    .get() as { sql?: string } | undefined;
  if (!table?.sql || table.sql.includes("'inactive'")) return;

  const columns = sqlite.prepare("PRAGMA table_info(costs)").all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));
  const selectColumn = (name: string, fallback: string) =>
    columnNames.has(name) ? name : fallback;

  sqlite.exec(`
    ALTER TABLE costs RENAME TO costs_legacy_status;
    CREATE TABLE costs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL CHECK(category IN ('startup','recurring','anticipated')),
      status TEXT NOT NULL CHECK(status IN ('paid','active','inactive','pending','recommended')),
      priority TEXT NOT NULL CHECK(priority IN ('essential','important','optional')),
      monthly_cost REAL NOT NULL DEFAULT 0,
      annual_cost REAL NOT NULL DEFAULT 0,
      is_one_time INTEGER NOT NULL DEFAULT 0,
      one_time_cost REAL NOT NULL DEFAULT 0,
      monthly_low REAL,
      monthly_high REAL,
      notes TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      paid_date TEXT,
      recurring_start_date TEXT,
      billing_frequency TEXT CHECK(billing_frequency IN ('monthly','annual')),
      active_periods TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    INSERT INTO costs (
      id, name, description, category, status, priority,
      monthly_cost, annual_cost, is_one_time, one_time_cost,
      monthly_low, monthly_high, notes, tag, paid_date, recurring_start_date,
      billing_frequency, active_periods, created_at, updated_at
    )
    SELECT
      id, name, description, category, status, priority,
      monthly_cost, annual_cost, is_one_time, one_time_cost,
      monthly_low, monthly_high, notes, tag,
      ${selectColumn("paid_date", "NULL")},
      recurring_start_date,
      ${selectColumn("billing_frequency", "NULL")},
      ${selectColumn("active_periods", "NULL")},
      ${selectColumn("created_at", "datetime('now')")},
      ${selectColumn("updated_at", "datetime('now')")}
    FROM costs_legacy_status;
    DROP TABLE costs_legacy_status;
  `);
}

function parseActivePeriods(value: unknown): CostItem["activePeriods"] {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
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
    paidDate: row.paid_date != null ? String(row.paid_date) : undefined,
    recurringStartDate:
      row.recurring_start_date != null
        ? String(row.recurring_start_date)
        : undefined,
    billingFrequency:
      row.billing_frequency === "annual" || row.billing_frequency === "monthly"
        ? row.billing_frequency
        : undefined,
    activePeriods: parseActivePeriods(row.active_periods),
  };
}
