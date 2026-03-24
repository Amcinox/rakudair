import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const SITE_URL = "https://www.rakudair.com";

export async function GET() {
    const posts = await db
        .select({
            title: articles.title,
            slug: articles.slug,
            excerpt: articles.excerpt,
            publishedAt: articles.publishedAt,
            categoryName: categories.name,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt))
        .limit(50);

    const items = posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ""}]]></description>
      ${post.publishedAt ? `<pubDate>${post.publishedAt.toUTCString()}</pubDate>` : ""}
      ${post.categoryName ? `<category><![CDATA[${post.categoryName}]]></category>` : ""}
    </item>`
        )
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rakuda Air</title>
    <link>${SITE_URL}</link>
    <description>Discover Japan through authentic stories, guides, and cultural insights.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
