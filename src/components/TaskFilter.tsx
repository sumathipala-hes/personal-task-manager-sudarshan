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
import {TaskFilterInput} from "@/validators/taskValidator";
import { priorityEnum, statusEnum } from "@/validators/taskValidator";

const MockCategories= [{
    id: "work",
    name: "Work",
    },
    {
    id: "personal",
    name: "Personal",
    },
    {
    id: "project",
    name: "Project",
}]

const TaskFilter = () => {
  const [taskFilterValues, setTaskFilterValues] = useState<TaskFilterInput>({
    userId: "",
    skip: 0,
    take: 12
  });

  return (
    <div className="flex flex-col gap-4 mb-6 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Input type="date" placeholder="Due Date" className="w-full bg-white" />
        <Select
          value={taskFilterValues.priority}
          onValueChange={(value) => {
            setTaskFilterValues({
              ...taskFilterValues,
              priority: value === "all" ? undefined : (value as priorityEnum),
            });
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
          value={taskFilterValues.status}
          onValueChange={(value) => {
            setTaskFilterValues({
              ...taskFilterValues,
              status: value === "all" ? undefined : (value as statusEnum),
            });
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
        <Select value={taskFilterValues.categoryId} onValueChange={(value)=>{
            setTaskFilterValues({
                ...taskFilterValues,
                categoryId: value === "all" ? undefined: value as string
            })
        }}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {MockCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {}}
          className="bg-[#ADB2D4] hover:bg-[#C7D9DD] text-white w-full h-[40px]"
        >
          Add New Task
        </Button>
      </div>
    </div>
  );
};

export default TaskFilter;
