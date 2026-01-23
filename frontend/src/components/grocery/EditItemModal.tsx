import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useUpdateItem, getFieldErrors } from "@/hooks/useGroceryQueries";
import type { GroceryItem, GroceryCategory } from "@/api/types";

type EditItemModalProps = {
  item: GroceryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: GroceryCategory[];
};

export const EditItemModal = ({
  item,
  open,
  onOpenChange,
  categories,
}: EditItemModalProps) => {
  const updateItemMutation = useUpdateItem();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GroceryCategory>("Other");
  const [quantity, setQuantity] = useState(1);

  const fieldErrors = getFieldErrors(updateItemMutation.error);
  const isSubmitting = updateItemMutation.isPending;

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity);
    }
  }, [item]);

  // Reset mutation state when modal opens
  useEffect(() => {
    if (open) {
      updateItemMutation.reset();
    }
  }, [open, updateItemMutation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    updateItemMutation.mutate(
      {
        id: item.id,
        data: {
          name: name.trim(),
          category,
          quantity: quantity ? Number(quantity) : 1,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setCategory("Other");
      setQuantity(1);
      updateItemMutation.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details of your grocery item.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-item-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Item Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk, Bread, Apples"
              disabled={isSubmitting}
              autoFocus
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as GroceryCategory)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.category && (
                <p className="text-sm text-destructive">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={isSubmitting}
              />
              {fieldErrors.quantity && (
                <p className="text-sm text-destructive">
                  {fieldErrors.quantity}
                </p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 ">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-item-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
