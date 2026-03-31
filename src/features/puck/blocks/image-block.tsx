import Image from "next/image";

interface ImageBlockProps {
    src: string;
    alt: string;
    caption?: string;
    width: string;
    rounded: boolean;
}

export function ImageBlock({ src, alt, caption, width, rounded }: ImageBlockProps) {
    return (
        <section className="py-12 md:py-16">
            <div className={`${width || "max-w-5xl"} mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className={`relative aspect-video overflow-hidden ${rounded ? "rounded-2xl" : ""}`}>
                    {src ? (
                        <Image
                            src={src}
                            alt={alt || "Image"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                            <span className="text-4xl text-muted-foreground/40">画像</span>
                        </div>
                    )}
                </div>
                {caption && (
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                        {caption}
                    </p>
                )}
            </div>
        </section>
    );
}
