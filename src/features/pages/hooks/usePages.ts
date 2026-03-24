"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Page = {
    id: string;
    title: string;
    slug: string;
    status: string;
    template: string;
    showInNav: boolean;
    locale: string;
    createdAt: string;
    updatedAt: string;
};

interface UsePagesOptions {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export function usePages(options: UsePagesOptions = {}) {
    const { page = 1, limit = 20, status, search } = options;
    const [pages, setPages] = useState<Page[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (status) params.set("status", status);
            if (search) params.set("search", search);

            const json = await apiFetch<{ data: Page[]; total: number }>(
                `/api/pages?${params}`,
            );
            setPages(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load pages");
        } finally {
            setLoading(false);
        }
    }, [page, limit, status, search]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/pages/${id}`, { method: "DELETE" });
            toast.success("Page deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete page");
            throw e;
        }
    };

    return { pages, total, loading, refetch: fetch_, remove };
}
