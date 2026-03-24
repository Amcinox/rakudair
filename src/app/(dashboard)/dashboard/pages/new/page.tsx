import { PageForm } from "@/features/pages/components/page-form";

export default function NewPagePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>New Page</h2>
                <p className="text-muted-foreground">Create a new page.</p>
            </div>
            <PageForm />
        </div>
    );
}
