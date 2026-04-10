import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pages, seoMetadata } from "@/lib/db/schema";
import { createPageSchema } from "@/lib/validations/page";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, asc, eq, ilike, count, and, SQL } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(pages.status, status as "draft" | "published"));
    if (search) conditions.push(ilike(pages.title, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [total]] = await Promise.all([
        db
            .select({
                id: pages.id,
                title: pages.title,
                slug: pages.slug,
                status: pages.status,
                template: pages.template,
                showInNav: pages.showInNav,
                locale: pages.locale,
                createdAt: pages.createdAt,
                updatedAt: pages.updatedAt,
            })
            .from(pages)
            .where(where)
            .orderBy(desc(pages.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(pages).where(where),
    ]);

    return NextResponse.json({ data: items, total: total.count, page, limit });
});

export const POST = apiRoute(async (request: NextRequest) => {
    const { userId } = await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.title, "page");

    const [pageItem] = await db
        .insert(pages)
        .values({
            title: data.title,
            slug,
            content: data.content,
            contentHtml: data.contentHtml,
            status: data.status,
            template: data.template,
            showInNav: data.showInNav,
            navOrder: data.navOrder,
            locale: data.locale,
            authorId: userId,
        })
        .returning();

    // Auto-create SEO entry
    await db.insert(seoMetadata).values({
        entityType: "page",
        entityId: pageItem.id,
        metaTitle: data.title.slice(0, 120),
    });

    return NextResponse.json({ data: pageItem }, { status: 201 });
});
