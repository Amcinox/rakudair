export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoMetadata } from "@/lib/db/schema";
import { upsertSeoSchema } from "@/lib/validations/seo";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";

export const GET = apiRoute(async (_request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const [item] = await db
        .select()
        .from(seoMetadata)
        .where(eq(seoMetadata.id, id))
        .limit(1);

    if (!item) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
});

export const PATCH = apiRoute(async (request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = upsertSeoSchema.partial().safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;

    const [updated] = await db
        .update(seoMetadata)
        .set({
            ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle ?? null }),
            ...(data.metaDescription !== undefined && {
                metaDescription: data.metaDescription ?? null,
            }),
            ...(data.metaKeywords !== undefined && {
                metaKeywords: data.metaKeywords ?? null,
            }),
            ...(data.ogTitle !== undefined && { ogTitle: data.ogTitle ?? null }),
            ...(data.ogDescription !== undefined && {
                ogDescription: data.ogDescription ?? null,
            }),
            ...(data.ogImage !== undefined && { ogImage: data.ogImage || null }),
            ...(data.ogType !== undefined && { ogType: data.ogType ?? "website" }),
            ...(data.twitterCard !== undefined && {
                twitterCard: data.twitterCard ?? "summary_large_image",
            }),
            ...(data.twitterTitle !== undefined && {
                twitterTitle: data.twitterTitle ?? null,
            }),
            ...(data.twitterDescription !== undefined && {
                twitterDescription: data.twitterDescription ?? null,
            }),
            ...(data.twitterImage !== undefined && {
                twitterImage: data.twitterImage || null,
            }),
            ...(data.canonicalUrl !== undefined && {
                canonicalUrl: data.canonicalUrl || null,
            }),
            ...(data.noIndex !== undefined && { noIndex: data.noIndex }),
            ...(data.noFollow !== undefined && { noFollow: data.noFollow }),
            ...(data.jsonLd !== undefined && { jsonLd: data.jsonLd ?? null }),
        })
        .where(eq(seoMetadata.id, id))
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
        .delete(seoMetadata)
        .where(eq(seoMetadata.id, id))
        .returning();

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
});
