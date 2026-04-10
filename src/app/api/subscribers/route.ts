export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, eq, count, and, SQL } from "drizzle-orm";
import { z } from "zod/v4";

const subscribeSchema = z.object({
    email: z.email(),
    name: z.string().max(100).optional(),
});

// Public POST — subscribe
export const POST = apiRoute(async (request: NextRequest) => {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
        );
    }

    // Check if already subscribed
    const [existing] = await db
        .select({ id: subscribers.id, status: subscribers.status })
        .from(subscribers)
        .where(eq(subscribers.email, parsed.data.email))
        .limit(1);

    if (existing) {
        if (existing.status === "unsubscribed") {
            // Re-subscribe
            await db
                .update(subscribers)
                .set({ status: "active" })
                .where(eq(subscribers.id, existing.id));
            return NextResponse.json({ message: "Re-subscribed successfully" });
        }
        return NextResponse.json({ message: "Already subscribed" });
    }

    await db.insert(subscribers).values({
        email: parsed.data.email,
        name: parsed.data.name ?? null,
    });

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
});

// Protected GET — list subscribers (dashboard)
export const GET = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(subscribers.status, status as "active" | "unsubscribed"));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [total]] = await Promise.all([
        db
            .select()
            .from(subscribers)
            .where(where)
            .orderBy(desc(subscribers.subscribedAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(subscribers).where(where),
    ]);

    return NextResponse.json({ data: items, total: total.count, page, limit });
});
