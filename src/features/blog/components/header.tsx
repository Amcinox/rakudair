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
    const { siteName, siteTagline, logoUrl } = config;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                            <Image
                                src={logoUrl}
                                alt={`${siteName} ${siteTagline}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-tight">
                                {siteName}
                            </span>
                            <span className="text-xs text-muted-foreground -mt-1">
                                {siteTagline}
                            </span>
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
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            購読する
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
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-2">
                            購読する
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
