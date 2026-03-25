interface RichTextBlockProps {
    html: string;
}

export function RichTextBlock({ html }: RichTextBlockProps) {
    return (
        <section className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: html ?? "" }}
                />
            </div>
        </section>
    );
}
