import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { updateTagSchema } from "@/lib/validations/tag";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    await requireRole(["admin", "editor"]);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateTagSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    if (data.name && !data.slug) {
        data.slug = generateSlug(data.name, "tag");
    }

    const [updated] = await db
        .update(tags)
        .set(data)
        .where(eq(tags.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
});

export const DELETE = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    await requireRole(["admin"]);

    const { id } = await params;

    const [deleted] = await db
        .delete(tags)
        .where(eq(tags.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
