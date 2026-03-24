import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, articleTags, seoMetadata } from "@/lib/db/schema";
import { updateArticleSchema } from "@/lib/validations/article";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export const GET = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const article = await db.query.articles.findFirst({
        where: eq(articles.id, id),
        with: {
            category: true,
            articleTags: {
                with: { tag: true },
            },
        },
    });

    if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Fetch SEO data
    const seo = await db.query.seoMetadata.findFirst({
        where: eq(seoMetadata.entityId, id),
    });

    return NextResponse.json({ data: { ...article, seo } });
});

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    await requireRole(["admin", "editor"]);
    const { id } = await params;

    const body = await request.json();
    const parsed = updateArticleSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    if (data.title && !data.slug) {
        data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const updateData: Record<string, unknown> = { ...data };

    // Calculate reading time if content updated
    if (data.contentHtml) {
        const wordCount = data.contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).length;
        updateData.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    // Handle publish date
    if (data.status === "published") {
        updateData.publishedAt = new Date();
    }

    if (data.scheduledAt) {
        updateData.scheduledAt = new Date(data.scheduledAt);
    }

    // Handle tags if provided
    if (body.tagIds) {
        // Clear existing tags
        await db.delete(articleTags).where(eq(articleTags.articleId, id));
        // Insert new tags
        if (body.tagIds.length > 0) {
            await db.insert(articleTags).values(
                body.tagIds.map((tagId: string) => ({ articleId: id, tagId }))
            );
        }
    }

    const [updated] = await db
        .update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
});

export const DELETE = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    await requireRole(["admin"]);
    const { id } = await params;

    // Delete SEO entry
    await db
        .delete(seoMetadata)
        .where(eq(seoMetadata.entityId, id));

    // Delete article tags
    await db.delete(articleTags).where(eq(articleTags.articleId, id));

    const [deleted] = await db
        .delete(articles)
        .where(eq(articles.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
