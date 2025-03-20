import { NextRequest, NextResponse } from "next/server";
import { ValidationUtils } from "@/utils/validation-utils";
import {
  createtaskWithUserIdSchema,
  taskFilterSchema,
} from "@/validators/taskValidator";
import TaskService from "@/services/taskService";

// Get tasks with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const validation = await ValidationUtils.validateQueryParams(searchParams, taskFilterSchema);

    if (!validation.success) {
      return validation.error;
    }

    const { userId, priority, status, dueDate, categoryId, skip, take } =
      validation.data;

    const tasks = await TaskService.getTasksWithFilters(
      userId,
      priority,
      status,
      dueDate,
      categoryId,
      skip,
      take
    );

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// Create a new task with categories and create a task log entry for the creation
export async function POST(request: NextRequest) {
  const validation = await ValidationUtils.validateRequest(
    request,
    createtaskWithUserIdSchema
  );

  if (!validation.success) {
    return validation.error;
  }

  const { userId, title, description, dueDate, priority, categoryIds, status } =
    validation.data;

  try {
    const taskWithCategories = await TaskService.createTask(
      userId,
      title,
      dueDate,
      priority,
      categoryIds,
      status,
      description,
    )
    
    return NextResponse.json(taskWithCategories, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
