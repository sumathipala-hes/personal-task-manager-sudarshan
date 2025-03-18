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
import { fetchTaskLogs } from "@/app/actions/taskActions";
import { TaskData, Category, TaskLog } from "@/app/types";
import { fetchCategories } from "@/app/actions/categoryActions";
import { formatDateForInput } from "@/lib/utils";

interface TaskDetailsDialogProps {
  task: TaskData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [originalTask, setOriginalTask] = useState<TaskData>(task);
  const [editedTaskAttributes, setEditedTaskAttributes] = useState<
    Partial<TaskData>
  >({});
  const [editedCategories, setEditedCategories] = useState<Category[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);

  // fetch the categories related to the user
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
    const getTaskLogs = async () => {
      try {
        const { data, error } = await fetchTaskLogs(task.id);
        if(!error){
          setTaskLogs(data as TaskLog[]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getTaskLogs();

  }, [task.id]);

  const handleSave = () => {
    setIsEditing(false);
    setOriginalTask({
      ...originalTask,
      ...editedTaskAttributes,
    });
    console.log("Task saved", editedTaskAttributes);
    setEditedTaskAttributes({});
  };

  const handleCancel = () => {
    setEditedTaskAttributes({});
    setEditedCategories([]);
    setIsEditing(false);
  };

  // Function to get the current value of a field, respecting empty strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCurrentValue = (field: keyof TaskData, originalValue: any) => {
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
                  value={getCurrentValue("title", originalTask?.title)}
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
                  value={getCurrentValue("description", originalTask?.description)}
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
                    value={formatDateForInput(
                      getCurrentValue("dueDate", originalTask.dueDate) as Date
                    )}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setEditedTaskAttributes({
                        ...editedTaskAttributes,
                        dueDate: e.target.value? new Date(e.target.value): new Date(),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={getCurrentValue("priority", originalTask?.priority)}
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
                    value={getCurrentValue("status", originalTask?.status)}
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
                    options={userCategories}
                    placeholder="Select categories"
                    value={
                      editedCategories.length > 0
                        ? editedCategories
                        : originalTask.categories.map((c) => c.category)
                    }
                    onValueChange={setEditedCategories}
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
                    {taskLogs?.map((log) => (
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
