/*
 * EditCostDialog — Modal for editing existing cost items
 * Design: Command Deck — Dark Executive Dashboard
 */

import { useState, useEffect } from "react";
import { useCosts } from "@/contexts/CostContext";
import type { CostItem, CostCategory, CostStatus, CostPriority } from "@/lib/costData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditCostDialogProps {
  item: CostItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditCostDialog({ item, open, onOpenChange }: EditCostDialogProps) {
  const { updateCost } = useCosts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CostCategory>("recurring");
  const [status, setStatus] = useState<CostStatus>("pending");
  const [priority, setPriority] = useState<CostPriority>("important");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [isOneTime, setIsOneTime] = useState(false);
  const [oneTimeCost, setOneTimeCost] = useState("");
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [tag, setTag] = useState("Business Operations");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setCategory(item.category);
      setStatus(item.status);
      setPriority(item.priority);
      setMonthlyCost(item.isOneTime ? "" : String(item.monthlyCost));
      setIsOneTime(item.isOneTime);
      setOneTimeCost(item.isOneTime ? String(item.oneTimeCost) : "");
      setRecurringStartDate(item.recurringStartDate ?? "");
      setTag(item.tag);
      setNotes(item.notes);
    }
  }, [item, open]);

  const handleSubmit = async () => {
    if (!item) return;
    if (!name.trim()) {
      toast.error("Please enter a cost name");
      return;
    }

    const monthly = parseFloat(monthlyCost) || 0;
    const oneTime = parseFloat(oneTimeCost) || 0;

    const updates: Partial<CostItem> = {
      name: name.trim(),
      description: description.trim() || name.trim(),
      category,
      status,
      priority,
      monthlyCost: isOneTime ? 0 : monthly,
      annualCost: isOneTime ? 0 : monthly * 12,
      isOneTime,
      oneTimeCost: isOneTime ? oneTime : 0,
      notes: notes.trim() || "Custom cost entry.",
      tag,
      recurringStartDate:
        category === "recurring" && !isOneTime && recurringStartDate
          ? recurringStartDate
          : undefined,
    };

    try {
      await updateCost(item.id, updates);
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update cost");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Cost</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Zoom Pro"
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CostCategory)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="anticipated">Anticipated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CostStatus)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as CostPriority)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="essential">Essential</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tag</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="AI & Automation">AI & Automation</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                  <SelectItem value="CRM & Sales">CRM & Sales</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Business Operations">Business Operations</SelectItem>
                  <SelectItem value="Insurance & Compliance">Insurance & Compliance</SelectItem>
                  <SelectItem value="Lead Management">Lead Management</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Advertising">Advertising</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOneTime}
                onChange={(e) => setIsOneTime(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-xs text-muted-foreground">One-time cost (not recurring)</span>
            </label>
          </div>

          {isOneTime ? (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">One-Time Cost ($)</Label>
              <Input
                type="number"
                value={oneTimeCost}
                onChange={(e) => setOneTimeCost(e.target.value)}
                placeholder="0.00"
                className="bg-secondary border-border text-foreground stat-number"
              />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Monthly Cost ($)</Label>
                <Input
                  type="number"
                  value={monthlyCost}
                  onChange={(e) => setMonthlyCost(e.target.value)}
                  placeholder="0.00"
                  className="bg-secondary border-border text-foreground stat-number"
                />
              </div>
              {category === "recurring" && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date (optional)</Label>
                  <Input
                    type="date"
                    value={recurringStartDate}
                    onChange={(e) => setRecurringStartDate(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    When this charge began. Used to show payments count and total paid.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border text-foreground bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
