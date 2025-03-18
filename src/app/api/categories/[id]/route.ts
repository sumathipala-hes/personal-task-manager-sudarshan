import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ValidationUtils } from "@/utils/validation-utils";
import { updateCategorySchema } from "@/validators/categoryValidator";
import CategoryService from "@/services/categoryService";

// Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const schema = z.object({
      id: z.string().min(1, "Category ID is required"),
    });

    try {
      schema.parse({ id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
    }

    const validation = await ValidationUtils.validateRequest(request, updateCategorySchema);

    if (!validation.success) {
      return validation.error;
    }

    const { name } = validation.data;

    const updatedCategory = await CategoryService.updateCategory(id, name);

    return NextResponse.json(updatedCategory); 
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const schema = z.object({
      id: z.string().min(1, "Category ID is required"),
    });

    try {
      schema.parse({ id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
    }

    const category = await CategoryService.deleteCategory(id);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
