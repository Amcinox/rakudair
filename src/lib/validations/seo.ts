import { z } from "zod/v4";

export const upsertSeoSchema = z.object({
    entityType: z.enum(["article", "page", "global", "category"]),
    entityId: z.string().uuid().optional().nullable(),
    metaTitle: z.string().max(120).optional(),
    metaDescription: z.string().max(320).optional(),
    metaKeywords: z.array(z.string()).optional(),
    ogTitle: z.string().max(120).optional(),
    ogDescription: z.string().max(320).optional(),
    ogImage: z.string().url().optional().or(z.literal("")),
    ogType: z.string().max(30).optional(),
    twitterCard: z.enum(["summary", "summary_large_image"]).optional(),
    twitterTitle: z.string().max(120).optional(),
    twitterDescription: z.string().max(320).optional(),
    twitterImage: z.string().url().optional().or(z.literal("")),
    canonicalUrl: z.string().url().optional().or(z.literal("")),
    noIndex: z.boolean().default(false),
    noFollow: z.boolean().default(false),
    jsonLd: z.unknown().optional(),
});

export type UpsertSeoInput = z.infer<typeof upsertSeoSchema>;
