import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { pages, seoMetadata } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const [page] = await db
        .select({ title: pages.title, id: pages.id })
        .from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
        .limit(1);

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

    const [page] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
        .limit(1);

    if (!page) notFound();

    return (
        <main
            className={
                page.template === "full-width"
                    ? "px-4 py-12"
                    : "mx-auto max-w-3xl px-4 py-12"
            }
        >
            <h1 className="text-4xl font-bold tracking-tight mb-8">{page.title}</h1>
            <div
                className="prose prose-lg prose-neutral mx-auto prose-headings:font-bold prose-a:text-red-700 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: page.contentHtml ?? "" }}
            />
        </main>
    );
}
