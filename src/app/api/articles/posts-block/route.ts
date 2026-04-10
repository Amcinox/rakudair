export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { apiRoute } from "@/lib/api-utils";
import { desc, asc, eq, inArray, and } from "drizzle-orm";

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "latest"; // "latest" | "selected"
    
    let query = db
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
        .leftJoin(categories, eq(articles.categoryId, categories.id));

    const conditions = [eq(articles.status, "published")];

    if (mode === "selected") {
        const slugsParam = searchParams.get("slugs") || "";
        const slugs = slugsParam.split(",").filter((s) => s.trim().length > 0);
        if (slugs.length > 0) {
            conditions.push(inArray(articles.slug, slugs));
        } else {
            // If mode=selected but no slugs provided, return empty
            return NextResponse.json({ data: [] });
        }
    } else {
        // mode === "latest"
        const categoryFilter = searchParams.get("category");
        if (categoryFilter) {
            conditions.push(eq(categories.slug, categoryFilter));
        }
    }

    // Apply where
    query = query.where(and(...conditions)) as any;

    if (mode === "latest") {
        const count = Math.min(parseInt(searchParams.get("count") ?? "3"), 12);
        const sortBy = searchParams.get("sortBy") || "publishedAt";

        if (sortBy === "updatedAt") {
            query = query.orderBy(desc(articles.updatedAt)) as any;
        } else if (sortBy === "createdAt") {
            query = query.orderBy(desc(articles.createdAt)) as any;
        } else {
            query = query.orderBy(desc(articles.publishedAt)) as any;
        }
        
        query = query.limit(count) as any;
    }

    const posts = await query;
    return NextResponse.json({ data: posts });
});
