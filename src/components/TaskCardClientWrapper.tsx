"use client";

interface TaskCardClientWrapperProps {
  children: React.ReactNode;
  onTaskClick: () => void;
}

export default function TaskCardClientWrapper({
  children,
  onTaskClick,
}: TaskCardClientWrapperProps) {
  return (
    <>
      <div
        onClick={() => {
          onTaskClick();
        }}
      >
        {children}
      </div>
    </>
  );
}
