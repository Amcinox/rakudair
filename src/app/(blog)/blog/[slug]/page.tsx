import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { articles, categories, seoMetadata, tags, articleTags } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const [article] = await db
        .select({
            title: articles.title,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            id: articles.id,
        })
        .from(articles)
        .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
        .limit(1);

    if (!article) return { title: "Not Found" };

    // Get SEO metadata
    const [seo] = await db
        .select()
        .from(seoMetadata)
        .where(
            and(
                eq(seoMetadata.entityType, "article"),
                eq(seoMetadata.entityId, article.id)
            )
        )
        .limit(1);

    return {
        title: seo?.metaTitle ?? article.title,
        description: seo?.metaDescription ?? article.excerpt ?? "",
        openGraph: {
            title: seo?.ogTitle ?? seo?.metaTitle ?? article.title,
            description:
                seo?.ogDescription ?? seo?.metaDescription ?? article.excerpt ?? "",
            images: seo?.ogImage
                ? [seo.ogImage]
                : article.coverImage
                    ? [article.coverImage]
                    : [],
            type: "article",
        },
        twitter: {
            card: (seo?.twitterCard as "summary" | "summary_large_image") ?? "summary_large_image",
            title: seo?.twitterTitle ?? seo?.metaTitle ?? article.title,
            description:
                seo?.twitterDescription ?? seo?.metaDescription ?? article.excerpt ?? "",
        },
        ...(seo?.noIndex || seo?.noFollow
            ? {
                robots: {
                    index: !seo?.noIndex,
                    follow: !seo?.noFollow,
                },
            }
            : {}),
        ...(seo?.canonicalUrl
            ? { alternates: { canonical: seo.canonicalUrl } }
            : {}),
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;

    const [article] = await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            excerpt: articles.excerpt,
            contentHtml: articles.contentHtml,
            coverImage: articles.coverImage,
            publishedAt: articles.publishedAt,
            readingTime: articles.readingTime,
            categoryId: articles.categoryId,
            categoryName: categories.name,
            categorySlug: categories.slug,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
        .limit(1);

    if (!article) notFound();

    // Get tags
    const articleTagList = await db
        .select({ name: tags.name, slug: tags.slug })
        .from(articleTags)
        .innerJoin(tags, eq(articleTags.tagId, tags.id))
        .where(eq(articleTags.articleId, article.id));

    // Get JSON-LD
    const [seo] = await db
        .select({ jsonLd: seoMetadata.jsonLd })
        .from(seoMetadata)
        .where(
            and(
                eq(seoMetadata.entityType, "article"),
                eq(seoMetadata.entityId, article.id)
            )
        )
        .limit(1);

    const jsonLd = seo?.jsonLd ?? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.coverImage,
        datePublished: article.publishedAt?.toISOString(),
        publisher: {
            "@type": "Organization",
            name: "Rakuda Air",
            url: "https://www.rakudair.com",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className="mx-auto max-w-3xl px-4 py-12">
                {/* Header */}
                <header className="mb-8 text-center">
                    {article.categoryName && (
                        <Link
                            href={`/blog?category=${article.categorySlug}`}
                            className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2 inline-block hover:underline"
                        >
                            {article.categoryName}
                        </Link>
                    )}
                    <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
                        {article.title}
                    </h1>
                    {article.excerpt && (
                        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-3 mt-4 text-sm text-neutral-400">
                        {article.publishedAt && (
                            <time dateTime={article.publishedAt.toISOString()}>
                                {article.publishedAt.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        )}
                        <span>·</span>
                        <span>{article.readingTime} min read</span>
                    </div>
                </header>

                {/* Cover Image */}
                {article.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-10">
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg prose-neutral mx-auto prose-headings:font-bold prose-a:text-red-700 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml ?? "" }}
                />

                {/* Tags */}
                {articleTagList.length > 0 && (
                    <div className="mt-10 pt-6 border-t flex flex-wrap gap-2">
                        {articleTagList.map((tag) => (
                            <Badge key={tag.slug} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </article>
        </>
    );
}
