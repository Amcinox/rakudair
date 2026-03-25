import Link from "next/link";
import { ArrowRight, Info, AlertTriangle, CheckCircle, Bell } from "lucide-react";

interface BannerBlockProps {
    text: string;
    linkText: string;
    linkUrl: string;
    variant: "info" | "success" | "warning" | "accent";
    dismissible: boolean;
    icon: "info" | "bell" | "check" | "warning" | "none";
}

const variantStyles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    success:
        "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
    warning:
        "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    accent: "bg-primary/5 border-primary/20 text-foreground",
};

const iconMap = {
    info: Info,
    bell: Bell,
    check: CheckCircle,
    warning: AlertTriangle,
    none: null,
};

export function BannerBlock({
    text,
    linkText,
    linkUrl,
    variant = "info",
    icon = "info",
}: BannerBlockProps) {
    const Icon = iconMap[icon];

    return (
        <section className="py-4 md:py-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`rounded-xl border px-5 py-4 flex items-center gap-3 ${variantStyles[variant] || variantStyles.info}`}
                >
                    {Icon && <Icon className="w-5 h-5 shrink-0 opacity-80" />}
                    <p className="flex-1 text-sm font-medium">{text || "Banner text"}</p>
                    {linkText && linkUrl && (
                        <Link
                            href={linkUrl}
                            className="inline-flex items-center gap-1 text-sm font-semibold shrink-0 hover:opacity-80 transition-opacity"
                        >
                            {linkText}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
