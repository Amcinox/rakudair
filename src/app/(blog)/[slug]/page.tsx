import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { pages, seoMetadata } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Try published first, then any status for authenticated preview
    let [page] = await db
        .select({ title: pages.title, id: pages.id, status: pages.status })
        .from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
        .limit(1);

    if (!page) {
        const { userId } = await auth();
        if (userId) {
            [page] = await db
                .select({ title: pages.title, id: pages.id, status: pages.status })
                .from(pages)
                .where(eq(pages.slug, slug))
                .limit(1);
        }
    }

    if (!page) return { title: "Not Found" };

    const [seo] = await db
        .select()
        .from(seoMetadata)
        .where(
            and(
                eq(seoMetadata.entityType, "page"),
                eq(seoMetadata.entityId, page.id)
            )
        )
        .limit(1);

    return {
        title: seo?.metaTitle ?? page.title,
        description: seo?.metaDescription ?? "",
        openGraph: {
            title: seo?.ogTitle ?? seo?.metaTitle ?? page.title,
            description: seo?.ogDescription ?? seo?.metaDescription ?? "",
        },
        ...(seo?.noIndex || seo?.noFollow
            ? {
                robots: {
                    index: !seo?.noIndex,
                    follow: !seo?.noFollow,
                },
            }
            : {}),
    };
}

export default async function StaticPage({ params }: Props) {
    const { slug } = await params;

    // Try published first
    let [page] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
        .limit(1);

    let isPreview = false;

    // If not published, check for draft + auth
    if (!page) {
        const { userId } = await auth();
        if (!userId) notFound();

        [page] = await db
            .select()
            .from(pages)
            .where(eq(pages.slug, slug))
            .limit(1);

        if (!page) notFound();
        isPreview = true;
    }

    return (
        <main className="min-h-screen pt-20">
            {isPreview && (
                <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
                    プレビューモード — このページはまだ公開されていません (Status: {page.status})
                </div>
            )}
            <section className="py-12 md:py-16">
                <div
                    className={
                        page.template === "full-width"
                            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                            : "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
                    }
                >
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                        {page.title}
                    </h1>
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: page.contentHtml ?? "" }}
                    />
                </div>
            </section>
        </main>
    );
}
