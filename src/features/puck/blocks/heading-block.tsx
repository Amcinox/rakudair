interface HeadingBlockProps {
    text: string;
    level: "h1" | "h2" | "h3" | "h4";
    alignment: "left" | "center" | "right";
    subtitle: string;
    size: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<string, Record<string, string>> = {
    h1: {
        sm: "text-2xl md:text-3xl",
        md: "text-3xl md:text-4xl",
        lg: "text-4xl md:text-5xl",
        xl: "text-5xl md:text-6xl lg:text-7xl",
    },
    h2: {
        sm: "text-xl md:text-2xl",
        md: "text-2xl md:text-3xl",
        lg: "text-3xl md:text-4xl",
        xl: "text-4xl md:text-5xl",
    },
    h3: {
        sm: "text-lg md:text-xl",
        md: "text-xl md:text-2xl",
        lg: "text-2xl md:text-3xl",
        xl: "text-3xl md:text-4xl",
    },
    h4: {
        sm: "text-base md:text-lg",
        md: "text-lg md:text-xl",
        lg: "text-xl md:text-2xl",
        xl: "text-2xl md:text-3xl",
    },
};

const alignMap = { left: "text-left", center: "text-center", right: "text-right" };

export function HeadingBlock({
    text,
    level = "h2",
    alignment = "center",
    subtitle,
    size = "md",
}: HeadingBlockProps) {
    const Tag = level;
    const sizeClass = sizeClasses[level]?.[size] ?? sizeClasses.h2.md;
    const align = alignMap[alignment] ?? "text-center";

    return (
        <section className="py-12 md:py-16">
            <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${align}`}>
                <Tag
                    className={`font-serif font-bold text-foreground leading-tight ${sizeClass}`}
                >
                    {text || "Heading"}
                </Tag>
                {subtitle && (
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
