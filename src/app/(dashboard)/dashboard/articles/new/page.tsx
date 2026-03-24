import { ArticleForm } from "@/features/articles/components/article-form";

export default function NewArticlePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>New Article</h2>
                <p className="text-muted-foreground">Create a new blog article.</p>
            </div>
            <ArticleForm />
        </div>
    );
}
