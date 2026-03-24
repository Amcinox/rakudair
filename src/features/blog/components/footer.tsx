import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

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

const footerLinks = {
    explore: [
        { href: "/blog", label: "ブログ記事" },
        { href: "/about", label: "私たちについて" },
    ],
    legal: [
        { href: "#", label: "プライバシーポリシー" },
        { href: "#", label: "利用規約" },
    ],
};

const socialLinks = [
    { href: "#", icon: InstagramIcon, label: "Instagram" },
    { href: "#", icon: XIcon, label: "X" },
    { href: "#", icon: YoutubeIcon, label: "YouTube" },
    { href: "#", icon: Mail, label: "メール" },
];

export function Footer() {
    return (
        <footer className="bg-secondary border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image
                                    src="/logo.jpg"
                                    alt="Rakudair ラクダイル"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-bold text-foreground">
                                    Rakudair
                                </span>
                                <span className="text-xs text-muted-foreground -mt-1">
                                    ラクダイル
                                </span>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            砂漠の風に導かれ、未知なる冒険へ。
                            世界中の美しい場所をお届けします。
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-serif font-bold text-foreground mb-4">
                            探索する
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-serif font-bold text-foreground mb-4">
                            会社情報
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
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
                        © {new Date().getFullYear()} Rakudair ラクダイル. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
