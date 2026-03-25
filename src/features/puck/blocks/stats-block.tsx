interface StatItem {
    value: string;
    label: string;
    prefix: string;
    suffix: string;
}

interface StatsBlockProps {
    heading: string;
    description: string;
    items: StatItem[];
    style: "default" | "cards" | "minimal";
}

export function StatsBlock({
    heading,
    description,
    items,
    style = "default",
}: StatsBlockProps) {
    return (
        <section className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(heading || description) && (
                    <div className="text-center mb-12">
                        {heading && (
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {heading}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {(items ?? []).map((stat, i) => (
                        <div
                            key={i}
                            className={`text-center ${
                                style === "cards"
                                    ? "bg-card rounded-2xl p-6 border border-border"
                                    : style === "minimal"
                                      ? "py-4"
                                      : "p-4"
                            }`}
                        >
                            <div className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                                {stat.prefix}
                                {stat.value}
                                {stat.suffix}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
