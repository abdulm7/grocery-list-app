import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Split into two sections for mobile view */}
        <div className="flex gap-3 flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="flex-1"
            required
          />
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Qty"
            className="w-20"
          />
        </div>

        <div className="flex gap-3">
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as GroceryCategory)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FormCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
