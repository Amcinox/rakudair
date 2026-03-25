import Image from "next/image";

interface LogoItem {
    src: string;
    alt: string;
    url: string;
}

interface LogoCloudBlockProps {
    heading: string;
    logos: LogoItem[];
    grayscale: boolean;
    columns: "4" | "5" | "6";
}

const colMap = {
    "4": "grid-cols-2 md:grid-cols-4",
    "5": "grid-cols-2 md:grid-cols-5",
    "6": "grid-cols-3 md:grid-cols-6",
};

export function LogoCloudBlock({
    heading,
    logos,
    grayscale = true,
    columns = "5",
}: LogoCloudBlockProps) {
    return (
        <section className="py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {heading && (
                    <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
                        {heading}
                    </p>
                )}
                <div
                    className={`grid ${colMap[columns] || colMap["5"]} gap-8 items-center justify-items-center`}
                >
                    {(logos ?? []).map((logo, i) => {
                        const img = (
                            <div
                                className={`relative h-10 w-28 ${
                                    grayscale
                                        ? "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                                        : "opacity-80 hover:opacity-100"
                                } transition-all duration-300`}
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt || "Logo"}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        );

                        if (logo.url) {
                            return (
                                <a
                                    key={i}
                                    href={logo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {img}
                                </a>
                            );
                        }
                        return <div key={i}>{img}</div>;
                    })}
                </div>
            </div>
        </section>
    );
}
