import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
    articles,
    categories,
    seoMetadata,
    tags,
    articleTags,
    authorProfiles,
} from "@/lib/db/schema";
import { eq, and, desc, ne } from "drizzle-orm";
import { SocialShare } from "@/features/blog/components/social-share";
import { AuthorBox } from "@/features/blog/components/author-box";
import { ArticleCard } from "@/features/blog/components/article-card";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Try published first, then any status for authenticated preview
    let [article] = await db
        .select({
            title: articles.title,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            id: articles.id,
            status: articles.status,
        })
        .from(articles)
        .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
        .limit(1);

    if (!article) {
        const { userId } = await auth();
        if (userId) {
            [article] = await db
                .select({
                    title: articles.title,
                    excerpt: articles.excerpt,
                    coverImage: articles.coverImage,
                    id: articles.id,
                    status: articles.status,
                })
                .from(articles)
                .where(eq(articles.slug, slug))
                .limit(1);
        }
    }

    if (!article) return { title: "Not Found" };

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
            card:
                (seo?.twitterCard as "summary" | "summary_large_image") ??
                "summary_large_image",
            title: seo?.twitterTitle ?? seo?.metaTitle ?? article.title,
            description:
                seo?.twitterDescription ??
                seo?.metaDescription ??
                article.excerpt ??
                "",
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

    // Try published first
    let [article] = await db
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
            authorId: articles.authorId,
            status: articles.status,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
        .limit(1);

    let isPreview = false;

    // If not published, check for draft + auth
    if (!article) {
        const { userId } = await auth();
        if (!userId) notFound();

        [article] = await db
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
                authorId: articles.authorId,
                status: articles.status,
            })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .where(eq(articles.slug, slug))
            .limit(1);

        if (!article) notFound();
        isPreview = true;
    }

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

    // Get author profile from DB
    const [authorProfile] = await db
        .select()
        .from(authorProfiles)
        .where(eq(authorProfiles.clerkId, article.authorId))
        .limit(1);

    // Get related posts — same category, exclude current
    const relatedPosts = article.categoryId
        ? await db
            .select({
                slug: articles.slug,
                title: articles.title,
                coverImage: articles.coverImage,
                categoryName: categories.name,
                publishedAt: articles.publishedAt,
                readingTime: articles.readingTime,
                excerpt: articles.excerpt,
            })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .where(
                and(
                    eq(articles.status, "published"),
                    eq(articles.categoryId, article.categoryId),
                    ne(articles.id, article.id)
                )
            )
            .orderBy(desc(articles.publishedAt))
            .limit(3)
        : [];

    // If not enough related posts from same category, fill with recent posts
    let recommendedPosts = relatedPosts;
    if (recommendedPosts.length < 3) {
        const excludeSlugs = [
            article.slug,
            ...recommendedPosts.map((p) => p.slug),
        ];
        const morePosts = await db
            .select({
                slug: articles.slug,
                title: articles.title,
                coverImage: articles.coverImage,
                categoryName: categories.name,
                publishedAt: articles.publishedAt,
                readingTime: articles.readingTime,
                excerpt: articles.excerpt,
            })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .where(eq(articles.status, "published"))
            .orderBy(desc(articles.publishedAt))
            .limit(3 - recommendedPosts.length + excludeSlugs.length);

        const additional = morePosts.filter(
            (p) => !excludeSlugs.includes(p.slug)
        );
        recommendedPosts = [...recommendedPosts, ...additional].slice(0, 3);
    }

    const formattedDate = article.publishedAt
        ? article.publishedAt.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;

    const jsonLd = seo?.jsonLd ?? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.excerpt,
        image: article.coverImage,
        datePublished: article.publishedAt?.toISOString(),
        publisher: {
            "@type": "Organization",
            name: "Rakudair",
            url: "https://www.rakudair.com",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen">
                {isPreview && (
                    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
                        プレビューモード — この記事はまだ公開されていません (Status: {article.status})
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative pt-20">
                    <div className="relative h-[50vh] md:h-[70vh]">
                        {article.coverImage ? (
                            <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                <span className="text-[12rem] text-muted-foreground/20">
                                    旅
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>ブログに戻る</span>
                            </Link>

                            {article.categoryName && (
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                                    {article.categoryName}
                                </span>
                            )}

                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                                {article.title}
                            </h1>

                            {article.excerpt && (
                                <p className="text-lg md:text-xl text-muted-foreground mb-6">
                                    {article.excerpt}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                        <Image
                                            src={authorProfile?.avatar || "/logo.png"}
                                            alt={authorProfile?.displayName || "Rakudair"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{authorProfile?.displayName || "Rakudair"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {authorProfile?.role || "トラベルライター"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {formattedDate && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {formattedDate}
                                        </span>
                                    )}
                                    {article.readingTime && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {article.readingTime}分
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="py-12 md:py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-10">
                            {/* Social Share Sidebar */}
                            <SocialShare title={article.title} slug={article.slug} />

                            {/* Main Content */}
                            <article className="flex-1 min-w-0">
                                <div
                                    className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl"
                                    dangerouslySetInnerHTML={{
                                        __html: article.contentHtml ?? "",
                                    }}
                                />

                                {/* Tags */}
                                {articleTagList.length > 0 && (
                                    <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-2">
                                        {articleTagList.map((tag) => (
                                            <span
                                                key={tag.slug}
                                                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Inline Author Box (mobile) */}
                                <div className="lg:hidden">
                                    <AuthorBox
                                        name={authorProfile?.displayName || "Rakudair"}
                                        bio={authorProfile?.bio || "世界中の砂漠を旅し、その美しさと文化を記録しています。カメラを片手に、次の冒険へ。"}
                                        avatar={authorProfile?.avatar || "/logo.png"}
                                        role={authorProfile?.role || "トラベルライター"}
                                        location={authorProfile?.location || undefined}
                                        website={authorProfile?.website || undefined}
                                        socialTwitter={authorProfile?.socialTwitter || undefined}
                                        socialInstagram={authorProfile?.socialInstagram || undefined}
                                        socialYoutube={authorProfile?.socialYoutube || undefined}
                                        socialFacebook={authorProfile?.socialFacebook || undefined}
                                        socialTiktok={authorProfile?.socialTiktok || undefined}
                                        socialGithub={authorProfile?.socialGithub || undefined}
                                        variant="inline"
                                    />
                                </div>
                            </article>

                            {/* Author Sidebar (desktop) */}
                            <div className="hidden lg:block w-64 shrink-0">
                                <AuthorBox
                                    name={authorProfile?.displayName || "Rakudair"}
                                    bio={authorProfile?.bio || "世界中の砂漠を旅し、その美しさと文化を記録しています。カメラを片手に、次の冒険へ。"}
                                    avatar={authorProfile?.avatar || "/logo.png"}
                                    role={authorProfile?.role || "トラベルライター"}
                                    location={authorProfile?.location || undefined}
                                    website={authorProfile?.website || undefined}
                                    socialTwitter={authorProfile?.socialTwitter || undefined}
                                    socialInstagram={authorProfile?.socialInstagram || undefined}
                                    socialYoutube={authorProfile?.socialYoutube || undefined}
                                    socialFacebook={authorProfile?.socialFacebook || undefined}
                                    socialTiktok={authorProfile?.socialTiktok || undefined}
                                    socialGithub={authorProfile?.socialGithub || undefined}
                                    variant="sidebar"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Posts */}
                {recommendedPosts.length > 0 && (
                    <section className="py-12 md:py-16 bg-secondary">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                                関連記事
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {recommendedPosts.map((post) => (
                                    <ArticleCard
                                        key={post.slug}
                                        slug={post.slug}
                                        title={post.title}
                                        coverImage={post.coverImage}
                                        categoryName={post.categoryName}
                                        variant="minimal"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
