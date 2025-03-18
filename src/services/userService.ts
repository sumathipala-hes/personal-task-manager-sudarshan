import prisma from "@/lib/prisma";

export default class UserService {
  public static async getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId: clerkId },
    });
  }

  public static async createUser(clerkId: string) {
    return await prisma.user.create({
      data: {
        clerkId: clerkId,
      },
    });
  }
}
