"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteConfig } from "@/lib/config";
import type { NavItem } from "@/lib/config";

const fallbackLinks: NavItem[] = [
    { id: "1", label: "ホーム", url: "/", target: "_self" },
    { id: "2", label: "ブログ", url: "/blog", target: "_self" },
    { id: "3", label: "私たちについて", url: "/about", target: "_self" },
];

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
                    <Link href="/" className="flex items-center group">
                        {/* make it bigger */}
                        <div className="relative h-9 md:h-11 w-36 md:w-44 scale-120">
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
                            <Link
                                key={link.id}
                                href={link.url}
                                target={link.target}
                                className="text-foreground/80 hover:text-primary transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link href={ctaLink}>
                                {ctaText}
                            </Link>
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
                    <nav className="flex flex-col px-4 py-4 gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.id}
                                href={link.url}
                                target={link.target}
                                className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-2">
                            <Link href={ctaLink}>
                                {ctaText}
                            </Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
