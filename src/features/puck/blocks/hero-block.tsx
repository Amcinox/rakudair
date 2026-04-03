import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Play, Download, Mail, Info, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroButton {
    text: string;
    link: string;
    variant: "default" | "outline" | "secondary" | "ghost";
    icon: "none" | "arrow" | "external" | "play" | "download" | "mail" | "info" | "star" | "check";
}

interface HeroBlockProps {
    badgeText: string;
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    buttons: HeroButton[];
    heroImage: string;
    heroImageAlt: string;
}

const iconComponents = {
    none: null,
    arrow: ArrowRight,
    external: ExternalLink,
    play: Play,
    download: Download,
    mail: Mail,
    info: Info,
    star: Star,
    check: Check,
};

export function HeroBlock({
    badgeText,
    title,
    titleHighlight,
    titleSuffix,
    description,
    buttons,
    heroImage,
    heroImageAlt,
}: HeroBlockProps) {
    const renderButtons = buttons && buttons.length > 0 ? buttons : [];

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

                <div
                    className="prose prose-lg dark:prose-invert prose-p:text-muted-foreground prose-strong:text-foreground max-w-2xl mx-auto mb-10 text-center [&>*]:mx-auto"
                    dangerouslySetInnerHTML={{ __html: description ?? "" }}
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {renderButtons.map((btn, i) => {
                        const Icon = iconComponents[btn.icon as keyof typeof iconComponents];
                        return (
                            <Button
                                key={i}
                                size="lg"
                                variant={btn.variant || "default"}
                                className={btn.variant === "default" && !btn.icon ? "bg-primary hover:bg-primary/90 text-primary-foreground px-8" : btn.variant === "outline" ? "border-foreground/20" : ""}
                                asChild
                            >
                                <Link href={btn.link || "#"}>
                                    {btn.text}
                                    {Icon && <Icon className="ml-2 h-5 w-5" />}
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
