"use client";

import { useState } from "react";
import { Heart, Bookmark, Share2, Check, Link2 } from "lucide-react";
import { toast } from "sonner";

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

const LIKED_KEY = "rakudair_liked_articles";
const BOOKMARKED_KEY = "rakudair_bookmarked_articles";

function getStoredSlugs(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(key) ?? "[]");
    } catch {
        return [];
    }
}

function toggleStoredSlug(key: string, slug: string): boolean {
    const slugs = getStoredSlugs(key);
    const idx = slugs.indexOf(slug);
    if (idx === -1) {
        slugs.push(slug);
        localStorage.setItem(key, JSON.stringify(slugs));
        return true;
    } else {
        slugs.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(slugs));
        return false;
    }
}

interface ActionButtonsProps {
    liked: boolean;
    bookmarked: boolean;
    copied: boolean;
    likeAnimate: boolean;
    mobile?: boolean;
    baseBtn: string;
    title: string;
    shareUrl: string;
    onLike: () => void;
    onBookmark: () => void;
    onCopyLink: () => void;
    onShare: (platform: string) => void;
}

function ActionButtons({
    liked,
    bookmarked,
    copied,
    likeAnimate,
    mobile = false,
    baseBtn,
    title,
    shareUrl,
    onLike,
    onBookmark,
    onCopyLink,
    onShare,
}: ActionButtonsProps) {
    return (
        <>
            {/* Like */}
            <button
                onClick={onLike}
                title={liked ? "気に入り済み" : "気に入る"}
                className={`${baseBtn} ${liked
                        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-500"
                        : "bg-secondary text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    } ${likeAnimate ? "scale-125" : "scale-100"}`}
            >
                <Heart
                    className={`w-5 h-5 transition-all ${liked ? "fill-rose-500" : ""} ${likeAnimate ? "scale-110" : ""}`}
                />
            </button>

            {/* Bookmark */}
            <button
                onClick={onBookmark}
                title={bookmarked ? "ブックマーク済み" : "ブックマーク"}
                className={`${baseBtn} ${bookmarked
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                        : "bg-secondary text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    }`}
            >
                <Bookmark
                    className={`w-5 h-5 transition-all ${bookmarked ? "fill-amber-600" : ""}`}
                />
            </button>

            {/* Copy link */}
            <button
                onClick={onCopyLink}
                title="リンクをコピー"
                className={`${baseBtn} ${copied
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                        : "bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10"
                    }`}
            >
                {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                ) : (
                    <Link2 className="w-5 h-5" />
                )}
            </button>

            {!mobile && (
                <div className="w-full h-px bg-border my-1" />
            )}

            {/* Twitter/X */}
            <button
                onClick={() => onShare("twitter")}
                title="X (Twitter) でシェア"
                className={`${baseBtn} bg-secondary text-muted-foreground hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10`}
            >
                <XIcon className="w-4 h-4" />
            </button>

            {/* Facebook */}
            <button
                onClick={() => onShare("facebook")}
                title="Facebookでシェア"
                className={`${baseBtn} bg-secondary text-muted-foreground hover:text-[#4267B2] hover:bg-[#4267B2]/10`}
            >
                <FacebookIcon className="w-4 h-4" />
            </button>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                    onClick={() => {
                        navigator
                            .share({
                                title,
                                url: typeof window !== "undefined"
                                    ? window.location.href
                                    : shareUrl,
                            })
                            .catch(() => { });
                    }}
                    title="その他でシェア"
                    className={`${baseBtn} bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10`}
                >
                    <Share2 className="w-4 h-4" />
                </button>
            )}
        </>
    );
}

interface SocialShareProps {
    title: string;
    slug?: string;
    url?: string;
}

export function SocialShare({ title, slug = "", url }: SocialShareProps) {
    const shareUrl =
        url ?? (typeof window !== "undefined" ? window.location.href : "");

    const [liked, setLiked] = useState(() =>
        slug ? getStoredSlugs(LIKED_KEY).includes(slug) : false
    );
    const [bookmarked, setBookmarked] = useState(() =>
        slug ? getStoredSlugs(BOOKMARKED_KEY).includes(slug) : false
    );
    const [copied, setCopied] = useState(false);
    const [likeAnimate, setLikeAnimate] = useState(false);

    const handleLike = () => {
        if (!slug) return;
        const next = toggleStoredSlug(LIKED_KEY, slug);
        setLiked(next);
        setLikeAnimate(true);
        setTimeout(() => setLikeAnimate(false), 400);
        if (next) {
            toast("記事を気に入りました！", {
                description: "ブックマークに追加しましたか？",
                icon: "❤️",
            });
        }
    };

    const handleBookmark = () => {
        if (!slug) return;
        const next = toggleStoredSlug(BOOKMARKED_KEY, slug);
        setBookmarked(next);
        toast(next ? "ブックマークに追加しました" : "ブックマークから削除しました", {
            icon: next ? "🔖" : "🗑️",
        });
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                typeof window !== "undefined" ? window.location.href : shareUrl,
            );
            setCopied(true);
            toast.success("リンクをコピーしました", {
                description: "クリップボードにコピーされました",
                icon: "🔗",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("コpピーに失敗しました");
        }
    };

    const handleShare = (platform: string) => {
        const currentUrl =
            typeof window !== "undefined" ? window.location.href : shareUrl;
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedTitle = encodeURIComponent(title);

        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], "_blank", "width=600,height=400");
        }
    };

    const baseBtn =
        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative";

    const sharedProps = {
        liked,
        bookmarked,
        copied,
        likeAnimate,
        baseBtn,
        title,
        shareUrl,
        onLike: handleLike,
        onBookmark: handleBookmark,
        onCopyLink: handleCopyLink,
        onShare: handleShare,
    };

    return (
        <>
            {/* Desktop sticky sidebar */}
            <aside className="hidden lg:flex flex-col gap-3 sticky top-28 h-fit">
                <ActionButtons {...sharedProps} />
            </aside>

            {/* Mobile inline bar */}
            <div className="lg:hidden flex items-center justify-center gap-3 mt-12 pt-8 border-t border-border flex-wrap">
                <ActionButtons {...sharedProps} mobile />
            </div>
        </>
    );
}
