"use client";

import { createContext, useContext } from "react";
import type { WebsiteConfig } from "./types";

const WebsiteConfigContext = createContext<WebsiteConfig | null>(null);

/**
 * Provider that makes the website config available to all client
 * components in the tree. Wrap it at the layout level and pass
 * the server-fetched config as initial value.
 */
export function WebsiteConfigProvider({
    config,
    children,
}: {
    config: WebsiteConfig;
    children: React.ReactNode;
}) {
    return (
        <WebsiteConfigContext.Provider value={config}>
            {children}
        </WebsiteConfigContext.Provider>
    );
}

/**
 * Read the website config from context.
 * Only works inside <WebsiteConfigProvider>.
 */
export function useWebsiteConfig(): WebsiteConfig {
    const ctx = useContext(WebsiteConfigContext);
    if (!ctx) {
        throw new Error(
            "useWebsiteConfig must be used within <WebsiteConfigProvider>"
        );
    }
    return ctx;
}
