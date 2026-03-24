"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type SeoEntry = {
    id: string;
    entityType: string;
    entityId: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[] | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    noFollow: boolean;
    entityTitle?: string;
    updatedAt: string;
};

export function useSeo(entityType?: string, search?: string) {
    const [entries, setEntries] = useState<SeoEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (entityType) params.set("entityType", entityType);
            if (search) params.set("search", search);

            const json = await apiFetch<{ data: SeoEntry[]; total: number }>(
                `/api/seo?${params}`,
            );
            setEntries(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load SEO data");
        } finally {
            setLoading(false);
        }
    }, [entityType, search]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const save = async (data: Record<string, unknown>) => {
        try {
            await apiFetch("/api/seo", { method: "POST", body: JSON.stringify(data) });
            toast.success("SEO saved");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save SEO");
            throw e;
        }
    };

    const update = async (id: string, data: Record<string, unknown>) => {
        try {
            await apiFetch(`/api/seo/${id}`, { method: "PATCH", body: JSON.stringify(data) });
            toast.success("SEO updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update SEO");
            throw e;
        }
    };

    return { entries, total, loading, refetch: fetch_, save, update };
}
