import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRequestError } from "@/api/client";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  deleteAll,
  bulkUpdatePurchased,
} from "@/api/grocery";
import type {
  GroceryItem,
  CreateGroceryItem,
  UpdateGroceryItem,
} from "@/api/types";

// Query keys
export const groceryKeys = {
  all: ["grocery-items"] as const,
};

// Fetch grocery items
export const useGroceryItems = () => {
  return useQuery({
    queryKey: groceryKeys.all,
    queryFn: getItems,
    select: (data) =>
      [...data].sort((a, b) => {
        // Sort by purchased (false first)
        if (a.purchased !== b.purchased) {
          return a.purchased ? 1 : -1;
        }
        // Then sort by category alphabetically
        return a.category.localeCompare(b.category);
      }),
  });
};

// Add item mutation
export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroceryItem) => addItem(data),
    onSuccess: (newItem) => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, (old = []) => [
        newItem,
        ...old,
      ]);
    },
  });
};

// Update item mutation
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGroceryItem }) =>
      updateItem(id, data),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, (old = []) =>
        old.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
    },
  });
};

// Delete item mutation
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, (old = []) =>
        old.filter((item) => item.id !== id),
      );
    },
  });
};

// Toggle purchased mutation
export const useTogglePurchased = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const items = queryClient.getQueryData<GroceryItem[]>(groceryKeys.all);
      const item = items?.find((i) => i.id === id);
      if (!item) throw new Error("Item not found");

      const newPurchasedState = !item.purchased;
      await updateItem(id, { purchased: newPurchasedState });
      return { id, purchased: newPurchasedState };
    },
    onSuccess: ({ id, purchased }) => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, (old = []) =>
        old.map((item) => (item.id === id ? { ...item, purchased } : item)),
      );
    },
  });
};

// Delete all items mutation
export const useDeleteAllItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAll(),
    onSuccess: () => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, []);
    },
  });
};

// Toggle all purchased mutation
export const useToggleAllPurchased = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchased: boolean) => bulkUpdatePurchased(purchased),
    onSuccess: (_data, purchased) => {
      queryClient.setQueryData<GroceryItem[]>(groceryKeys.all, (old = []) =>
        old.map((item) => ({ ...item, purchased })),
      );
    },
  });
};

// Helper to extract field errors from ApiRequestError
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (error instanceof ApiRequestError) {
    return error.fieldErrors;
  }
  return {};
};

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
