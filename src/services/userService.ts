import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

  public static async getCurrUser() {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User is not signed in");
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
