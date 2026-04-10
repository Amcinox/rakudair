export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, count } from "drizzle-orm";

export const GET = apiRoute(async (request: NextRequest) => {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "30");
    const offset = (page - 1) * limit;

    const [items, [total]] = await Promise.all([
        db
            .select()
            .from(media)
            .orderBy(desc(media.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(media),
    ]);

    return NextResponse.json({
        data: items,
        total: total.count,
        page,
        limit,
    });
});

export const POST = apiRoute(async (request: NextRequest) => {
    const userId = await requireAuth();
    const body = await request.json();

    const [item] = await db
        .insert(media)
        .values({
            url: body.url,
            key: body.key,
            filename: body.filename,
            mimeType: body.mimeType,
            size: body.size,
            width: body.width,
            height: body.height,
            altText: body.altText ?? null,
            uploadedBy: userId,
        })
        .returning();

    return NextResponse.json({ data: item }, { status: 201 });
});
