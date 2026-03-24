"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type NavItem = {
    id: string;
    label: string;
    url: string;
    target: string;
    position: string;
    sortOrder: number;
    parentId: string | null;
    pageId: string | null;
    isVisible: boolean;
    createdAt: string;
};

export function useNavigation(position?: string) {
    const [items, setItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (position) params.set("position", position);

            const json = await apiFetch<{ data: NavItem[] }>(
                `/api/navigation?${params}`,
            );
            setItems(json.data ?? []);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load navigation");
        } finally {
            setLoading(false);
        }
    }, [position]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const create = async (data: Partial<NavItem>) => {
        try {
            await apiFetch("/api/navigation", {
                method: "POST",
                body: JSON.stringify(data),
            });
            toast.success("Nav item created");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create nav item");
            throw e;
        }
    };

    const update = async (id: string, data: Partial<NavItem>) => {
        try {
            await apiFetch(`/api/navigation/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            toast.success("Nav item updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update nav item");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/navigation/${id}`, { method: "DELETE" });
            toast.success("Nav item deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete nav item");
            throw e;
        }
    };

    return { items, loading, refetch: fetch_, create, update, remove };
}
