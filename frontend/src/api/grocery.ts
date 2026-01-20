import { request } from "@/api/client";
import type {
  GroceryItem,
  CreateGroceryItem,
  UpdateGroceryItem,
} from "@/api/types";
import { API_ENDPOINT_BASE } from "@/constants/constants";

export const getItems = (): Promise<GroceryItem[]> => {
  return request<GroceryItem[]>(`${API_ENDPOINT_BASE}/`);
};

export const addItem = (data: CreateGroceryItem): Promise<GroceryItem> => {
  return request<GroceryItem>(`${API_ENDPOINT_BASE}/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateItem = (
  id: number,
  data: UpdateGroceryItem,
): Promise<GroceryItem> => {
  return request<GroceryItem>(`${API_ENDPOINT_BASE}/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteItem = (id: number): Promise<void> => {
  return request<void>(`${API_ENDPOINT_BASE}/${id}/`, {
    method: "DELETE",
  });
};

export const deleteAll = (): Promise<{ deleted: number }> => {
  return request<{ deleted: number }>(`${API_ENDPOINT_BASE}/`, {
    method: "DELETE",
  });
};

export const bulkUpdatePurchased = (
  purchased: boolean,
): Promise<{ updated: number }> => {
  return request<{ updated: number }>(
    `${API_ENDPOINT_BASE}/update-purchased/`,
    {
      method: "PATCH",
      body: JSON.stringify({ purchased }),
    },
  );
};
