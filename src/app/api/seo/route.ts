import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoMetadata, articles, pages } from "@/lib/db/schema";
import { upsertSeoSchema } from "@/lib/validations/seo";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, eq, and, count, ilike, SQL } from "drizzle-orm";

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const entityType = searchParams.get("entityType");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (entityType) conditions.push(eq(seoMetadata.entityType, entityType));
    if (search) conditions.push(ilike(seoMetadata.metaTitle, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [total]] = await Promise.all([
        db
            .select()
            .from(seoMetadata)
            .where(where)
            .orderBy(desc(seoMetadata.updatedAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(seoMetadata).where(where),
    ]);

    // Enrich with entity titles
    const enriched = await Promise.all(
        items.map(async (item) => {
            let entityTitle = "";
            if (item.entityType === "article" && item.entityId) {
                const [a] = await db
                    .select({ title: articles.title })
                    .from(articles)
                    .where(eq(articles.id, item.entityId))
                    .limit(1);
                entityTitle = a?.title ?? "";
            } else if (item.entityType === "page" && item.entityId) {
                const [p] = await db
                    .select({ title: pages.title })
                    .from(pages)
                    .where(eq(pages.id, item.entityId))
                    .limit(1);
                entityTitle = p?.title ?? "";
            } else if (item.entityType === "global") {
                entityTitle = "Global SEO";
            }
            return { ...item, entityTitle };
        })
    );

    return NextResponse.json({ data: enriched, total: total.count, page, limit });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = upsertSeoSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Check for existing entry
    const conditions: SQL[] = [eq(seoMetadata.entityType, data.entityType)];
    if (data.entityId) {
        conditions.push(eq(seoMetadata.entityId, data.entityId));
    }

    const existing = await db
        .select({ id: seoMetadata.id })
        .from(seoMetadata)
        .where(and(...conditions))
        .limit(1);

    if (existing.length > 0) {
        // Update
        const [updated] = await db
            .update(seoMetadata)
            .set({
                metaTitle: data.metaTitle ?? null,
                metaDescription: data.metaDescription ?? null,
                metaKeywords: data.metaKeywords ?? null,
                ogTitle: data.ogTitle ?? null,
                ogDescription: data.ogDescription ?? null,
                ogImage: data.ogImage || null,
                ogType: data.ogType ?? "website",
                twitterCard: data.twitterCard ?? "summary_large_image",
                twitterTitle: data.twitterTitle ?? null,
                twitterDescription: data.twitterDescription ?? null,
                twitterImage: data.twitterImage || null,
                canonicalUrl: data.canonicalUrl || null,
                noIndex: data.noIndex,
                noFollow: data.noFollow,
                jsonLd: data.jsonLd ?? null,
            })
            .where(eq(seoMetadata.id, existing[0].id))
            .returning();

        return NextResponse.json({ data: updated });
    }

    // Create
    const [created] = await db
        .insert(seoMetadata)
        .values({
            entityType: data.entityType,
            entityId: data.entityId ?? null,
            metaTitle: data.metaTitle ?? null,
            metaDescription: data.metaDescription ?? null,
            metaKeywords: data.metaKeywords ?? null,
            ogTitle: data.ogTitle ?? null,
            ogDescription: data.ogDescription ?? null,
            ogImage: data.ogImage || null,
            ogType: data.ogType ?? "website",
            twitterCard: data.twitterCard ?? "summary_large_image",
            twitterTitle: data.twitterTitle ?? null,
            twitterDescription: data.twitterDescription ?? null,
            twitterImage: data.twitterImage || null,
            canonicalUrl: data.canonicalUrl || null,
            noIndex: data.noIndex,
            noFollow: data.noFollow,
            jsonLd: data.jsonLd ?? null,
        })
        .returning();

    return NextResponse.json({ data: created }, { status: 201 });
});
