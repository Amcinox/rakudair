import Image from "next/image";
import Link from "next/link";

interface FeaturedPostProps {
    slug: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    categoryName?: string | null;
    publishedAt?: Date | null;
    readingTime?: number | null;
}

export function FeaturedPost({
    slug,
    title,
    excerpt,
    coverImage,
    categoryName,
    publishedAt,
    readingTime,
}: FeaturedPostProps) {
    const formattedDate = publishedAt
        ? publishedAt.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;

    return (
        <Link href={`/blog/${slug}`}>
            <article className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-2xl">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px]">
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt={title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                <span className="text-8xl text-muted-foreground/30">旅</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 hidden md:block" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 mb-4">
                            {categoryName && (
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    {categoryName}
                                </span>
                            )}
                            {formattedDate && (
                                <span className="text-muted-foreground text-sm">
                                    {formattedDate}
                                </span>
                            )}
                        </div>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {excerpt}
                            </p>
                        )}
                        <div className="flex items-center gap-4">
                            {readingTime && (
                                <span className="text-sm text-muted-foreground">
                                    読了時間: {readingTime}分
                                </span>
                            )}
                            <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                続きを読む
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
