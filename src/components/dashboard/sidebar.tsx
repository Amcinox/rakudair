"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    SidebarLeft01Icon,
    File01Icon,
    FolderOpenIcon,
    TagsIcon,
    Image01Icon,
    SearchIcon,
    MailOpen01Icon,
    Settings01Icon,
    Menu01Icon,
    ArrowLeft01Icon,
    UserMultipleIcon,
    Navigation01Icon,
    ArrowMoveUpLeftIcon,
    NoteIcon,
    DashboardSquare01Icon,
    ArrowDown01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VinylIllustration } from "@/components/dashboard/illustrations";

/* ------------------------------------------------------------------ */
/*  Navigation groups                                                  */
/* ------------------------------------------------------------------ */

type NavChild = {
    title: string;
    href: string;
    icon: typeof File01Icon;
};

type NavGroup = {
    label: string;
    children: NavChild[];
};

const navGroups: NavGroup[] = [
    {
        label: "Dashboard",
        children: [
            { title: "Overview", href: "/dashboard", icon: DashboardSquare01Icon },
        ],
    },
    {
        label: "Content",
        children: [
            { title: "Articles", href: "/dashboard/articles", icon: File01Icon },
            { title: "Pages", href: "/dashboard/pages", icon: NoteIcon },
            { title: "Categories", href: "/dashboard/categories", icon: FolderOpenIcon },
            { title: "Tags", href: "/dashboard/tags", icon: TagsIcon },
        ],
    },
    {
        label: "Assets",
        children: [
            { title: "Media", href: "/dashboard/media", icon: Image01Icon },
        ],
    },
    {
        label: "SEO & Growth",
        children: [
            { title: "SEO", href: "/dashboard/seo", icon: SearchIcon },
            { title: "Subscribers", href: "/dashboard/subscribers", icon: UserMultipleIcon },
            { title: "Messages", href: "/dashboard/messages", icon: MailOpen01Icon },
        ],
    },
    {
        label: "Site Config",
        children: [
            { title: "Navigation", href: "/dashboard/navigation", icon: Navigation01Icon },
            { title: "Redirects", href: "/dashboard/redirects", icon: ArrowMoveUpLeftIcon },
            { title: "Settings", href: "/dashboard/settings", icon: Settings01Icon },
        ],
    },
];

/* ------------------------------------------------------------------ */
/*  Sidebar component                                                  */
/* ------------------------------------------------------------------ */

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    // Track which groups are open (all open by default)
    const [openGroups, setOpenGroups] = useState<Set<string>>(
        () => new Set(navGroups.map((g) => g.label)),
    );

    function toggleGroup(label: string) {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(label)) next.delete(label);
            else next.add(label);
            return next;
        });
    }

    return (
        <aside
            className={cn(
                "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
                collapsed ? "w-16" : "w-60",
            )}
        >
            {/* Logo */}
            <div className="flex h-14 items-center border-b border-sidebar-border px-3">
                {!collapsed && (
                    <Link href="/dashboard" className="flex items-center">
                        <div className="relative h-8 w-32">
                            <Image
                                src="/logo.png"
                                alt="Rakuda Air"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>
                )}
                {collapsed && (
                    <Link href="/dashboard" className="mx-auto">
                        <Image
                            src="/logo.png"
                            alt="Rakuda Air"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 shrink-0 text-muted-foreground hover:text-primary hover:bg-transparent", collapsed ? "hidden" : "ml-auto")}
                    onClick={onToggle}
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                </Button>
            </div>

            {/* Mobile toggle when collapsed */}
            {collapsed && (
                <div className="flex justify-center py-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent" onClick={onToggle}>
                        <HugeiconsIcon icon={Menu01Icon} size={18} />
                    </Button>
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 py-2">
                <nav className="flex flex-col gap-1 px-2">
                    {navGroups.map((group) => {
                        const isOpen = openGroups.has(group.label);
                        const hasActiveChild = group.children.some(
                            (c) =>
                                pathname === c.href ||
                                (c.href !== "/dashboard" && pathname.startsWith(c.href)),
                        );

                        /* When sidebar is collapsed, show only icons */
                        if (collapsed) {
                            return group.children.map((child) => {
                                const isActive =
                                    pathname === child.href ||
                                    (child.href !== "/dashboard" &&
                                        pathname.startsWith(child.href));
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={cn(
                                            "flex items-center justify-center rounded-md p-2 transition-colors",
                                            "hover:bg-sidebar-accent",
                                            isActive
                                                ? "nav-active rounded-l-none"
                                                : "text-muted-foreground",
                                        )}
                                        title={child.title}
                                    >
                                        <HugeiconsIcon
                                            icon={child.icon}
                                            size={18}
                                            className="shrink-0"
                                        />
                                    </Link>
                                );
                            });
                        }

                        /* Expanded sidebar with collapsible groups */
                        return (
                            <div key={group.label} className="mb-1">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.label)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                                        hasActiveChild
                                            ? "gold-text"
                                            : "text-muted-foreground",
                                        "hover:text-foreground",
                                    )}
                                >
                                    <span>{group.label}</span>
                                    <HugeiconsIcon
                                        icon={isOpen ? ArrowDown01Icon : ArrowRight01Icon}
                                        size={12}
                                        className="shrink-0 opacity-50"
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-0.5 flex flex-col gap-0.5">
                                        {group.children.map((child) => {
                                            const isActive =
                                                pathname === child.href ||
                                                (child.href !== "/dashboard" &&
                                                    pathname.startsWith(child.href));

                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                                        "hover:bg-sidebar-accent",
                                                        isActive
                                                            ? "nav-active rounded-l-none"
                                                            : "text-sidebar-foreground",
                                                    )}
                                                >
                                                    <HugeiconsIcon
                                                        icon={child.icon}
                                                        size={18}
                                                        className="shrink-0"
                                                    />
                                                    <span>{child.title}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Footer - View Site */}
            <div className="border-t border-sidebar-border p-2">
                {!collapsed && (
                    <div className="flex justify-center py-2 opacity-40 hover:opacity-60 transition-opacity">
                        <VinylIllustration className="w-16 h-16" />
                    </div>
                )}
                <Link
                    href="/"
                    target="_blank"
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "text-muted-foreground hover:text-primary hover:bg-sidebar-accent",
                        collapsed && "justify-center px-2",
                    )}
                >
                    <HugeiconsIcon icon={SidebarLeft01Icon} size={18} className="shrink-0" />
                    {!collapsed && <span>View Site</span>}
                </Link>
            </div>
        </aside>
    );
}
