import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorProfiles } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const profileSchema = z.object({
    displayName: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    bio: z.string().max(2000).optional().nullable(),
    avatar: z.string().max(2000).optional().nullable(),
    role: z.string().max(100).optional().nullable(),
    location: z.string().max(255).optional().nullable(),
    website: z.string().max(500).optional().nullable(),
    socialTwitter: z.string().max(500).optional().nullable(),
    socialInstagram: z.string().max(500).optional().nullable(),
    socialYoutube: z.string().max(500).optional().nullable(),
    socialFacebook: z.string().max(500).optional().nullable(),
    socialTiktok: z.string().max(500).optional().nullable(),
    socialGithub: z.string().max(500).optional().nullable(),
});

/** GET /api/profile — returns current user's profile */
export const GET = apiRoute(async () => {
    const userId = await requireAuth();

    const [profile] = await db
        .select()
        .from(authorProfiles)
        .where(eq(authorProfiles.clerkId, userId))
        .limit(1);

    return NextResponse.json({ data: profile ?? null });
});

/** POST /api/profile — create or update current user's profile */
export const POST = apiRoute(async (request: NextRequest) => {
    const userId = await requireAuth();
    const body = await request.json();
    const parsed = profileSchema.parse(body);

    const [existing] = await db
        .select({ id: authorProfiles.id })
        .from(authorProfiles)
        .where(eq(authorProfiles.clerkId, userId))
        .limit(1);

    if (existing) {
        const [updated] = await db
            .update(authorProfiles)
            .set(parsed)
            .where(eq(authorProfiles.clerkId, userId))
            .returning();
        return NextResponse.json({ data: updated });
    }

    const [created] = await db
        .insert(authorProfiles)
        .values({ ...parsed, clerkId: userId })
        .returning();

    return NextResponse.json({ data: created }, { status: 201 });
});
