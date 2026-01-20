import { Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTogglePurchased, useDeleteItem } from "@/hooks/useGroceryQueries";
import type { GroceryItem } from "@/api/types";

type GroceryItemCardProps = {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
};

export const GroceryItemCard = ({ item, onEdit }: GroceryItemCardProps) => {
  const togglePurchasedMutation = useTogglePurchased();
  const deleteItemMutation = useDeleteItem();

  const handleTogglePurchased = () => {
    togglePurchasedMutation.mutate(item.id);
  };

  const handleDelete = () => {
    deleteItemMutation.mutate(item.id);
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border bg-card`}>
      <Checkbox
        className={`h-5 w-5`}
        checked={item.purchased}
        onCheckedChange={handleTogglePurchased}
        aria-label={`Mark ${item.name} as ${item.purchased ? "unpurchased" : "purchased"}`}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${item.purchased ? "line-through opacity-60" : ""}`}
        >
          {item.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.quantity} - {item.category}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(item)}
          disabled={item.purchased}
          aria-label={`Edit ${item.name}`}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
