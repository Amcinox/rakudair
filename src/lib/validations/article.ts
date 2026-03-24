import { z } from "zod/v4";

export const createArticleSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    slug: z.string().min(1).max(255).optional(),
    excerpt: z.string().max(500).optional(),
    content: z.unknown().optional(),
    contentHtml: z.string().optional(),
    coverImage: z.string().url().optional().or(z.literal("")),
    status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
    publishedAt: z.string().datetime().optional().nullable(),
    scheduledAt: z.string().datetime().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    isFeatured: z.boolean().default(false),
    locale: z.enum(["en", "ja"]).default("en"),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
