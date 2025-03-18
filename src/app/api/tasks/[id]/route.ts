import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ValidationUtils } from "@/utils/validation-utils";
import { updateTaskSchema } from "@/validators/taskValidator";
import { z } from "zod";

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

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        taskLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

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
    const currentTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    // Update task with transaction to handle categories
    await prisma.$transaction(async (tx) => {
      // Update the task
      const task = await tx.task.update({
        where: { id },
        data: updateData,
      });

      // Create task log entry
      await tx.taskLog.create({
        data: {
          taskId: task.id,
          action: "UPDATED",
        },
      });

      // Update categories if provided
      if (categoryIds) {
        // Delete existing category relationships
        await tx.taskCategory.deleteMany({
          where: { taskId: id },
        });

        // Create new category relationships
        if (categoryIds.length > 0) {
          const categoryConnections = categoryIds.map((categoryId: string) => ({
            taskId: id,
            categoryId: categoryId,
          }));

          await tx.taskCategory.createMany({
            data: categoryConnections,
          });
        }
      }

      return task;
    });

    // Fetch the complete updated task with categories
    const taskWithCategories = await prisma.task.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

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

    // Delete with transaction to handle related records
    await prisma.$transaction(async (tx) => {
      // Delete taskCategory relationships
      await tx.taskCategory.deleteMany({
        where: { taskId: id },
      });

      // Delete task logs
      await tx.taskLog.deleteMany({
        where: { taskId: id },
      });

      // Delete the task
      await tx.task.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
