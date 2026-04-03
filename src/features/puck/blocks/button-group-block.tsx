import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Play, Download, Mail, Info, Star, Check } from "lucide-react";

interface ButtonItem {
    text: string;
    link: string;
    variant: "default" | "outline" | "secondary" | "ghost" | "destructive";
    size: "sm" | "default" | "lg";
    icon: "none" | "arrow" | "external" | "play" | "download" | "mail" | "info" | "star" | "check";
}

interface ButtonGroupBlockProps {
    buttons: ButtonItem[];
    alignment: "left" | "center" | "right";
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

export function ButtonGroupBlock({
    buttons,
    alignment = "center",
}: ButtonGroupBlockProps) {
    const alignClass =
        alignment === "left"
            ? "justify-start"
            : alignment === "right"
              ? "justify-end"
              : "justify-center";

    return (
        <section className="py-8 md:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-wrap gap-3 ${alignClass}`}>
                    {(buttons ?? []).map((btn, i) => {
                        const Icon = iconComponents[btn.icon];
                        return (
                            <Button
                                key={i}
                                variant={btn.variant || "default"}
                                size={btn.size || "default"}
                                asChild
                            >
                                <Link href={btn.link || "#"}>
                                    {btn.text || "Button"}
                                    {Icon && <Icon className="ml-2 h-4 w-4" />}
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
