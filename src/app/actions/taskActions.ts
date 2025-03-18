/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  taskFilterSchema,
  createtaskWithUserIdSchema,
  CreateTaskInput,
} from "@/validators/taskValidator";
import { auth } from "@clerk/nextjs/server";

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
    // const { userId } = await auth();
    // if (!userId) {
    //   throw new Error("User is not signed in");
    // }
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
    // if (!user) {
    //   throw new Error("User not found");
    // }
    const rawData =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    const result = taskFilterSchema.safeParse({
      ...rawData,
      userId: "67d004ad23c24ad5d8359bc9",
    });

    if (!result.success) {
      return {
        error: "Invalid input data",
        issues: result.error.issues,
        data: null,
      };
    }

    const { priority, status, dueDate, categoryId, skip, take } = result.data;

    const where: any = { userId: "67d004ad23c24ad5d8359bc9" };

    if (priority) {
      where.priority = priority;
    }

    if (status) {
      where.status = status;
    }

    if (dueDate) {
      const startDate = new Date(dueDate);
      const endDate = new Date(dueDate);
      endDate.setDate(endDate.getDate() + 1);

      where.dueDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      skip: skip || 0,
      take: take || 10,
    });

    const total = await prisma.task.count({
      where,
    });

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
    // const { userId } = await auth();
    // if (!userId) {
    //   throw new Error("User is not signed in");
    // }
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
    // if (!user) {
    //   throw new Error("User not found");
    // }

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
      userId: "67d004ad23c24ad5d8359bc9",
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

    const taskWithCategories = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        status,
        categories: {
          createMany: {
            data: (categoryIds || []).map((categoryId: string) => ({
              categoryId,
            })),
          },
        },
        taskLogs: {
          create: {
            action: "CREATED",
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

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
    // Delete associated records first
    await prisma.$transaction([
      prisma.taskCategory.deleteMany({
        where: { taskId: id },
      }),
      prisma.taskLog.deleteMany({
        where: { taskId: id },
      }),
      prisma.task.delete({
        where: { id },
      }),
    ]);

    // Revalidate the tasks page to reflect the deleted data
    revalidatePath("/tasks");

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function fetchTaskLogs(taskId: string) {
  try {
    const taskLogs = await prisma.taskLog.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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