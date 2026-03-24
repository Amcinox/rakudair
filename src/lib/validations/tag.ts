import { z } from "zod/v4";

export const createTagSchema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    slug: z.string().min(1).max(80).optional(),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
