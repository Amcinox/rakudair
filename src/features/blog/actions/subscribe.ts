"use server";

import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function subscribeToNewsletter(email: string) {
    try {
        // Check if already subscribed
        const [existing] = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.email, email))
            .limit(1);

        if (existing) {
            if (existing.status === "active") {
                return { success: false, message: "すでに登録されています。" };
            }
            // Re-activate
            await db
                .update(subscribers)
                .set({ status: "active", unsubscribedAt: null })
                .where(eq(subscribers.id, existing.id));

            return { success: true, message: "再登録しました！" };
        }

        await db.insert(subscribers).values({
            email,
            source: "blog",
        });

        return { success: true, message: "登録ありがとうございます！" };
    } catch {
        return { success: false, message: "エラーが発生しました。もう一度お試しください。" };
    }
}
