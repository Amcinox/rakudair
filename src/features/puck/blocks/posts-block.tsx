"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Folder } from "lucide-react";
import { useEffect, useState } from "react";

interface Post {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: string | null;
    readingTime: number | null;
    categoryName: string | null;
}

interface PostsBlockProps {
    heading: string;
    description: string;
    mode: "latest" | "selected";
    sortBy?: "publishedAt" | "updatedAt" | "createdAt";
    count?: number;
    categoryFilter?: string;
    selectedPostSlugs?: string;
    columns: 2 | 3 | 4;
    showExcerpt: boolean;
    showCategory: boolean;
    showDate: boolean;
    linkText?: string;
    linkUrl?: string;
}

export function PostsBlock({
    heading,
    description,
    mode,
    sortBy = "publishedAt",
    count = 3,
    categoryFilter,
    selectedPostSlugs,
    columns = 3,
    showExcerpt = true,
    showCategory = true,
    showDate = true,
    linkText,
    linkUrl,
}: PostsBlockProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("mode", mode);
        if (mode === "latest") {
            params.set("sortBy", sortBy);
            params.set("count", String(count));
            if (categoryFilter) params.set("category", categoryFilter);
        } else if (mode === "selected" && selectedPostSlugs) {
            params.set("slugs", selectedPostSlugs);
        }

        setLoading(true);
        fetch(`/api/articles/posts-block?${params.toString()}`)
            .then((r) => r.json())
            .then((json) => setPosts(json.data ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [mode, sortBy, count, categoryFilter, selectedPostSlugs]);

    const gridCols = {
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

    return (
        <section className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        {heading && (
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {heading}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted-foreground max-w-xl">{description}</p>
                        )}
                    </div>
                    {linkText && (
                        <Link
                            href={linkUrl || "/blog"}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mt-4 md:mt-0 group shrink-0"
                        >
                            {linkText}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed rounded-2xl">
                        <p className="text-muted-foreground">記事が見つかりません</p>
                    </div>
                ) : (
                    <div className={`grid gap-8 ${gridCols}`}>
                        {posts.map((post) => (
                            <article
                                key={post.slug}
                                className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl"
                            >
                                <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                                                <span className="text-6xl text-muted-foreground/30 font-serif">旅</span>
                                            </div>
                                        )}
                                        {showCategory && post.categoryName && (
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium shadow-sm">
                                                    <Folder className="w-3 h-3" />
                                                    {post.categoryName}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-1 p-6">
                                        {showDate && post.publishedAt && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <time dateTime={post.publishedAt}>
                                                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </time>
                                                {post.readingTime && (
                                                    <>
                                                        <span className="opacity-50">•</span>
                                                        <span>{post.readingTime}分</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        {showExcerpt && post.excerpt && (
                                            <p className="text-muted-foreground line-clamp-2 mt-auto text-sm">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
