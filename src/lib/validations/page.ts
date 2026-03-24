import { z } from "zod/v4";

export const createPageSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    slug: z.string().min(1).max(255).optional(),
    content: z.unknown().optional(),
    contentHtml: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    template: z.enum(["default", "full-width", "contact", "blank"]).default("default"),
    showInNav: z.boolean().default(false),
    navOrder: z.number().int().default(0),
    locale: z.enum(["en", "ja"]).default("en"),
});

export const updatePageSchema = createPageSchema.partial();

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
