/*
 * Cost Context — Global state management for cost tracking
 * Design: Command Deck — Dark Executive Dashboard
 * Supports API backend when VITE_API_BASE_URL is set; falls back to localStorage.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { initialCosts, type CostItem, type CostCategory, type CostStatus } from "@/lib/costData";
import {
  listCosts,
  createCost as apiCreateCost,
  updateCost as apiUpdateCost,
  deleteCost as apiDeleteCost,
  isApiConfigured,
} from "@/api/costs";
import { toast } from "sonner";

const STORAGE_KEY = "business-costs";

function loadFromStorage(): CostItem[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCosts;
    }
  }
  return initialCosts;
}

function saveToStorage(costs: CostItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
}

interface CostContextType {
  costs: CostItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addCost: (cost: CostItem) => void | Promise<void>;
  updateCost: (id: string, updates: Partial<CostItem>) => void | Promise<void>;
  removeCost: (id: string) => void | Promise<void>;
  toggleStatus: (id: string) => void | Promise<void>;
  activeFilter: CostCategory | "all";
  setActiveFilter: (filter: CostCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCosts: CostItem[];
}

const CostContext = createContext<CostContextType | null>(null);

export function CostProvider({ children }: { children: ReactNode }) {
  const [costs, setCosts] = useState<CostItem[]>(loadFromStorage);
  const [isLoading, setIsLoading] = useState(isApiConfigured());
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CostCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const persist = useCallback((newCosts: CostItem[]) => {
    setCosts(newCosts);
    saveToStorage(newCosts);
  }, []);

  const refetch = useCallback(async () => {
    if (!isApiConfigured()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listCosts();
      persist(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load costs";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  useEffect(() => {
    if (isApiConfigured()) {
      refetch();
    }
  }, [refetch]);

  const addCost = useCallback(
    async (cost: CostItem) => {
      if (isApiConfigured()) {
        const created = await apiCreateCost(cost);
        persist([...costs, created]);
        toast.success(`Added "${cost.name}"`);
      } else {
        persist([...costs, cost]);
        toast.success(`Added "${cost.name}" to your costs`);
      }
    },
    [costs, persist]
  );

  const updateCost = useCallback(
    async (id: string, updates: Partial<CostItem>) => {
      const next = costs.map((c) => (c.id === id ? { ...c, ...updates } : c));
      if (isApiConfigured()) {
        const updated = await apiUpdateCost(id, updates);
        persist(costs.map((c) => (c.id === id ? updated : c)));
        toast.success("Updated");
      } else {
        persist(next);
      }
    },
    [costs, persist]
  );

  const removeCost = useCallback(
    async (id: string) => {
      if (isApiConfigured()) {
        await apiDeleteCost(id);
        persist(costs.filter((c) => c.id !== id));
        toast.success("Removed");
      } else {
        persist(costs.filter((c) => c.id !== id));
      }
    },
    [costs, persist]
  );

  const toggleStatus = useCallback(
    async (id: string) => {
      const statusCycle: Record<CostStatus, CostStatus> = {
        recommended: "pending",
        pending: "active",
        active: "paid",
        paid: "active",
      };
      const item = costs.find((c) => c.id === id);
      if (!item) return;
      const nextStatus = statusCycle[item.status];
      await updateCost(id, { status: nextStatus });
    },
    [costs, updateCost]
  );

  const filteredCosts = costs.filter((c) => {
    const matchesFilter = activeFilter === "all" || c.category === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <CostContext.Provider
      value={{
        costs,
        isLoading,
        error,
        refetch,
        addCost,
        updateCost,
        removeCost,
        toggleStatus,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        filteredCosts,
      }}
    >
      {children}
    </CostContext.Provider>
  );
}

export function useCosts() {
  const ctx = useContext(CostContext);
  if (!ctx) throw new Error("useCosts must be used within CostProvider");
  return ctx;
}
