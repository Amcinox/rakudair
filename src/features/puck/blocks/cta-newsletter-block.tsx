import Image from "next/image";
import { NewsletterForm } from "@/features/blog/components/newsletter-form";

interface CtaNewsletterBlockProps {
    logoUrl: string;
    logoAlt: string;
    title: string;
    description: string;
}

export function CtaNewsletterBlock({
    logoUrl,
    logoAlt,
    title,
    description,
}: CtaNewsletterBlockProps) {
    return (
        <section className="py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {logoUrl && (
                    <div className="relative w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/20">
                        <Image
                            src={logoUrl}
                            alt={logoAlt || "Logo"}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                    {description}
                </p>
                <NewsletterForm variant="inline" />
            </div>
        </section>
    );
}
