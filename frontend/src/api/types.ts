export type GroceryCategory = "Produce" | "Dairy" | "Meat" | "Pantry" | "Bakery" | "Other";

export interface GroceryItem {
  id: number;
  name: string;
  category: GroceryCategory;
  quantity: number;
  purchased: boolean;
}

export interface CreateGroceryItem {
  name: string;
  category?: GroceryCategory;
  quantity?: number;
}

export interface UpdateGroceryItem {
  name?: string;
  category?: GroceryCategory;
  quantity?: number;
  purchased?: boolean;
}

export interface ApiError {
  message: string;
}