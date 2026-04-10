export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { navigation } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { revalidateTag } from "next/cache";

const reorderItemSchema = z.object({
    id: z.string().uuid(),
    sortOrder: z.number().int(),
    parentId: z.string().uuid().nullable(),
});

const reorderSchema = z.array(reorderItemSchema);

export const PUT = apiRoute(async (request: NextRequest) => {
    await requireRole(["admin"]);

    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validation failed", details: parsed.error.issues },
            { status: 400 },
        );
    }

    // Update each item's sortOrder and parentId
    await Promise.all(
        parsed.data.map((item) =>
            db
                .update(navigation)
                .set({ sortOrder: item.sortOrder, parentId: item.parentId })
                .where(eq(navigation.id, item.id)),
        ),
    );

    revalidateTag("website-config", "max");
    return NextResponse.json({ success: true });
});
