import { useState } from "react";
import { Plus } from "lucide-react";
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
import { useAddItem, getFieldErrors } from "@/hooks/useGroceryQueries";
import type { CreateGroceryItem, GroceryCategory } from "@/api/types";
import { FormCategories } from "@/constants/constants";

export const AddItemForm = () => {
  const addItemMutation = useAddItem();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GroceryCategory>("Other");
  const [quantity, setQuantity] = useState(1);

  const fieldErrors = getFieldErrors(addItemMutation.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateGroceryItem = {
      name: name.trim(),
      category,
      quantity: quantity ? Number(quantity) : 1,
    };

    addItemMutation.mutate(data, {
      onSuccess: () => {
        setName("");
        setQuantity(1);
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Split into two sections for mobile view */}
        <div className="flex gap-3 flex-1">
          <div className="flex-1 space-y-1">
            <Label htmlFor="add-item-name">Item name</Label>
            <Input
              id="add-item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Eggs"
              className="flex-1"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="add-item-qty">Quantity</Label>
            <Input
              id="add-item-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="e.g., 2"
              className="w-24"
            />
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="add-item-category">Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as GroceryCategory)}
            >
              <SelectTrigger id="add-item-category" className="w-full md:w-40">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FormCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="flex-1 md:flex-none bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </form>

      {fieldErrors.name && (
        <p className="text-sm text-destructive">{fieldErrors.name}</p>
      )}
    </div>
  );
};
