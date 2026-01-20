import { ShoppingCart } from "lucide-react";

export const EmptyListView = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No items yet</h2>
      <p className="text-muted-foreground">
        Add your first grocery item to get started
      </p>
    </div>
  );
};
