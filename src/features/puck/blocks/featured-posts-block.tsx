"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

interface FeaturedPostsBlockProps {
    heading: string;
    description: string;
    linkText: string;
    linkUrl: string;
    count: number;
}

export function FeaturedPostsBlock({
    heading,
    description,
    linkText,
    linkUrl,
    count,
}: FeaturedPostsBlockProps) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch(`/api/articles/featured?count=${count || 3}`)
            .then((r) => r.json())
            .then((json) => setPosts(json.data ?? []))
            .catch(() => { });
    }, [count]);

    if (posts.length === 0) {
        return (
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {heading}
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            {description}
                        </p>
                        <p className="text-muted-foreground/60 mt-8 text-sm">
                            まだ記事がありません。記事を作成して公開してください。
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {heading}
                        </h2>
                        <p className="text-muted-foreground max-w-xl">{description}</p>
                    </div>
                    {linkText && (
                        <Link
                            href={linkUrl || "/blog"}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mt-4 md:mt-0 group"
                        >
                            {linkText}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                            <span className="text-6xl text-muted-foreground/30">
                                                旅
                                            </span>
                                        </div>
                                    )}
                                    {post.categoryName && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-background/90 text-foreground text-xs font-medium">
                                                {post.categoryName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                        {post.publishedAt && (
                                            <span>
                                                {new Date(post.publishedAt).toLocaleDateString(
                                                    "ja-JP",
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    },
                                                )}
                                            </span>
                                        )}
                                        {post.publishedAt && post.readingTime && <span>•</span>}
                                        {post.readingTime && <span>{post.readingTime}分</span>}
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-muted-foreground line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
