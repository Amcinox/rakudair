import { Suspense } from "react";
import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { desc, eq, and, ilike, or } from "drizzle-orm";
import {
    FeaturedPost,
    ArticleCard,
    CategoryFilter,
    SearchBar,
    LoadMoreButton,
} from "@/features/blog/components";

const ARTICLES_PER_PAGE = 9;

export const metadata = {
    title: "ブログ — Rakudair",
    description:
        "砂漠の冒険、文化探訪、星空観測。世界中の旅の物語をお届けします。",
};

interface BlogPageProps {
    searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { category, q } = await searchParams;

    // Fetch categories for filter
    const allCategories = await db
        .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
        })
        .from(categories)
        .orderBy(categories.sortOrder);

    // Build query conditions
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

    if (q) {
        conditions.push(
            or(
                ilike(articles.title, `%${q}%`),
                ilike(articles.excerpt, `%${q}%`)
            )!
        );
    }

    // Fetch featured post (only when no filters active)
    let featuredPost = null;
    if (!category && !q) {
        const [fp] = await db
            .select({
                slug: articles.slug,
                title: articles.title,
                excerpt: articles.excerpt,
                coverImage: articles.coverImage,
                publishedAt: articles.publishedAt,
                readingTime: articles.readingTime,
                categoryName: categories.name,
                isFeatured: articles.isFeatured,
            })
            .from(articles)
            .leftJoin(categories, eq(articles.categoryId, categories.id))
            .where(and(eq(articles.status, "published"), eq(articles.isFeatured, true)))
            .orderBy(desc(articles.publishedAt))
            .limit(1);

        featuredPost = fp ?? null;
    }

    // Fetch regular posts (excluding featured if present)
    const allPosts = await db
        .select({
            slug: articles.slug,
            title: articles.title,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            publishedAt: articles.publishedAt,
            readingTime: articles.readingTime,
            categoryName: categories.name,
            isFeatured: articles.isFeatured,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(articles.publishedAt))
        .limit(ARTICLES_PER_PAGE + 1);

    // Filter out the featured post from the grid
    const regularPosts = featuredPost
        ? allPosts.filter((p) => p.slug !== featuredPost.slug)
        : allPosts;

    const displayPosts = regularPosts.slice(0, ARTICLES_PER_PAGE);
    const hasMore = regularPosts.length > ARTICLES_PER_PAGE;

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                            ブログ
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            砂漠の冒険、文化探訪、星空観測。世界中の旅の物語をお届けします。
                        </p>
                    </div>

                    {/* Search Bar */}
                    <Suspense>
                        <SearchBar />
                    </Suspense>

                    {/* Categories */}
                    <Suspense>
                        <CategoryFilter
                            categories={allCategories}
                            activeSlug={category}
                        />
                    </Suspense>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                            注目の記事
                        </h2>
                        <FeaturedPost
                            slug={featuredPost.slug}
                            title={featuredPost.title}
                            excerpt={featuredPost.excerpt}
                            coverImage={featuredPost.coverImage}
                            categoryName={featuredPost.categoryName}
                            publishedAt={featuredPost.publishedAt}
                            readingTime={featuredPost.readingTime}
                        />
                    </div>
                </section>
            )}

            {/* All Posts Grid */}
            <section className="py-12 md:py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                        {category || q ? "検索結果" : "すべての記事"}
                    </h2>

                    {displayPosts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayPosts.map((post) => (
                                    <ArticleCard
                                        key={post.slug}
                                        slug={post.slug}
                                        title={post.title}
                                        excerpt={post.excerpt}
                                        coverImage={post.coverImage}
                                        categoryName={post.categoryName}
                                        publishedAt={post.publishedAt}
                                        readingTime={post.readingTime}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            <LoadMoreButton
                                initialOffset={ARTICLES_PER_PAGE}
                                limit={ARTICLES_PER_PAGE}
                                category={category}
                                search={q}
                                hasMore={hasMore}
                            />
                        </>
                    ) : (
                        <div className="text-center py-24">
                            <p className="text-6xl mb-4">🏜️</p>
                            <p className="text-muted-foreground text-lg">
                                記事が見つかりませんでした。
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
