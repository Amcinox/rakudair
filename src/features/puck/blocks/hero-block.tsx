import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBlockProps {
    badgeText: string;
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    heroImage: string;
    heroImageAlt: string;
}

export function HeroBlock({
    badgeText,
    title,
    titleHighlight,
    titleSuffix,
    description,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
    heroImage,
    heroImageAlt,
}: HeroBlockProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20">
            <div className="absolute inset-0 z-0">
                {heroImage && (
                    <Image
                        src={heroImage}
                        alt={heroImageAlt}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {badgeText && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm text-primary font-medium">
                            {badgeText}
                        </span>
                    </div>
                )}

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
                    {title}
                    <br />
                    <span className="text-primary">{titleHighlight}</span>
                    {titleSuffix}
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {ctaText && (
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            asChild
                        >
                            <Link href={ctaLink || "#"}>
                                {ctaText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                    {secondaryCtaText && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-foreground/20"
                            asChild
                        >
                            <Link href={secondaryCtaLink || "#"}>
                                {secondaryCtaText}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
                <span className="text-sm">スクロール</span>
                <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2">
                    <div className="w-1.5 h-3 rounded-full bg-muted-foreground animate-bounce" />
                </div>
            </div>
        </section>
    );
}
