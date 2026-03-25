import { getWebsiteConfig } from "@/lib/config/get-website-config";
import { WebsiteConfigProvider } from "@/lib/config";
import { Header } from "@/features/blog/components/header";
import { Footer } from "@/features/blog/components/footer";
import { DesertWaves } from "@/components/blog/desert-waves";

export default async function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const config = await getWebsiteConfig();

    return (
        <WebsiteConfigProvider config={config}>
            <div className="blog min-h-screen flex flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                <DesertWaves />
                <Footer />
            </div>
        </WebsiteConfigProvider>
    );
}
