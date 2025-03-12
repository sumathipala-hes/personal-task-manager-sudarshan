import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest, validateQueryParams } from "@/lib/validation";
import {
  createTaskSchema,
  taskFilterSchema,
} from "@/validators/taskValidator";

// Get tasks with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const validation = await validateQueryParams(
      searchParams,
      taskFilterSchema
    );

    if (!validation.success) {
      return validation.error;
    }

    const { userId, priority, status, dueDate, categoryId, skip, take } = validation.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: userId,
    };

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

    if (categoryId){
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
        skip,
        take,
        });

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
  const validation = await validateRequest(request, createTaskSchema);

  if (!validation.success) {
    return validation.error;
  }

  const { userId, title, description, dueDate, priority, categoryIds } =
    validation.data;

  try {
    const taskWithCategories = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        dueDate,
        priority,
        categories: {
          createMany: {
            data: (categoryIds ?? []).map((categoryId: string) => ({
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

    return NextResponse.json(taskWithCategories, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
