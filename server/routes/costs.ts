/**
 * Express API routes for costs (CRUD).
 * Mount at /api/costs
 */

import { Router, type Request, type Response } from "express";
import * as costRepo from "../db/costRepository.js";
import type { CreateCostBody, UpdateCostBody } from "../../shared/api-types.js";

const router = Router();

/** GET /api/costs - list all costs */
router.get("/", (_req: Request, res: Response) => {
  try {
    const costs = costRepo.listCosts();
    res.json(costs);
  } catch (e) {
    console.error("GET /api/costs error:", e);
    res.status(500).json({ error: "Failed to list costs" });
  }
});

/** POST /api/costs - create a cost */
router.post("/", (req: Request, res: Response) => {
  try {
    const body = req.body as CreateCostBody;
    if (!body || typeof body.name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }
    const created = costRepo.createCost(body);
    res.status(201).json(created);
  } catch (e) {
    console.error("POST /api/costs error:", e);
    res.status(500).json({ error: "Failed to create cost" });
  }
});

/** PATCH /api/costs/:id - update a cost */
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateCostBody;
    const updated = costRepo.updateCost(id, body ?? {});
    if (!updated) {
      return res.status(404).json({ error: "Cost not found" });
    }
    res.json(updated);
  } catch (e) {
    console.error("PATCH /api/costs/:id error:", e);
    res.status(500).json({ error: "Failed to update cost" });
  }
});

/** DELETE /api/costs/:id - delete a cost */
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = costRepo.deleteCost(id);
    if (!deleted) {
      return res.status(404).json({ error: "Cost not found" });
    }
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /api/costs/:id error:", e);
    res.status(500).json({ error: "Failed to delete cost" });
  }
});

export default router;
