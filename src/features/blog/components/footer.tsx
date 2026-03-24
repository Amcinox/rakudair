"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { useWebsiteConfig } from "@/lib/config";
import type { NavItem } from "@/lib/config";

function InstagramIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function XIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function YoutubeIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
        </svg>
    );
}

function FacebookIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function TiktokIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
    );
}

// Map social link labels to icons
const socialIconMap: Record<string, React.ComponentType<{ size: number }>> = {
    instagram: InstagramIcon,
    x: XIcon,
    twitter: XIcon,
    youtube: YoutubeIcon,
    facebook: FacebookIcon,
    tiktok: TiktokIcon,
    mail: Mail,
    email: Mail,
    メール: Mail,
};

function getSocialIcon(label: string): React.ComponentType<{ size: number }> {
    const key = label.toLowerCase();
    return socialIconMap[key] ?? Mail;
}

const fallbackFooterLinks: NavItem[] = [
    { id: "1", label: "ブログ記事", url: "/blog", target: "_self" },
    { id: "2", label: "私たちについて", url: "/about", target: "_self" },
];

export function Footer() {
    const config = useWebsiteConfig();

    const links = config.footerLinks.length > 0 ? config.footerLinks : fallbackFooterLinks;
    const { siteName, siteTagline, siteDescription, logoUrl, settings } = config;

    // Also support social links from site_settings if no social nav items
    const effectiveSocials: NavItem[] =
        config.socialLinks.length > 0
            ? config.socialLinks
            : buildSocialsFromSettings(settings);

    return (
        <footer className="bg-secondary border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image
                                    src={logoUrl}
                                    alt={`${siteName} ${siteTagline}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-bold text-foreground">
                                    {siteName}
                                </span>
                                <span className="text-xs text-muted-foreground -mt-1">
                                    {siteTagline}
                                </span>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            {siteDescription}
                        </p>
                        {effectiveSocials.length > 0 && (
                            <div className="flex gap-4">
                                {effectiveSocials.map((social) => {
                                    const Icon = getSocialIcon(social.label);
                                    return (
                                        <a
                                            key={social.id}
                                            href={social.url}
                                            target={social.target || "_blank"}
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                            aria-label={social.label}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="font-serif font-bold text-foreground mb-4">
                            探索する
                        </h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        href={link.url}
                                        target={link.target}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal — use footer links with "legal" in label or fallback */}
                    <div>
                        <h3 className="font-serif font-bold text-foreground mb-4">
                            会社情報
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    プライバシーポリシー
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                >
                                    利用規約
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-serif font-bold text-foreground mb-4">
                            ニュースレター
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            最新の旅行記や特別コンテンツを受け取る
                        </p>
                        <NewsletterForm variant="footer" />
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} {siteName} {siteTagline}. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

/** Build social links from site_settings keys like socialTwitter, socialInstagram, socialYoutube */
function buildSocialsFromSettings(settings: Record<string, unknown>): NavItem[] {
    const socials: NavItem[] = [];
    const platforms: { key: string; label: string }[] = [
        { key: "socialTwitter", label: "Twitter" },
        { key: "socialInstagram", label: "Instagram" },
        { key: "socialYoutube", label: "YouTube" },
        { key: "socialFacebook", label: "Facebook" },
        { key: "socialTiktok", label: "Tiktok" },
        // Also support short keys
        { key: "twitter", label: "Twitter" },
        { key: "instagram", label: "Instagram" },
        { key: "youtube", label: "YouTube" },
        { key: "facebook", label: "Facebook" },
        { key: "tiktok", label: "Tiktok" },
    ];
    const seen = new Set<string>();
    for (const { key, label } of platforms) {
        const url = settings[key] as string | undefined;
        if (url && !seen.has(label)) {
            seen.add(label);
            socials.push({
                id: key,
                label,
                url,
                target: "_blank",
            });
        }
    }
    const contactEmail = settings.contactEmail as string | undefined;
    if (contactEmail) {
        socials.push({
            id: "email",
            label: "メール",
            url: `mailto:${contactEmail}`,
            target: "_self",
        });
    }
    return socials;
}
