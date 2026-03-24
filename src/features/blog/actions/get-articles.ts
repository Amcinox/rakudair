"use server";

import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { desc, eq, and, ilike, or } from "drizzle-orm";

interface GetMoreArticlesParams {
    offset: number;
    limit: number;
    category?: string;
    search?: string;
}

export async function getMoreArticles({
    offset,
    limit,
    category,
    search,
}: GetMoreArticlesParams) {
    const conditions = [eq(articles.status, "published")];

    if (category) {
        const [cat] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.slug, category))
            .limit(1);

        if (cat) {
            conditions.push(eq(articles.categoryId, cat.id));
        }
    }

    if (search) {
        conditions.push(
            or(
                ilike(articles.title, `%${search}%`),
                ilike(articles.excerpt, `%${search}%`)
            )!
        );
    }

    const rows = await db
        .select({
            slug: articles.slug,
            title: articles.title,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            publishedAt: articles.publishedAt,
            readingTime: articles.readingTime,
            categoryName: categories.name,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(articles.publishedAt))
        .limit(limit + 1)
        .offset(offset);

    const hasMore = rows.length > limit;
    const articleList = hasMore ? rows.slice(0, limit) : rows;

    return {
        articles: articleList,
        hasMore,
    };
}
