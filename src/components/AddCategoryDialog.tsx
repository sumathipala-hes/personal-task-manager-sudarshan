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

export default function AddCategoryDialog() {
  const [open, onOpenChange] = useState(false);

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
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="Enter category name" />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-[#ADB2D4] hover:bg-[#C7D9DD]">
              Create Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
