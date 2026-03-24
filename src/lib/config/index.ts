// Client-safe exports only — no server-only modules here.
// Server components should import getWebsiteConfig from "@/lib/config/get-website-config" directly.
export { WebsiteConfigProvider, useWebsiteConfig } from "./website-config-provider";
export { useWebsiteConfigQuery } from "./use-website-config-query";
export type { WebsiteConfig, NavItem } from "./types";
