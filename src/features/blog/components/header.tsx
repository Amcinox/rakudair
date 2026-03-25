"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteConfig } from "@/lib/config";
import type { NavItem } from "@/lib/config";

const fallbackLinks: NavItem[] = [
    { id: "1", label: "ホーム", url: "/", target: "_self" },
    { id: "2", label: "ブログ", url: "/blog", target: "_self" },
    { id: "3", label: "私たちについて", url: "/about", target: "_self" },
];

/** Desktop nav item — plain link or hover dropdown if it has children */
function DesktopNavItem({ link }: { link: NavItem }) {
    if (!link.children?.length) {
        return (
            <Link
                href={link.url}
                target={link.target}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
                {link.label}
            </Link>
        );
    }

    return (
        <div className="relative group">
            <Link
                href={link.url}
                target={link.target}
                className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium"
            >
                {link.label}
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            {/*
             * pt-3 creates an invisible "bridge" between the trigger and the
             * card so the dropdown doesn't close as the cursor moves down.
             */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 z-50 min-w-44">
                <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1.5">
                    {link.children.map((child) => (
                        <Link
                            key={child.id}
                            href={child.url}
                            target={child.target}
                            className="flex items-center px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary transition-colors whitespace-nowrap"
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Mobile nav item — plain link or collapsible accordion if it has children */
function MobileNavItem({
    link,
    onClose,
}: {
    link: NavItem;
    onClose: () => void;
}) {
    const [expanded, setExpanded] = useState(false);

    if (!link.children?.length) {
        return (
            <Link
                href={link.url}
                target={link.target}
                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={onClose}
            >
                {link.label}
            </Link>
        );
    }

    return (
        <div>
            <button
                className="flex items-center justify-between w-full text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setExpanded((v) => !v)}
            >
                {link.label}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                    }`}
                />
            </button>
            {expanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                    {link.children.map((child) => (
                        <Link
                            key={child.id}
                            href={child.url}
                            target={child.target}
                            className="block text-sm text-foreground/70 hover:text-primary transition-colors py-1.5"
                            onClick={onClose}
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function Header() {
    const config = useWebsiteConfig();
    const [isOpen, setIsOpen] = useState(false);

    const links = config.navLinks.length > 0 ? config.navLinks : fallbackLinks;
    const { siteName, siteTagline, logoUrl, settings } = config;

    const ctaText = (settings.headerCtaText as string) || "購読する";
    const ctaLink = (settings.headerCtaLink as string) || "/blog";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo — image already contains the site name */}
                    <Link href="/" className="flex items-center group shrink-0">
                        <div className="relative h-11 md:h-13 w-44 md:w-56">
                            <Image
                                src={logoUrl}
                                alt={`${siteName} ${siteTagline}`}
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <DesktopNavItem key={link.id} link={link} />
                        ))}
                        <Button
                            asChild
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Link href={ctaLink}>{ctaText}</Link>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="メニューを開く"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-border">
                    <nav className="flex flex-col px-4 py-4 gap-1">
                        {links.map((link) => (
                            <MobileNavItem
                                key={link.id}
                                link={link}
                                onClose={() => setIsOpen(false)}
                            />
                        ))}
                        <Button
                            asChild
                            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-3"
                        >
                            <Link href={ctaLink}>{ctaText}</Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
