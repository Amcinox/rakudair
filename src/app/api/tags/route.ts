import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags, articleTags } from "@/lib/db/schema";
import { createTagSchema } from "@/lib/validations/tag";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { asc, eq, count, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

export const GET = apiRoute(async () => {
    const result = await db
        .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            createdAt: tags.createdAt,
            articleCount: count(articleTags.articleId),
        })
        .from(tags)
        .leftJoin(articleTags, eq(tags.id, articleTags.tagId))
        .groupBy(tags.id)
        .orderBy(asc(tags.name));

    return NextResponse.json({ data: result });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = createTagSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.name, "tag");

    const [tag] = await db
        .insert(tags)
        .values({ name: data.name, slug })
        .returning();

    return NextResponse.json({ data: tag }, { status: 201 });
});
