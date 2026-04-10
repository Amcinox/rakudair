export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";

export const DELETE = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    await requireRole(["admin", "editor"]);
    const { id } = await params;

    const [deleted] = await db
        .delete(media)
        .where(eq(media.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
