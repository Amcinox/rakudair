import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { articles, pages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const SITE_URL = "https://www.rakudair.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const publishedArticles = await db
        .select({
            slug: articles.slug,
            updatedAt: articles.updatedAt,
        })
        .from(articles)
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.updatedAt));

    const publishedPages = await db
        .select({
            slug: pages.slug,
            updatedAt: pages.updatedAt,
        })
        .from(pages)
        .where(eq(pages.status, "published"))
        .orderBy(desc(pages.updatedAt));

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    const articleRoutes: MetadataRoute.Sitemap = publishedArticles.map((a) => ({
        url: `${SITE_URL}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const pageRoutes: MetadataRoute.Sitemap = publishedPages.map((p) => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes, ...pageRoutes];
}
