import { PageForm } from "@/features/pages/components/page-form";

export default async function EditPagePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Page</h2>
            </div>
            <PageForm pageId={id} />
        </div>
    );
}
