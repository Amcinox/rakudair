import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages, seoMetadata } from "@/lib/db/schema";
import { updatePageSchema } from "@/lib/validations/page";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq, and } from "drizzle-orm";

export const GET = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const page = await db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { seo: true },
    });

    if (!page) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: page });
});

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = updatePageSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;

    const [updated] = await db
        .update(pages)
        .set({
            ...(data.title !== undefined && { title: data.title }),
            ...(data.slug !== undefined && { slug: data.slug }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.contentHtml !== undefined && { contentHtml: data.contentHtml }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.template !== undefined && { template: data.template }),
            ...(data.showInNav !== undefined && { showInNav: data.showInNav }),
            ...(data.navOrder !== undefined && { navOrder: data.navOrder }),
            ...(data.locale !== undefined && { locale: data.locale }),
        })
        .where(eq(pages.id, id))
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

    // Prevent deletion of the landing page
    const page = await db.query.pages.findFirst({ where: eq(pages.id, id) });
    if (page?.slug === "home") {
        return NextResponse.json(
            { error: "ランディングページは削除できません" },
            { status: 403 },
        );
    }

    // Delete related SEO
    await db
        .delete(seoMetadata)
        .where(
            and(eq(seoMetadata.entityType, "page"), eq(seoMetadata.entityId, id))
        );

    const [deleted] = await db
        .delete(pages)
        .where(eq(pages.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
