import { PageForm } from "@/features/pages/components/page-form";

export default function NewPagePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">New Page</h2>
                <p className="text-neutral-500">Create a new page.</p>
            </div>
            <PageForm />
        </div>
    );
}
