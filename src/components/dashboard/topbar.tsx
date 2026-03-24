"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/articles": "Articles",
    "/dashboard/articles/new": "New Article",
    "/dashboard/pages": "Pages",
    "/dashboard/pages/new": "New Page",
    "/dashboard/categories": "Categories",
    "/dashboard/tags": "Tags",
    "/dashboard/media": "Media Library",
    "/dashboard/seo": "SEO",
    "/dashboard/subscribers": "Subscribers",
    "/dashboard/messages": "Messages",
    "/dashboard/navigation": "Navigation",
    "/dashboard/redirects": "Redirects",
    "/dashboard/settings": "Settings",
};

export function Topbar() {
    const pathname = usePathname();

    const title =
        pageTitles[pathname] ??
        (pathname.includes("/edit") ? "Edit" : "Dashboard");

    return (
        <header className="flex h-14 items-center justify-between border-b bg-white px-6 dark:bg-neutral-950">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="flex items-center gap-4">
                <UserButton />
            </div>
        </header>
    );
}
