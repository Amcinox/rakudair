import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { contactFormSchema } from "@/lib/validations/contact";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { desc, eq, count, and, SQL } from "drizzle-orm";

// Public POST — submit contact form
export const POST = apiRoute(async (request: NextRequest) => {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    await db.insert(contactSubmissions).values({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
    });

    return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 201 }
    );
});

// Protected GET — list messages (dashboard)
export const GET = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(contactSubmissions.status, status as "new" | "read" | "replied"));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [total]] = await Promise.all([
        db
            .select()
            .from(contactSubmissions)
            .where(where)
            .orderBy(desc(contactSubmissions.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ count: count() }).from(contactSubmissions).where(where),
    ]);

    return NextResponse.json({ data: items, total: total.count, page, limit });
});
