import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Data } from "@puckeditor/core";
import { PuckRenderer } from "@/features/puck/puck-renderer";
import { defaultLandingData } from "@/features/puck/default-landing-data";

export default async function HomePage() {
    // Try to load the landing page (slug = "home") from DB
    const [landingPage] = await db
        .select({ content: pages.content })
        .from(pages)
        .where(and(eq(pages.slug, "home"), eq(pages.status, "published")))
        .limit(1);

    const puckData =
        landingPage?.content &&
            typeof landingPage.content === "object" &&
            "content" in (landingPage.content as Record<string, unknown>)
            ? (landingPage.content as Data)
            : defaultLandingData;

    return (
        <main className="min-h-screen">
            <PuckRenderer data={puckData} />
        </main>
    );
}
