/*
 * Cost Context — Global state management for cost tracking
 * Design: Command Deck — Dark Executive Dashboard
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { initialCosts, type CostItem, type CostCategory, type CostStatus } from "@/lib/costData";

interface CostContextType {
  costs: CostItem[];
  addCost: (cost: CostItem) => void;
  updateCost: (id: string, updates: Partial<CostItem>) => void;
  removeCost: (id: string) => void;
  toggleStatus: (id: string) => void;
  activeFilter: CostCategory | "all";
  setActiveFilter: (filter: CostCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCosts: CostItem[];
}

const CostContext = createContext<CostContextType | null>(null);

export function CostProvider({ children }: { children: ReactNode }) {
  const [costs, setCosts] = useState<CostItem[]>(() => {
    const saved = localStorage.getItem("business-costs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCosts;
      }
    }
    return initialCosts;
  });

  const [activeFilter, setActiveFilter] = useState<CostCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const saveCosts = useCallback((newCosts: CostItem[]) => {
    setCosts(newCosts);
    localStorage.setItem("business-costs", JSON.stringify(newCosts));
  }, []);

  const addCost = useCallback(
    (cost: CostItem) => {
      saveCosts([...costs, cost]);
    },
    [costs, saveCosts]
  );

  const updateCost = useCallback(
    (id: string, updates: Partial<CostItem>) => {
      saveCosts(costs.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    },
    [costs, saveCosts]
  );

  const removeCost = useCallback(
    (id: string) => {
      saveCosts(costs.filter((c) => c.id !== id));
    },
    [costs, saveCosts]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const statusCycle: Record<CostStatus, CostStatus> = {
        recommended: "pending",
        pending: "active",
        active: "paid",
        paid: "active",
      };
      saveCosts(
        costs.map((c) =>
          c.id === id ? { ...c, status: statusCycle[c.status] } : c
        )
      );
    },
    [costs, saveCosts]
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
