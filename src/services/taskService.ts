import prisma from "@/lib/prisma";
import {
  priorityEnum,
  statusEnum,
  UpdateTaskInput,
} from "@/validators/taskValidator";
import UserService from "./userService";

export default class TaskService extends UserService {
  public static async getTasksWithFilters(
    userId: string,
    priority?: priorityEnum,
    status?: statusEnum,
    dueDate?: string | Date,
    categoryId?: string,
    skip?: number,
    take?: number
  ) {
    const where: {
      userId: string;
      priority?: priorityEnum;
      status?: statusEnum;
      dueDate?: { gte: Date; lte: Date };
      categories?: { some: { categoryId: string } };
    } = {
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
      skip,
      take,
    });

    const total = await prisma.task.count({
      where,
    });

    return { tasks, total };
  }

  public static async getTaskById(id: string) {
    return prisma.task.findUnique({
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
  }

  public static async createTask(
    userId: string,
    title: string,
    dueDate: Date | string,
    priority: priorityEnum,
    categoryIds: string[],
    status: statusEnum,
    description?: string
  ) {
    return prisma.task.create({
      data: {
        userId,
        title,
        description,
        dueDate,
        priority,
        status,
        categories: {
          createMany: {
            data: categoryIds?.map((categoryId: string) => ({
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
  }

  public static async updateTask(
    id: string,
    updateData: Partial<UpdateTaskInput>,
    categoryIds?: string[]
  ) {
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
  }

  public static async deleteTask(id: string) {
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
  }

  public static async getTaskCount(userId: string) {
    return prisma.task.count({
      where: {
        userId,
      },
    });
  }

  public static async getTaskLogs(taskId: string) {
    return prisma.taskLog.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
