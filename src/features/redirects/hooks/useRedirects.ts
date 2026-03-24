"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Redirect = {
    id: string;
    fromPath: string;
    toPath: string;
    type: number;
    isActive: boolean;
    createdAt: string;
};

export function useRedirects() {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const json = await apiFetch<{ data: Redirect[]; total: number }>(
                "/api/redirects",
            );
            setRedirects(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load redirects");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch_(); }, [fetch_]);

    const create = async (data: Partial<Redirect>) => {
        try {
            await apiFetch("/api/redirects", {
                method: "POST",
                body: JSON.stringify(data),
            });
            toast.success("Redirect created");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create redirect");
            throw e;
        }
    };

    const update = async (id: string, data: Partial<Redirect>) => {
        try {
            await apiFetch(`/api/redirects/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            toast.success("Redirect updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update redirect");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/redirects/${id}`, { method: "DELETE" });
            toast.success("Redirect deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete redirect");
            throw e;
        }
    };

    return { redirects, total, loading, refetch: fetch_, create, update, remove };
}
