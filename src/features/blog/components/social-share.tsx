"use client";

import { Heart, Bookmark, Share2 } from "lucide-react";

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.05 1.592.149v3.305a10 10 0 0 0-.916-.032c-1.297 0-1.801.487-1.801 1.754v2.382h3.461l-.732 3.667h-2.729v7.98z" />
        </svg>
    );
}

interface SocialShareProps {
    title: string;
    url?: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(title);

        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], "_blank", "width=600,height=400");
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch {
            // Fallback — do nothing
        }
    };

    const buttonClass =
        "w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground transition-colors";

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-28 h-fit">
                <button className={`${buttonClass} hover:text-primary hover:bg-primary/10`}>
                    <Heart className="w-5 h-5" />
                </button>
                <button className={`${buttonClass} hover:text-primary hover:bg-primary/10`}>
                    <Bookmark className="w-5 h-5" />
                </button>
                <button
                    onClick={handleCopyLink}
                    className={`${buttonClass} hover:text-primary hover:bg-primary/10`}
                >
                    <Share2 className="w-5 h-5" />
                </button>
                <div className="w-full h-px bg-border my-2" />
                <button
                    onClick={() => handleShare("twitter")}
                    className={`${buttonClass} hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10`}
                >
                    <XIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleShare("facebook")}
                    className={`${buttonClass} hover:text-[#4267B2] hover:bg-[#4267B2]/10`}
                >
                    <FacebookIcon className="w-4 h-4" />
                </button>
            </aside>

            {/* Mobile inline */}
            <div className="lg:hidden flex items-center justify-center gap-4 mt-12 pt-8 border-t border-border">
                <button className={`${buttonClass} hover:text-primary hover:bg-primary/10`}>
                    <Heart className="w-5 h-5" />
                </button>
                <button className={`${buttonClass} hover:text-primary hover:bg-primary/10`}>
                    <Bookmark className="w-5 h-5" />
                </button>
                <button
                    onClick={handleCopyLink}
                    className={`${buttonClass} hover:text-primary hover:bg-primary/10`}
                >
                    <Share2 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleShare("twitter")}
                    className={`${buttonClass} hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10`}
                >
                    <XIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleShare("facebook")}
                    className={`${buttonClass} hover:text-[#4267B2] hover:bg-[#4267B2]/10`}
                >
                    <FacebookIcon className="w-4 h-4" />
                </button>
            </div>
        </>
    );
}
