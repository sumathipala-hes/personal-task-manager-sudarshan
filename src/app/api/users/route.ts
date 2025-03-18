import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/validation";
import { createUserSchema } from "@/validators/userValidator";

export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, createUserSchema);

  if (!validation.success) {
    return validation.error;
  }

  const { clerkId } = validation.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        clerkId: clerkId,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
