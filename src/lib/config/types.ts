/**
 * Centralized website configuration types.
 * These types represent the full config fetched from DB and
 * shared across all blog pages via context / server cache.
 */

export interface NavItem {
    id: string;
    label: string;
    url: string;
    target: string;
    children?: NavItem[];
}

export interface WebsiteConfig {
    /** Header navigation links */
    navLinks: NavItem[];
    /** Footer navigation links */
    footerLinks: NavItem[];
    /** Social media links */
    socialLinks: NavItem[];
    /** Raw key-value site settings from DB */
    settings: Record<string, unknown>;

    // ---- Convenience accessors (extracted from settings) ----
    siteName: string;
    siteTagline: string;
    siteDescription: string;
    siteUrl: string;
    logoUrl: string;
    contactEmail: string;
}
