import { ArticleForm } from "@/features/articles/components/article-form";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Edit Article</h2>
            </div>
            <ArticleForm articleId={id} />
        </div>
    );
}
