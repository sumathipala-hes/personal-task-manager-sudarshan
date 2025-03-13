"use client";

import { useState } from "react";
import TaskDetailsDialog from "./TaskDetailsDialog";

interface TaskCardClientWrapperProps {
  children: React.ReactNode;
}

export default function TaskCardClientWrapper({
  children
}: TaskCardClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>{children}</div>
        <TaskDetailsDialog
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
    </>
  );
}
