import { useState } from "react";
import { toast } from "sonner";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import {
  useDeleteAllItems,
  useToggleAllPurchased,
} from "@/hooks/useGroceryQueries";

export const ActionBar = () => {
  const deleteAllMutation = useDeleteAllItems();
  const toggleAllPurchasedMutation = useToggleAllPurchased();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearList = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    deleteAllMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(`Deleted ${data.deleted} item${data.deleted !== 1 ? "s" : ""}`);
      },
    });
  };

  const handleMarkAllPurchased = () => {
    toggleAllPurchasedMutation.mutate(true, {
      onSuccess: (data) => {
        toast.success(`Marked ${data.updated} item${data.updated !== 1 ? "s" : ""} as purchased`);
      },
    });
  };

  const handleMarkAllNotPurchased = () => {
    toggleAllPurchasedMutation.mutate(false, {
      onSuccess: (data) => {
        toast.success(`Marked ${data.updated} item${data.updated !== 1 ? "s" : ""} as not purchased`);
      },
    });
  };

  const isLoading =
    deleteAllMutation.isPending || toggleAllPurchasedMutation.isPending;

  return (
    <div className="md:justify-end md:flex">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={handleMarkAllPurchased}
          disabled={isLoading}
          className="flex-1 md:flex-none"
          title="Mark All as Purchased"
        >
          <CheckSquare className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Mark All as Purchased</span>
          <span className="inline md:hidden">Purchased</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleMarkAllNotPurchased}
          disabled={isLoading}
          className="flex-1 md:flex-none"
          title="Mark All as Not Purchased"
        >
          <Square className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Mark All as Not Purchased</span>
          <span className="inline md:hidden">Not Purchased</span>
        </Button>
        <Button
          variant="destructive"
          onClick={handleClearList}
          disabled={isLoading}
          className="flex-1 md:flex-none"
          title="Clear List"
        >
          <Trash2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Clear List</span>
          <span className="inline md:hidden">Clear</span>
        </Button>
      </div>

      <ConfirmationModal
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear List"
        description="Are you sure you want to delete all items? This action cannot be undone."
        confirmText="Delete All"
        variant="destructive"
        onConfirm={handleConfirmClear}
        isLoading={deleteAllMutation.isPending}
      />
    </div>
  );
};