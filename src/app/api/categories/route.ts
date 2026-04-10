import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { createCategorySchema } from "@/lib/validations/category";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { asc } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";

export const GET = apiRoute(async () => {
    const result = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder), asc(categories.name));

    return NextResponse.json({ data: result });
});

export const POST = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin", "editor"]);

    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 }
        );
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.name, "category");

    const [category] = await db
        .insert(categories)
        .values({
            name: data.name,
            slug,
            description: data.description,
            color: data.color,
            icon: data.icon,
            sortOrder: data.sortOrder,
        })
        .returning();

    return NextResponse.json({ data: category }, { status: 201 });
});
