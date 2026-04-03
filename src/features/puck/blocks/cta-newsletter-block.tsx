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
                    <div className="flex justify-center mb-8">
                        <div className="relative h-14 w-52">
                            <Image
                                src={logoUrl}
                                alt={logoAlt || "Logo"}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {title}
                </h2>
                <div
                    className="prose prose-neutral dark:prose-invert prose-p:text-muted-foreground prose-strong:text-foreground text-lg mb-10 max-w-2xl mx-auto [&>*]:text-center"
                    dangerouslySetInnerHTML={{ __html: description ?? "" }}
                />
                <NewsletterForm variant="inline" />
            </div>
        </section>
    );
}
