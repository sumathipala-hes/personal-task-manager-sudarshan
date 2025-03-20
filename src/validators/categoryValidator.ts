import { z } from "zod";

export const createCategorySchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  name: z.string().min(1, "Category name is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type updateCategoryInput = z.infer<typeof updateCategorySchema>;
