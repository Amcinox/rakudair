import { z } from "zod/v4";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    slug: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    icon: z.string().max(50).optional(),
    sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
