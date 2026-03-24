"use client";

import { useState, useTransition } from "react";
import { getMoreArticles } from "@/features/blog/actions/get-articles";
import { ArticleCard } from "./article-card";

interface Article {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    categoryName: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
}

interface LoadMoreButtonProps {
    initialOffset: number;
    limit: number;
    category?: string;
    search?: string;
    hasMore: boolean;
}

export function LoadMoreButton({
    initialOffset,
    limit,
    category,
    search,
    hasMore: initialHasMore,
}: LoadMoreButtonProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [offset, setOffset] = useState(initialOffset);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isPending, startTransition] = useTransition();

    function handleLoadMore() {
        startTransition(async () => {
            const result = await getMoreArticles({
                offset,
                limit,
                category,
                search,
            });
            setArticles((prev) => [...prev, ...result.articles]);
            setOffset((prev) => prev + result.articles.length);
            setHasMore(result.hasMore);
        });
    }

    return (
        <>
            {articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.slug}
                            slug={article.slug}
                            title={article.title}
                            excerpt={article.excerpt}
                            coverImage={article.coverImage}
                            categoryName={article.categoryName}
                            publishedAt={article.publishedAt}
                            readingTime={article.readingTime}
                        />
                    ))}
                </div>
            )}
            {hasMore && (
                <div className="text-center mt-12">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "読み込み中..." : "もっと読む"}
                    </button>
                </div>
            )}
        </>
    );
}
