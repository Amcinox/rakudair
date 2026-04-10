import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navigation } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { revalidateTag } from "next/cache";

const updateNavSchema = z.object({
    label: z.string().min(1).max(100).optional(),
    url: z.string().min(1).optional(),
    target: z.enum(["_self", "_blank"]).optional(),
    position: z.enum(["header", "footer", "social"]).optional(),
    sortOrder: z.number().int().optional(),
    parentId: z.string().uuid().optional().nullable(),
    pageId: z.string().uuid().optional().nullable(),
    isVisible: z.boolean().optional(),
});

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin"]);

    const body = await request.json();
    const parsed = updateNavSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const [updated] = await db
        .update(navigation)
        .set(parsed.data)
        .where(eq(navigation.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateTag("website-config", "max");
    return NextResponse.json({ data: updated });
});

export const DELETE = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin"]);

    const [deleted] = await db
        .delete(navigation)
        .where(eq(navigation.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateTag("website-config", "max");
    return NextResponse.json({ data: deleted });
});
