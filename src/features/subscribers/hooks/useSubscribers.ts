"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type Subscriber = {
    id: string;
    email: string;
    name: string | null;
    status: string;
    subscribedAt: string;
    unsubscribedAt: string | null;
};

export function useSubscribers(statusFilter?: string) {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);

            const json = await apiFetch<{ data: Subscriber[]; total: number }>(
                `/api/subscribers?${params}`,
            );
            setSubscribers(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await apiFetch(`/api/subscribers/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            toast.success("Subscriber updated");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update subscriber");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/subscribers/${id}`, { method: "DELETE" });
            toast.success("Subscriber deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete subscriber");
            throw e;
        }
    };

    return { subscribers, total, loading, refetch: fetch_, updateStatus, remove };
}
