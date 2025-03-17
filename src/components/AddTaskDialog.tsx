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
import { Category, CreateTaskInput } from "@/app/types";
import { createTask } from "@/app/actions/taskActions";

export default function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [task, setTask] = useState<CreateTaskInput>({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "PENDING",
    categories: [],
  });
  const [userCategories, setUserCategories] = useState<Category[]>([]);

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


  const handleCreateTask = async () => {
    console.log(task);
    const { categories,dueDate, ...rest } = task;
    const categoryIds = categories?.map((category) => category.id) || [];
    try {
      const { data, error } = await createTask({ categoryIds,dueDate:new Date(dueDate), ...rest });
      if (error) {
        console.error(error);
      } else {
        console.log(data);
        onOpenChange(false);
        setTask({
          title: "",
          description: "",
          dueDate: "",
          priority: "LOW",
          status: "PENDING",
          categories: [],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              id="title"
              placeholder="Enter task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              value={task.description}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                id="dueDate"
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(value) =>
                  setTask({ ...task, priority: value as priorityEnum })
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  setTask({ ...task, status: value as statusEnum })
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <MultiSelect
                options={userCategories}
                placeholder="Select categories"
                value={task.categories || []}
                onValueChange={(value) =>
                  setTask({ ...task, categories: value })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#ADB2D4] hover:bg-[#C7D9DD]"
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
