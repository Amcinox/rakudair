"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Tag = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    articleCount: number;
};

export function useTags() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const json = await apiFetch<{ data: Tag[] }>("/api/tags");
            setTags(json.data ?? []);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load tags");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch_(); }, [fetch_]);

    const create = async (data: { name: string; slug?: string }) => {
        try {
            await apiFetch("/api/tags", {
                method: "POST",
                body: JSON.stringify(data),
            });
            toast.success("Tag created");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create tag");
            throw e;
        }
    };

    const update = async (id: string, data: { name?: string; slug?: string }) => {
        try {
            await apiFetch(`/api/tags/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            toast.success("Tag updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update tag");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/tags/${id}`, { method: "DELETE" });
            toast.success("Tag deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete tag");
            throw e;
        }
    };

    return { tags, loading, refetch: fetch_, create, update, remove };
}
