"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type MediaItem = {
    id: string;
    url: string;
    key: string;
    filename: string;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;
    altText: string | null;
    createdAt: string;
};

export function useMedia(page = 1, limit = 30) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const json = await apiFetch<{ data: MediaItem[]; total: number }>(
                `/api/media?page=${page}&limit=${limit}`,
            );
            setItems(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load media");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const saveItem = async (data: Omit<MediaItem, "id" | "createdAt">) => {
        try {
            await apiFetch("/api/media", {
                method: "POST",
                body: JSON.stringify(data),
            });
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save media record");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/media/${id}`, { method: "DELETE" });
            toast.success("Media deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete media");
            throw e;
        }
    };

    return { items, total, loading, refetch: fetch_, saveItem, remove };
}
