"use server";

import prisma from "@/lib/prisma";

export async function fetchCategories() {
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

    const categories = await prisma.category.findMany({
      where: {
        userId: "67d004ad23c24ad5d8359bc9",
      },
    });
    return {
      error: null,
      data: categories,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Error fetching categories",
      data: null,
    };
  }
}