"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddTaskDialog from "./AddTaskDialog";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category } from "@/app/types";

interface TaskFilterProps {
  userCategories: Category[];
}

const TaskFilter = ({ userCategories }: TaskFilterProps) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("skip", "0");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Input
          type="date"
          placeholder="Due Date"
          className="w-full bg-white"
          value={searchParams.get("dueDate") as string}
          onChange={(e) => {
            updateQueryParams("dueDate", e.target.value);
          }}
        />
        <Select
          value={searchParams.get("priority") || "all"}
          onValueChange={(value) => {
            updateQueryParams("priority", value);
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) => {
            updateQueryParams("status", value);
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("categoryId") || "all"}
          onValueChange={(value) => {
            updateQueryParams("categoryId", value);
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {userCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsAddTaskOpen(true)}
          className="bg-[#ADB2D4] hover:bg-[#C7D9DD] text-white w-full h-[40px]"
        >
          Add New Task
        </Button>
      </div>
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        userCategories={userCategories}
      />
    </div>
  );
};

export default TaskFilter;
