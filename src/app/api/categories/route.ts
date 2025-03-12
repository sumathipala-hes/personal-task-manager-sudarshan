import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/validation";
import { createCategorySchema } from "@/validators/categoryValidator";
import { z } from "zod";

// Get all categories for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const schema = z.object({
      userId: z.string().min(1, "User ID is required"),
    });

    try {
      schema.parse({ userId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, createCategorySchema);

  if (!validation.success) {
    return validation.error;
  }

  const { userId, name } = validation.data;

  try {
    const category = await prisma.category.create({
      data: {
        userId: userId,
        name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
