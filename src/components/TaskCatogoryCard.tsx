"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  updateCategorySchema,
  updateCategoryInput,
} from "@/validators/categoryValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateCategory } from "@/app/actions/categoryActions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCategory } from "@/app/actions/categoryActions";

interface TaskCatogoryCardProps {
  id: string;
  name: string;
  createdAt: Date;
}
const TaskCatogoryCard = (props: TaskCatogoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: props.name,
    },
  });

  const formValues = watch();

  const handleSave = async (data: updateCategoryInput) => {
    setUpdating(true);
    const { category_error } = await updateCategory(props.id, data.name);
    if (category_error) {
      toast.error(category_error);
      console.error(category_error);
      setUpdating(false);
      return;
    }
    toast.success("Category updated successfully");
    setIsEditing(false);
    setUpdating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleDelete = async () => {
    const { category_error } = await deleteCategory(props.id);
    if (category_error) {
      toast.error(category_error);
      console.error(category_error);
      return;
    }
    toast.success("Category deleted successfully");
    setIsDeleteDialogOpen(false);
  };
  return (
    <>
      <Card className="bg-[#D5E5D5]">
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <form onSubmit={handleSubmit(handleSave)}>
                <input
                  type="text"
                  value={formValues.name}
                  {...register("name")}
                  className="w-full px-3 py-1 border rounded bg-white"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#ADB2D4] hover:bg-[#C7D9DD]"
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{props.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{`Created: ${new Date(
                    props.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {setIsDeleteDialogOpen(true)}}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category. Tasks that are categorized under this category will be uncategorized from this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCatogoryCard;
