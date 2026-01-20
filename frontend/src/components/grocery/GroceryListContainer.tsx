import { GroceryItemCard } from "@/components/grocery/GroceryItemCard";
import { EmptyListView } from "@/components/grocery/EmptyListView";
import type { GroceryItem } from "@/api/types";

type GroceryListContainerProps = {
  items: GroceryItem[];
  onEdit: (item: GroceryItem) => void;
};

export const GroceryListContainer = ({ items, onEdit }: GroceryListContainerProps) => {
  if (items.length <= 0) {
    return <EmptyListView />;
  }

  return (
    <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
      {items.map((item) => (
        <GroceryItemCard key={item.id} item={item} onEdit={onEdit} />
      ))}
    </div>
  );
};
