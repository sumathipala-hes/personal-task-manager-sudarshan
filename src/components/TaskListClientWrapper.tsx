"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import TaskDetailsDialog from "./TaskDetailsDialog";
import { TaskData } from "@/app/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TaskListClientWrapperProps {
  children: React.ReactNode;
  tasks: TaskData[];
  total: number;
  error?: string;
}

export default function TaskListClientWrapper({
  children,
  tasks,
  total,
  error,
}: TaskListClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [skip, setSkip] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTaskClick = (task: TaskData) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      console.error("Error fetching tasks:", error);
    }
  }, [error]);

  useEffect(() => {
    if (tasks && tasks.length === 0) {
      toast.info("No tasks found");
    }
  }, [tasks]);

  const handleLoadMore = () => {
    setSkip((prev) => prev + 10);
  };

  const handleLoadPrev = () => {
    setSkip((prev) => Math.max(0, prev - 10));
  };

  useEffect(() => {
    setSkip(0);
  }, [
    searchParams.get("dueDate"),
    searchParams.get("priority"),
    searchParams.get("status"),
    searchParams.get("categoryId"),
  ]);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("skip", skip.toString());
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  }, [skip, searchParams, pathname, router]);

  return (
    <>
      {tasks && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {React.Children.map(children, (child, index) => {
              if (index < tasks.length) {
                return (
                  <div
                    key={tasks[index].id}
                    onClick={() => handleTaskClick(tasks[index])}
                  >
                    {child}
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="flex justify-center mt-8 gap-4 ">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-8 h-8 p-0"
              onClick={handleLoadPrev}
              disabled={skip === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="text-lg">
              {skip + 1} to {skip + tasks.length} of {total}
            </span>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-8 h-8 p-0"
              onClick={handleLoadMore}
              disabled={skip + tasks.length >= total}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}

      {isModalOpen && selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          open={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
