import { z } from "zod";

export const createUserSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
