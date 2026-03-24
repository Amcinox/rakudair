"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/features/shared/api";
import { toast } from "sonner";

export function useSettings() {
    const [settings, setSettings] = useState<Record<string, unknown>>({});
    const [loading, setLoading] = useState(true);

    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const json = await apiFetch<{ data: Record<string, unknown> }>("/api/settings");
            setSettings(json.data ?? {});
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch_(); }, [fetch_]);

    const save = async (entries: Array<{ key: string; value: unknown }>) => {
        try {
            await apiFetch("/api/settings", {
                method: "POST",
                body: JSON.stringify(entries),
            });
            toast.success("Settings saved");
            await fetch_();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save settings");
            throw e;
        }
    };

    return { settings, loading, refetch: fetch_, save };
}
