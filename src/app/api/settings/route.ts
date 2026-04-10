export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { revalidateTag } from "next/cache";

const upsertSettingSchema = z.object({
    key: z.string().min(1).max(100),
    value: z.unknown(),
});

export const GET = apiRoute(async () => {
    const items = await db.select().from(siteSettings);

    // Return as key-value map
    const map: Record<string, unknown> = {};
    for (const item of items) {
        map[item.key] = item.value;
    }

    return NextResponse.json({ data: map });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const body = await request.json();

    // Accept single setting or batch
    if (Array.isArray(body)) {
        for (const item of body) {
            const parsed = upsertSettingSchema.safeParse(item);
            if (!parsed.success) continue;

            const existing = await db
                .select({ id: siteSettings.id })
                .from(siteSettings)
                .where(eq(siteSettings.key, parsed.data.key))
                .limit(1);

            if (existing.length > 0) {
                await db
                    .update(siteSettings)
                    .set({ value: parsed.data.value })
                    .where(eq(siteSettings.key, parsed.data.key));
            } else {
                await db.insert(siteSettings).values({
                    key: parsed.data.key,
                    value: parsed.data.value,
                });
            }
        }

        revalidateTag("website-config", "max");
        return NextResponse.json({ message: "Settings updated" });
    }

    const parsed = upsertSettingSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const existing = await db
        .select({ id: siteSettings.id })
        .from(siteSettings)
        .where(eq(siteSettings.key, parsed.data.key))
        .limit(1);

    if (existing.length > 0) {
        await db
            .update(siteSettings)
            .set({ value: parsed.data.value })
            .where(eq(siteSettings.key, parsed.data.key));
    } else {
        await db.insert(siteSettings).values({
            key: parsed.data.key,
            value: parsed.data.value,
        });
    }

    revalidateTag("website-config", "max");
    return NextResponse.json({ message: "Setting saved" });
});
