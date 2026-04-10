export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin"]);

    const body = await request.json();
    const status = body.status;

    if (!["active", "unsubscribed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [updated] = await db
        .update(subscribers)
        .set({
            status,
            ...(status === "unsubscribed" ? { unsubscribedAt: new Date() } : {}),
        })
        .where(eq(subscribers.id, id))
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
        .delete(subscribers)
        .where(eq(subscribers.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
