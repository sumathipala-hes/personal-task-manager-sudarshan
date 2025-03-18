import { NextRequest, NextResponse } from "next/server";
import { ValidationUtils } from "@/utils/validation-utils";
import { createUserSchema } from "@/validators/userValidator";
import UserService from "@/services/userService";

export async function POST(request: NextRequest) {
  const validation = await ValidationUtils.validateRequest(request, createUserSchema);

  if (!validation.success) {
    return validation.error;
  }

  const { clerkId } = validation.data;

  try {
    // Check if user already exists
    const existingUser = await UserService.getUserByClerkId(clerkId);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const user = await UserService.createUser(clerkId);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
