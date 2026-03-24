"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    sortOrder: number;
    createdAt: string;
};

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const json = await apiFetch<{ data: Category[] }>("/api/categories");
            setCategories(json.data ?? []);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch_(); }, [fetch_]);

    const create = async (data: Partial<Category>) => {
        try {
            await apiFetch("/api/categories", {
                method: "POST",
                body: JSON.stringify(data),
            });
            toast.success("Category created");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create category");
            throw e;
        }
    };

    const update = async (id: string, data: Partial<Category>) => {
        try {
            await apiFetch(`/api/categories/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            toast.success("Category updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update category");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/categories/${id}`, { method: "DELETE" });
            toast.success("Category deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete category");
            throw e;
        }
    };

    return { categories, loading, refetch: fetch_, create, update, remove };
}
