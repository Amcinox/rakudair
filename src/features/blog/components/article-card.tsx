import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    categoryName?: string | null;
    publishedAt?: Date | null;
    readingTime?: number | null;
    /** Minimal variant shows only image + title (for related posts) */
    variant?: "default" | "minimal";
}

export function ArticleCard({
    slug,
    title,
    excerpt,
    coverImage,
    categoryName,
    publishedAt,
    readingTime,
    variant = "default",
}: ArticleCardProps) {
    const formattedDate = publishedAt
        ? publishedAt.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;

    return (
        <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl">
            <Link href={`/blog/${slug}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                            <span className="text-6xl text-muted-foreground/30">旅</span>
                        </div>
                    )}
                    {categoryName && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-background/90 text-foreground text-xs font-medium">
                                {categoryName}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    {variant === "default" && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                            {formattedDate && <span>{formattedDate}</span>}
                            {formattedDate && readingTime && <span>•</span>}
                            {readingTime && <span>{readingTime}分</span>}
                        </div>
                    )}
                    <h3
                        className={`font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${variant === "minimal" ? "text-lg" : "text-xl mb-3"
                            }`}
                    >
                        {title}
                    </h3>
                    {variant === "default" && excerpt && (
                        <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
                    )}
                </div>
            </Link>
        </article>
    );
}
