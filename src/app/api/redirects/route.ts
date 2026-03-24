import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redirects } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, eq, count } from "drizzle-orm";
import { z } from "zod/v4";

const createRedirectSchema = z.object({
    fromPath: z.string().min(1),
    toPath: z.string().min(1),
    type: z.number().int().refine((v) => v === 301 || v === 302),
    isActive: z.boolean().default(true),
});

export const GET = apiRoute(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = (page - 1) * limit;

    const [items, [total]] = await Promise.all([
        db
            .select()
            .from(redirects)
            .orderBy(desc(redirects.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(redirects),
    ]);

    return NextResponse.json({ data: items, total: total.count, page, limit });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const body = await request.json();
    const parsed = createRedirectSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const [item] = await db
        .insert(redirects)
        .values({
            fromPath: parsed.data.fromPath,
            toPath: parsed.data.toPath,
            type: parsed.data.type,
            isActive: parsed.data.isActive,
        })
        .returning();

    return NextResponse.json({ data: item }, { status: 201 });
});
