import { PageForm } from "@/features/pages/components/page-form";

export default async function NewPagePage({
    searchParams,
}: {
    searchParams: Promise<{ slug?: string; title?: string }>;
}) {
    const params = await searchParams;

    const isLanding = params.slug === "home";

    return (
        <div className="space-y-6">
            <div>
                <h2
                    className="text-2xl font-bold tracking-tight gold-gradient-text"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                >
                    {isLanding ? "Setup Landing Page" : "New Page"}
                </h2>
                <p className="text-muted-foreground">
                    {isLanding
                        ? "Configure the landing page (homepage). This page cannot be deleted once created."
                        : "Create a new page."}
                </p>
            </div>
            <PageForm initialSlug={params.slug} initialTitle={params.title} />
        </div>
    );
}
