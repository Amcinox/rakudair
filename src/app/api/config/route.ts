export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getWebsiteConfig } from "@/lib/config/get-website-config";
import { apiRoute } from "@/lib/api-utils";

/**
 * GET /api/config
 *
 * Returns the full website configuration (navigation items + settings).
 * Public endpoint — used by React Query on the client to keep
 * config in sync. The underlying `getWebsiteConfig()` is cached
 * via `"use cache"` so this won't hit DB on every request.
 */
export const GET = apiRoute(async () => {
    const config = await getWebsiteConfig();
    return NextResponse.json(config);
});
