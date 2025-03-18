import { NextRequest, NextResponse } from "next/server";
import { ValidationUtils } from "@/utils/validation-utils";
import { updateTaskSchema, UpdateTaskInput } from "@/validators/taskValidator";
import { z } from "zod";
import TaskService from "@/services/taskService";

// Get a single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const schema = z.object({
      id: z.string().min(1, "Task ID is required"),
    });

    try {
      schema.parse({ id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
    }

    const task = await TaskService.getTaskById(id);

    if (!task) {
      console.error("Task not found");
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const idSchema = z.object({
    id: z.string().min(1, "Task ID is required"),
  });

  try {
    idSchema.parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
  }

  const validation = await ValidationUtils.validateRequest(request, updateTaskSchema);

  if (!validation.success) {
    return validation.error;
  }

  const { title, description, dueDate, priority, status, categoryIds } =
    validation.data;

  try {
    const currentTask = await TaskService.getTaskById(id);

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData: Partial<UpdateTaskInput> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate as Date;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    await TaskService.updateTask(id, updateData, categoryIds);

    const taskWithCategories = await TaskService.getTaskById(id);

    return NextResponse.json(taskWithCategories);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const schema = z.object({
      id: z.string().min(1, "Task ID is required"),
    });

    try {
      schema.parse({ id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
    }

    await TaskService.deleteTask(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
