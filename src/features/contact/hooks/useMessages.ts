"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    createdAt: string;
};

export function useMessages(statusFilter?: string) {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);

            const json = await apiFetch<{ data: ContactMessage[]; total: number }>(
                `/api/contact?${params}`,
            );
            setMessages(json.data ?? []);
            setTotal(json.total ?? 0);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load messages");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await apiFetch(`/api/contact/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update message");
            throw e;
        }
    };

    const remove = async (id: string) => {
        try {
            await apiFetch(`/api/contact/${id}`, { method: "DELETE" });
            toast.success("Message deleted");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete message");
            throw e;
        }
    };

    return { messages, total, loading, refetch: fetch_, updateStatus, remove };
}
