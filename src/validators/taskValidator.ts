import { z } from "zod";
import { priority, status } from "@prisma/client";

const priorityEnum = z.enum([priority.LOW, priority.MEDIUM, priority.HIGH]);
const statusEnum = z.enum([
  status.PENDING,
  status.IN_PROGRESS,
  status.COMPLETED,
]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  priority: priorityEnum,
  categoryIds: z.array(z.string()).min(1, "Category is required"),
  status: statusEnum.optional().default(status.PENDING),
});

export const createtaskWithUserIdSchema = createTaskSchema.extend({
  userId: z.string().min(1, "User ID is required")
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const taskFilterSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  categoryId: z.string().optional(),
  skip: z.coerce.number().int().nonnegative().optional().default(0),
  take: z.coerce.number().int().positive().optional().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
export type priorityEnum = z.infer<typeof priorityEnum>;
export type statusEnum = z.infer<typeof statusEnum>;
