import { db } from "@/lib/db";
import { navigation, siteSettings } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { WebsiteConfig, NavItem } from "./types";

/**
 * Fetches the full website configuration (navigation + settings) from DB.
 *
 * Cached with Next.js Cache Components (`"use cache"`) and tagged
 * `"website-config"` so it can be revalidated on-demand when settings
 * or navigation are edited in the dashboard.
 *
 * Because the result is cached, multiple server components that call this
 * function within the same (or subsequent) request(s) will reuse the
 * cached value instead of hitting the database repeatedly.
 */
export async function getWebsiteConfig(): Promise<WebsiteConfig> {
    "use cache";
    cacheLife("minutes");
    cacheTag("website-config");

    // Parallel DB fetches
    const [navItems, allSettings] = await Promise.all([
        db
            .select({
                id: navigation.id,
                label: navigation.label,
                url: navigation.url,
                target: navigation.target,
                position: navigation.position,
                sortOrder: navigation.sortOrder,
            })
            .from(navigation)
            .where(eq(navigation.isVisible, true))
            .orderBy(asc(navigation.sortOrder)),

        db.select().from(siteSettings),
    ]);

    // Split navigation by position
    const headerLinks: NavItem[] = navItems
        .filter((n) => n.position === "header")
        .map(({ id, label, url, target }) => ({ id, label, url, target }));

    const footerLinks: NavItem[] = navItems
        .filter((n) => n.position === "footer")
        .map(({ id, label, url, target }) => ({ id, label, url, target }));

    const socialLinks: NavItem[] = navItems
        .filter((n) => n.position === "social")
        .map(({ id, label, url, target }) => ({ id, label, url, target }));

    // Build settings map
    const settings: Record<string, unknown> = {};
    for (const s of allSettings) {
        settings[s.key] = s.value;
    }

    // Extract convenience values
    const siteName = (settings.siteName as string) || "Rakudair";
    const siteTagline = (settings.siteTagline as string) || "ラクダイル";
    const siteDescription =
        (settings.siteDescription as string) ||
        "砂漠の風に導かれ、未知なる冒険へ。世界中の美しい場所をお届けします。";
    const siteUrl = (settings.siteUrl as string) || "https://www.rakudair.com";
    const logoUrl = (settings.logoUrl as string) || "/logo.jpg";
    const contactEmail = (settings.contactEmail as string) || "";

    return {
        navLinks: headerLinks,
        footerLinks,
        socialLinks,
        settings,
        siteName,
        siteTagline,
        siteDescription,
        siteUrl,
        logoUrl,
        contactEmail,
    };
}
