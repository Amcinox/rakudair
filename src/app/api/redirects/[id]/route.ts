export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redirects } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const updateRedirectSchema = z.object({
    fromPath: z.string().min(1).optional(),
    toPath: z.string().min(1).optional(),
    type: z.number().int().refine((v) => v === 301 || v === 302).optional(),
    isActive: z.boolean().optional(),
});

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin"]);

    const body = await request.json();
    const parsed = updateRedirectSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const [updated] = await db
        .update(redirects)
        .set(parsed.data)
        .where(eq(redirects.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
});

export const DELETE = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin"]);

    const [deleted] = await db
        .delete(redirects)
        .where(eq(redirects.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
