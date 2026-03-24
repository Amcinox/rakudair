import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Blog — Rakuda Air",
    description:
        "Explore Japan through our travel guides, cultural insights, and hidden gem recommendations.",
};

export default async function BlogPage() {
    const posts = await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            publishedAt: articles.publishedAt,
            readingTime: articles.readingTime,
            categoryName: categories.name,
            categorySlug: categories.slug,
            isFeatured: articles.isFeatured,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt))
        .limit(24);

    const featured = posts.filter((p) => p.isFeatured);
    const regular = posts.filter((p) => !p.isFeatured);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                    Stories, guides, and insights from across Japan.
                </p>
            </header>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="mb-16">
                    <div className="grid gap-6 md:grid-cols-2">
                        {featured.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[16/9]"
                            >
                                {post.coverImage && (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                                    />
                                )}
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    {post.categoryName && (
                                        <Badge className="mb-2 w-fit bg-red-600 text-white">
                                            {post.categoryName}
                                        </Badge>
                                    )}
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-white/80 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <span className="text-white/60 text-xs mt-2">
                                        {post.readingTime} min read
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Article grid */}
            <section>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {regular.map((post) => (
                        <article key={post.id} className="group">
                            <Link href={`/blog/${post.slug}`}>
                                <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-neutral-100 mb-3">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-4xl text-neutral-300">
                                            旅
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {post.categoryName && (
                                        <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                                            {post.categoryName}
                                        </span>
                                    )}
                                    <h3 className="font-semibold text-lg leading-tight group-hover:text-red-700 transition-colors">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-neutral-500 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <p className="text-neutral-400 text-xs">
                                        {post.readingTime} min read
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-4xl mb-4">旅</p>
                        <p className="text-neutral-500">
                            No articles published yet. Check back soon!
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
