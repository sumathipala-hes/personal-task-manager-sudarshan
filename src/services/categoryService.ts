import prisma from "@/lib/prisma";
import UserService from "./userService";

export default class CategoryService extends UserService {
  public static async getCategoriesByUserId(userId: string) {
    return await prisma.category.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public static async createCategory(userId: string, name: string) {
    return prisma.category.create({
      data: {
        userId,
        name,
      },
    });
  }

  public static async updateCategory(id: string, name: string) {
    return prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  public static async deleteCategory(id: string) {
    await prisma.$transaction(async (tx) => {
      await tx.taskCategory.deleteMany({
        where: {
          categoryId: id,
        },
      });

      await tx.category.delete({
        where: {
          id,
        },
      });
    });
  }
}
