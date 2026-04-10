export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navigation } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq, asc } from "drizzle-orm";
import { z } from "zod/v4";
import { revalidateTag } from "next/cache";

const createNavSchema = z.object({
    label: z.string().min(1).max(100),
    url: z.string().min(1),
    target: z.enum(["_self", "_blank"]).default("_self"),
    position: z.enum(["header", "footer", "social"]).default("header"),
    sortOrder: z.number().int().default(0),
    parentId: z.string().uuid().optional().nullable(),
    pageId: z.string().uuid().optional().nullable(),
    isVisible: z.boolean().default(true),
});

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    const items = position
        ? await db
            .select()
            .from(navigation)
            .where(eq(navigation.position, position as "header" | "footer" | "social"))
            .orderBy(asc(navigation.sortOrder))
        : await db.select().from(navigation).orderBy(asc(navigation.sortOrder));

    return NextResponse.json({ data: items });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const body = await request.json();
    const parsed = createNavSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const [item] = await db
        .insert(navigation)
        .values({
            label: parsed.data.label,
            url: parsed.data.url,
            target: parsed.data.target,
            position: parsed.data.position,
            sortOrder: parsed.data.sortOrder,
            parentId: parsed.data.parentId ?? null,
            pageId: parsed.data.pageId ?? null,
            isVisible: parsed.data.isVisible,
        })
        .returning();

    revalidateTag("website-config", "max");
    return NextResponse.json({ data: item }, { status: 201 });
});
