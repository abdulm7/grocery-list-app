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
    <div className="flex flex-col gap-3 md:max-h-[60vh] max-h-[55vh] overflow-y-auto border-2 rounded-sm p-2">
      {items.map((item) => (
        <GroceryItemCard key={item.id} item={item} onEdit={onEdit} />
      ))}
    </div>
  );
};
