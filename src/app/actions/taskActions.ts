/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import {
  taskFilterSchema,
  createtaskWithUserIdSchema,
  CreateTaskInput,
  updateTaskSchema,
  UpdateTaskInput,
} from "@/validators/taskValidator";
import TaskService from "@/services/taskService";

export async function fetchTasks(
  formData:
    | FormData
    | {
        priority: string;
        status: string;
        dueDate: string;
        categoryId: string;
        skip: number;
        take: number;
      }
) {
  try {
    const user = await TaskService.getCurrUser();
    const rawData =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    const result = taskFilterSchema.safeParse({
      ...rawData,
      userId: user.id,
    });

    if (!result.success) {
      return {
        error: "Invalid input data",
        issues: result.error.issues,
        data: null,
      };
    }

    const { priority, status, dueDate, categoryId, skip, take, userId } = result.data;

    const { tasks, total } = await TaskService.getTasksWithFilters(
      userId,
      priority,
      status,
      dueDate,
      categoryId,
      skip,
      take
    );

    return {
      data: tasks,
      total,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      error: "Failed to fetch tasks",
      data: null,
    };
  }
}

export async function createTask(
  formData:
    | FormData
    | CreateTaskInput
) {
  try {
    const user = await TaskService.getCurrUser();

    const rawData =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    if (typeof rawData.categoryIds === "string") {
      try {
        rawData.categoryIds = JSON.parse(rawData.categoryIds);
      } catch {
        rawData.categoryIds = rawData.categoryIds;
      }
    }

    const result = createtaskWithUserIdSchema.safeParse({
      ...rawData,
      userId: user.id,
    });

    if (!result.success) {
      return {
        error: "Invalid input data",
        issues: result.error.issues,
        data: null,
      };
    }

    const {
      userId,
      title,
      description,
      dueDate,
      priority,
      categoryIds,
      status,
    } = result.data;

    const taskWithCategories = await TaskService.createTask(
      userId,
      title,
      dueDate,
      priority,
      categoryIds,
      status,
      description,
    );

    revalidatePath("/tasks");

    return {
      data: taskWithCategories,
      error: null,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      error: "Failed to create task",
      data: null,
    };
  }
}

export async function deleteTask(id: string) {
  try {
    await TaskService.deleteTask(id);
    revalidatePath("/tasks");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function fetchTaskLogs(taskId: string) {
  try {
    const taskLogs = await TaskService.getTaskLogs(taskId);
    return {
      data: taskLogs,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching task logs:", error);
    return {
      error: "Failed to fetch task logs",
      data: null,
    };
  }
}

export async function updateTasK(id: string, updatedTaskData: UpdateTaskInput){
  try {

    const result = updateTaskSchema.safeParse(updatedTaskData)

    if (!result.success){
      return {
        error: "Invalid input data",
        issues: result.error.issues,
        data: null,
      }
    }

    const {categoryIds, ...rest} = result.data

    const updatedTask =  await TaskService.updateTask(id, rest, categoryIds);
  
    revalidatePath("/tasks");
    return{
      data: updatedTask,
      error: null,
    }
  }catch (error){
    console.error("Error updating task:", error);
    return {
      error: "Failed to update task",
      data: null,
    };
  }
}