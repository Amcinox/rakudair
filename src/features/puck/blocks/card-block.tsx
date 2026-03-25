import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardBlockProps {
    image: string;
    imageAlt: string;
    heading: string;
    description: string;
    linkText: string;
    linkUrl: string;
    style: "elevated" | "bordered" | "flat";
    alignment: "left" | "center";
}

export function CardBlock({
    image,
    imageAlt,
    heading,
    description,
    linkText,
    linkUrl,
    style = "elevated",
    alignment = "left",
}: CardBlockProps) {
    const alignCenter = alignment === "center";
    const cardClasses =
        style === "elevated"
            ? "bg-card shadow-lg border border-border/50"
            : style === "bordered"
              ? "bg-card border-2 border-border"
              : "bg-secondary/50";

    return (
        <section className="py-12 md:py-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`rounded-2xl overflow-hidden ${cardClasses} ${
                        alignCenter ? "text-center" : ""
                    }`}
                >
                    {image && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                                src={image}
                                alt={imageAlt || heading || "Card image"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="p-6 md:p-8 space-y-3">
                        {heading && (
                            <h3 className="font-serif text-2xl font-bold text-foreground">
                                {heading}
                            </h3>
                        )}
                        {description && (
                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        )}
                        {linkText && linkUrl && (
                            <Link
                                href={linkUrl}
                                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium text-sm group pt-1"
                            >
                                {linkText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
