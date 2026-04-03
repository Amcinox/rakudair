import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialsBlockProps {
    heading: string;
    description: string;
    items: {
        name: string;
        role: string;
        content: string;
        rating: number;
        avatar?: string;
    }[];
}

export function TestimonialsBlock({
    heading,
    description,
    items,
}: TestimonialsBlockProps) {
    return (
        <section className="py-20 md:py-32 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                        {heading}
                    </h2>
                    <div
                        className="prose prose-invert prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground max-w-2xl mx-auto [&>*]:text-center"
                        dangerouslySetInnerHTML={{ __html: description ?? "" }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(items ?? []).map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-current text-accent"
                                    />
                                ))}
                            </div>
                            <div className="text-primary-foreground/90 mb-6 leading-relaxed prose prose-sm prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: testimonial.content ?? "" }}
                            />
                            <div className="flex items-center gap-3">
                                {testimonial.avatar && (
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/20 shrink-0">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold">{testimonial.name}</p>
                                    <p className="text-primary-foreground/70 text-sm">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
