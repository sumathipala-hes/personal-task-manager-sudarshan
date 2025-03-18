"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { MultiSelect } from "./MultiSelect";
import { priorityEnum, statusEnum } from "@/validators/taskValidator";
import { fetchCategories } from "@/app/actions/categoryActions";
import { Category } from "@/app/types";
import { createTask } from "@/app/actions/taskActions";
import { toast } from "sonner";
import { createTaskSchema, CreateTaskInput } from "@/validators/taskValidator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {},
  });

  const formValues = watch();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data, error } = await fetchCategories();

        if (error) {
          console.error(error);
        } else {
          setUserCategories(data as Category[]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    setValue(
      "categoryIds",
      selectedCategories.map((cat) => cat.id)
    );
  }, [selectedCategories, setValue]);

  const onSubmit = async (data: z.infer<typeof createTaskSchema>) => {
    try {
      const { error } = await createTask(data);

      if (error) {
        console.error(error);
        toast.error(error);
      } else {
        toast.success("Task created successfully");
        reset();
        setSelectedCategories([]);
        onOpenChange(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="Date"
                onChange={(e) => setValue("dueDate", new Date(e.target.value))}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formValues.priority}
                onValueChange={(value) =>
                  setValue("priority", value as priorityEnum)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formValues.status}
                onValueChange={(value) =>
                  setValue("status", value as statusEnum)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <MultiSelect
                options={userCategories}
                placeholder="Select categories"
                value={selectedCategories}
                onValueChange={setSelectedCategories}
              />
              {errors.categoryIds && (
                <p className="text-sm text-red-500">
                  {errors.categoryIds.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#ADB2D4] hover:bg-[#C7D9DD]">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
