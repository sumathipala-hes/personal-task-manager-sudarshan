"use client";

import React from "react";
import { useState } from "react";
import TaskDetailsDialog from "./TaskDetailsDialog";
import TaskCardClientWrapper from "./TaskCardClientWrapper";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  categories: string[];
}

interface TaskListClientWrapperProps {
  children: React.ReactNode[];
  tasks: Task[];
}

export default function TaskListClientWrapper({
  children,
  tasks,
}: TaskListClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (index < tasks.length) {
          return (
            <TaskCardClientWrapper
              key={tasks[index].id}
              onTaskClick={() => handleTaskClick(tasks[index].id)}
            >
              {child}
            </TaskCardClientWrapper>
          );
        }
        return null;
      })}

      {isModalOpen && selectedTaskId && (
        <TaskDetailsDialog
          taskId={selectedTaskId}
          open={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
