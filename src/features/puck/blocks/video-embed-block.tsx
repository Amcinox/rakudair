"use client";

interface VideoEmbedBlockProps {
    url: string;
    aspectRatio: "16:9" | "4:3" | "1:1";
    width: "sm" | "md" | "lg" | "full";
    rounded: boolean;
    caption: string;
}

function getEmbedUrl(url: string): string | null {
    if (!url) return null;
    const ytMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    if (url.includes("/embed")) return url;
    return null;
}

const widthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    full: "max-w-7xl",
};

const aspectClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
};

export function VideoEmbedBlock({
    url,
    aspectRatio = "16:9",
    width = "md",
    rounded = true,
    caption,
}: VideoEmbedBlockProps) {
    const embedUrl = getEmbedUrl(url);

    return (
        <section className="py-12 md:py-16">
            <div
                className={`${widthClasses[width] || widthClasses.md} mx-auto px-4 sm:px-6 lg:px-8`}
            >
                <div
                    className={`relative ${aspectClasses[aspectRatio] || aspectClasses["16:9"]} overflow-hidden ${
                        rounded ? "rounded-2xl" : ""
                    } bg-muted`}
                >
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title="Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <span className="text-4xl block mb-2">▶</span>
                                <span className="text-sm">
                                    {url ? "Invalid video URL" : "Paste a YouTube or Vimeo URL"}
                                </span>
                            </div>
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
