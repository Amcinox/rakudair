export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, categories, seoMetadata } from "@/lib/db/schema";
import { createArticleSchema } from "@/lib/validations/article";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, asc, eq, ilike, count, and, SQL } from "drizzle-orm";
import slugify from "slugify";

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const status = searchParams.get("status");
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "newest";
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(articles.status, status as "draft" | "published" | "scheduled" | "archived"));
    if (categoryId) conditions.push(eq(articles.categoryId, categoryId));
    if (search) conditions.push(ilike(articles.title, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
        sort === "oldest"
            ? asc(articles.createdAt)
            : sort === "title"
                ? asc(articles.title)
                : desc(articles.createdAt);

    const [items, [total]] = await Promise.all([
        db
            .select({
                id: articles.id,
                title: articles.title,
                slug: articles.slug,
                excerpt: articles.excerpt,
                coverImage: articles.coverImage,
                status: articles.status,
                publishedAt: articles.publishedAt,
                categoryId: articles.categoryId,
                categoryName: categories.name,
                isFeatured: articles.isFeatured,
                locale: articles.locale,
                readingTime: articles.readingTime,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt,
            })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .where(where)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(articles).where(where),
    ]);

    return NextResponse.json({ data: items, total: total.count, page, limit });
});

export const POST = apiRoute(async (request: NextRequest) => {
    const { userId } = await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    const slug =
        data.slug || slugify(data.title, { lower: true, strict: true });

    const wordCount = data.contentHtml
        ? data.contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).length
        : 0;

    const [article] = await db
        .insert(articles)
        .values({
            title: data.title,
            slug,
            excerpt: data.excerpt,
            content: data.content,
            contentHtml: data.contentHtml,
            coverImage: data.coverImage || null,
            status: data.status,
            publishedAt:
                data.status === "published" ? new Date() : data.publishedAt ? new Date(data.publishedAt) : null,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            authorId: userId,
            categoryId: data.categoryId || null,
            readingTime: Math.max(1, Math.ceil(wordCount / 200)),
            isFeatured: data.isFeatured,
            locale: data.locale,
        })
        .returning();

    // Auto-create SEO entry
    await db.insert(seoMetadata).values({
        entityType: "article",
        entityId: article.id,
        metaTitle: data.title.slice(0, 120),
        metaDescription: data.excerpt?.slice(0, 320) ?? null,
    });

    return NextResponse.json({ data: article }, { status: 201 });
});
