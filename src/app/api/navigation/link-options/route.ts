import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages, articles, categories } from "@/lib/db/schema";
import { apiRoute } from "@/lib/api-utils";
import { eq, asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async () => {
    const [pageList, articleList, categoryList] = await Promise.all([
        db
            .select({
                id: pages.id,
                title: pages.title,
                slug: pages.slug,
                status: pages.status,
            })
            .from(pages)
            .where(eq(pages.status, "published"))
            .orderBy(asc(pages.title))
            .limit(100),
        db
            .select({
                id: articles.id,
                title: articles.title,
                slug: articles.slug,
                status: articles.status,
            })
            .from(articles)
            .where(eq(articles.status, "published"))
            .orderBy(desc(articles.publishedAt))
            .limit(100),
        db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
            })
            .from(categories)
            .orderBy(asc(categories.name)),
    ]);

    return NextResponse.json({
        data: {
            pages: pageList.map((p) => ({
                type: "page" as const,
                id: p.id,
                title: p.title,
                slug: p.slug,
                url: `/${p.slug}`,
            })),
            articles: articleList.map((a) => ({
                type: "article" as const,
                id: a.id,
                title: a.title,
                slug: a.slug,
                url: `/blog/${a.slug}`,
            })),
            categories: categoryList.map((c) => ({
                type: "category" as const,
                id: c.id,
                title: c.name,
                slug: c.slug,
                url: `/blog/category/${c.slug}`,
            })),
        },
    });
});
