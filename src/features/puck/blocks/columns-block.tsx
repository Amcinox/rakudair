import Image from "next/image";

interface ColumnItem {
    heading: string;
    content: string;
    image: string;
    imageAlt: string;
}

interface ColumnsBlockProps {
    columns: ColumnItem[];
    layout: "2" | "3" | "4";
    gap: "sm" | "md" | "lg";
    verticalAlign: "top" | "center" | "bottom";
}

const gridCols = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
};

const gapSizes = {
    sm: "gap-4",
    md: "gap-6 md:gap-8",
    lg: "gap-8 md:gap-12",
};

const vAlignMap = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
};

export function ColumnsBlock({
    columns,
    layout = "2",
    gap = "md",
    verticalAlign = "top",
}: ColumnsBlockProps) {
    return (
        <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`grid grid-cols-1 ${gridCols[layout] || gridCols["2"]} ${gapSizes[gap] || gapSizes.md} ${vAlignMap[verticalAlign] || ""}`}
                >
                    {(columns ?? []).map((col, i) => (
                        <div key={i} className="space-y-4">
                            {col.image && (
                                <div className="relative aspect-video rounded-xl overflow-hidden">
                                    <Image
                                        src={col.image}
                                        alt={col.imageAlt || col.heading || "Column image"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {col.heading && (
                                <h3 className="font-serif text-xl font-bold text-foreground">
                                    {col.heading}
                                </h3>
                            )}
                            {col.content && (
                                <div
                                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary"
                                    dangerouslySetInnerHTML={{ __html: col.content }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
