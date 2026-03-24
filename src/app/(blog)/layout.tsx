import { Header } from "@/features/blog/components/header";
import { Footer } from "@/features/blog/components/footer";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="blog min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
