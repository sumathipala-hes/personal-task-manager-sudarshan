"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addCategory } from "@/app/actions/categoryActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createCategorySchema,
  CreateCategoryInput,
} from "@/validators/categoryValidator";
import { toast } from "sonner";

export default function AddCategoryDialog() {
  const [open, onOpenChange] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateCategory = async (data: CreateCategoryInput) => {
    setCreating(true);
    const { name } = data;
    try {
      const { category_error } = await addCategory(name);
      if (category_error) {
        console.error(category_error);
        toast.error(category_error);
        setCreating(false);
        return;
      }
      onOpenChange(false);
      reset();
      toast.success("Category created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error creating category");
    }
    setCreating(false);
  };

  return (
    <>
      <div className="mb-6 flex justify-end px-4 md:px-0">
        <Button
          onClick={() => onOpenChange(true)}
          className="bg-[#ADB2D4] hover:bg-[#C7D9DD] text-white"
        >
          Add New Category
        </Button>
      </div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateCategory)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#ADB2D4] hover:bg-[#C7D9DD]"
                type="submit"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
