"use client";

import { useQuery } from "@tanstack/react-query";
import { useWebsiteConfig } from "./website-config-provider";
import type { WebsiteConfig } from "./types";

/**
 * React Query hook that keeps the website config in sync on the client.
 *
 * On first render it uses the server-hydrated context value as
 * `initialData` so there's no loading state / layout shift.
 * In the background it refetches from `/api/config` and the query
 * cache keeps it fresh across components.
 */
export function useWebsiteConfigQuery(): WebsiteConfig {
    const serverConfig = useWebsiteConfig();

    const { data } = useQuery<WebsiteConfig>({
        queryKey: ["website-config"],
        queryFn: async () => {
            const res = await fetch("/api/config");
            if (!res.ok) throw new Error("Failed to fetch config");
            return res.json();
        },
        initialData: serverConfig,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return data;
}
