import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { AddItemForm } from "@/components/grocery/AddItemForm";
import { GroceryListContainer } from "@/components/grocery/GroceryListContainer";
import { EditItemModal } from "@/components/grocery/EditItemModal";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { useGroceryItems, getErrorMessage } from "@/hooks/useGroceryQueries";
import type { GroceryItem, GroceryCategory } from "@/api/types";
import "@/styles/App.css";
import { ActionBar } from "./components/grocery/ActionBar";

const CATEGORIES: GroceryCategory[] = [
  "Produce",
  "Dairy",
  "Meat",
  "Pantry",
  "Bakery",
  "Other",
];

const App = () => {
  const { data: items = [], isLoading, error, isError } = useGroceryItems();
  // TO DO: implement category dropdwn filter
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);

  if (error && errorDismissed) {
    setErrorDismissed(false);
  }

  const handleEdit = (item: GroceryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingItem(null);
    }
  };

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const purchasedCount = items.filter((item) => item.purchased).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header purchasedCount={0} totalCount={0} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header purchasedCount={purchasedCount} totalCount={items.length} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {error && !errorDismissed && (
          <ErrorAlert error={getErrorMessage(error)} />
        )}
        <AddItemForm />
        <ActionBar />
        <GroceryListContainer items={filteredItems} onEdit={handleEdit} />

        <EditItemModal
          item={editingItem}
          open={isEditModalOpen}
          onOpenChange={handleEditModalClose}
          categories={CATEGORIES}
        />
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
