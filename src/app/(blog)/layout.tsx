import Link from "next/link";
import { db } from "@/lib/db";
import { navigation } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerNav = await db
        .select()
        .from(navigation)
        .where(eq(navigation.position, "header"))
        .orderBy(asc(navigation.sortOrder));

    const footerNav = await db
        .select()
        .from(navigation)
        .where(eq(navigation.position, "footer"))
        .orderBy(asc(navigation.sortOrder));

    const socialNav = await db
        .select()
        .from(navigation)
        .where(eq(navigation.position, "social"))
        .orderBy(asc(navigation.sortOrder));

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-red-700">楽</span>
                        <span className="font-bold tracking-tight">Rakuda Air</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/blog"
                            className="text-sm text-neutral-600 hover:text-red-700 transition-colors"
                        >
                            Blog
                        </Link>
                        {headerNav
                            .filter((item) => item.isVisible)
                            .map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    target={item.target as "_self" | "_blank"}
                                    className="text-sm text-neutral-600 hover:text-red-700 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1">{children}</div>

            {/* Footer */}
            <footer className="border-t bg-neutral-50">
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-3">
                                <span className="text-xl font-bold text-red-700">楽</span>
                                <span className="font-bold tracking-tight">Rakuda Air</span>
                            </Link>
                            <p className="text-sm text-neutral-500">
                                Discover Japan through authentic stories, guides, and cultural
                                insights.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Links</h4>
                            <ul className="space-y-2">
                                {footerNav
                                    .filter((item) => item.isVisible)
                                    .map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.url}
                                                target={item.target as "_self" | "_blank"}
                                                className="text-sm text-neutral-500 hover:text-red-700"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
                            <ul className="space-y-2">
                                {socialNav
                                    .filter((item) => item.isVisible)
                                    .map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-neutral-500 hover:text-red-700"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t text-center text-xs text-neutral-400">
                        © {new Date().getFullYear()} Rakuda Air. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
