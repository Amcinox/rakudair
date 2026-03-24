"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    status: string;
    publishedAt: string | null;
    categoryId: string | null;
    categoryName: string | null;
    isFeatured: boolean;
    locale: string;
    readingTime: number | null;
    createdAt: string;
    updatedAt: string;
};

interface UseArticlesOptions {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
}

export function useArticles(options: UseArticlesOptions = {}) {
    const { page = 1, limit = 20, status, category, search, sort } = options;
    const [articles, setArticles] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (status) params.set("status", status);
            if (category) params.set("category", category);
            if (search) params.set("search", search);
            if (sort) params.set("sort", sort);

            const json = await apiFetch<{ data: Article[]; total: number }>(
                `/api/articles?${params}`,
            );
            setArticles(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load articles");
        } finally {
            setLoading(false);
        }
    }, [page, limit, status, category, search, sort]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
            toast.success("Article deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete article");
            throw e;
        }
    };

    return { articles, total, loading, refetch: fetch_, remove };
}
