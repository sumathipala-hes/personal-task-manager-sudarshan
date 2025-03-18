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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { priorityEnum, statusEnum } from "@/validators/taskValidator";
import { MultiSelect } from "@/components/MultiSelect";

interface TaskDetailsDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Task {
  id?: string;
  userId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: priorityEnum;
  status?: statusEnum;
  createdAt?: string;
  updatedAt?: string;
  categories?: {
    id: string;
    name: string;
  }[];
  taskLogs?: {
    id: string;
    taskId: string;
    action: string;
    createdAt: string;
  }[];
}

export default function TaskDetailsDialog({
  taskId,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [task, setTask] = useState<Task>(mockTask);

  const [editedTaskAttributes, setEditedTaskAttributes] = useState<Task>({});

  useEffect(() => {}, [taskId]);

  const handleSave = () => {
    setIsEditing(false);
    setTask({
      ...task,
      ...editedTaskAttributes,
    });
    console.log("Task saved", editedTaskAttributes);
    setEditedTaskAttributes({});
  };

  const handleCancel = () => {
    setEditedTaskAttributes({});
    setIsEditing(false);
  };

  // Function to get the current value of a field, respecting empty strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCurrentValue = (field: keyof Task, originalValue: any) => {
    return field in editedTaskAttributes
      ? editedTaskAttributes[field]
      : originalValue;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={getCurrentValue("title", task?.title)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedTaskAttributes({
                      ...editedTaskAttributes,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={getCurrentValue("description", task?.description)}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditedTaskAttributes({
                      ...editedTaskAttributes,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={getCurrentValue("dueDate", task?.dueDate)}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setEditedTaskAttributes({
                        ...editedTaskAttributes,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={getCurrentValue("priority", task?.priority)}
                    onValueChange={(value) => {
                      setEditedTaskAttributes({
                        ...editedTaskAttributes,
                        priority: value as priorityEnum,
                      });
                    }}
                    disabled={!isEditing}
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
                    value={getCurrentValue("status", task?.status)}
                    onValueChange={(value) => {
                      setEditedTaskAttributes({
                        ...editedTaskAttributes,
                        status: value as statusEnum,
                      });
                    }}
                    disabled={!isEditing}
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
                    options={mockCatergories}
                    placeholder="Select categories"
                    value={getCurrentValue("categories", task?.categories)}
                    onValueChange={(value) => {
                      setEditedTaskAttributes({
                        ...editedTaskAttributes,
                        categories: value,
                      });
                    }}
                    dissabled={!isEditing}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Task Logs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {task.taskLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <div className="space-x-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#ADB2D4] hover:bg-[#C7D9DD]"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-[#ADB2D4] hover:bg-[#C7D9DD]"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const mockTask: Task = {
  id: "1",
  userId: "user123",
  title: "Sample Task",
  description: "This is a sample task description.",
  dueDate: "2024-04-25",
  priority: "HIGH",
  status: "IN_PROGRESS",
  createdAt: "2024-04-20T10:00:00Z",
  updatedAt: "2024-04-20T12:00:00Z",
  categories: [
    { id: "1", name: "Work" },
    { id: "2", name: "Personal" },
  ],
  taskLogs: [
    {
      id: "log1",
      taskId: "1",
      action: "Task created",
      createdAt: "2024-04-20T10:00:00Z",
    },
    {
      id: "log2",
      taskId: "1",
      action: "Status updated to In Progress",
      createdAt: "2024-04-20T12:00:00Z",
    },
  ],
};

const mockCatergories = [
  { id: "1", name: "Work" },
  { id: "2", name: "Personal" },
  { id: "3", name: "Project" },
];
