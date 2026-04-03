"use client";

import type { Config } from "@puckeditor/core";
import { HeroBlock } from "./blocks/hero-block";
import { FeaturesBlock } from "./blocks/features-block";
import { FeaturedPostsBlock } from "./blocks/featured-posts-block";
import { TestimonialsBlock } from "./blocks/testimonials-block";
import { CtaNewsletterBlock } from "./blocks/cta-newsletter-block";
import { RichTextBlock } from "./blocks/rich-text-block";
import { SpacerBlock } from "./blocks/spacer-block";
import { ImageBlock } from "./blocks/image-block";
import { RichTextField } from "./fields/rich-text-field";

// ── Helper to build a custom rich-text field ──────────────────────────────────
function richTextField(label: string) {
    return {
        type: "custom" as const,
        label,
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <RichTextField value={value ?? ""} onChange={onChange} />
        ),
    };
}

// ---- Component prop types ----

export type Components = {
    Hero: {
        badgeText: string;
        title: string;
        titleHighlight: string;
        titleSuffix: string;
        description: string;
        buttons: { text: string; link: string; variant: "default" | "outline" | "secondary" | "ghost"; icon: "none" | "arrow" | "external" | "play" | "download" | "mail" | "info" | "star" | "check" }[];
        heroImage: string;
        heroImageAlt: string;
    };
    Features: {
        heading: string;
        description: string;
        items: { icon: string; title: string; description: string }[];
    };
    FeaturedPosts: {
        heading: string;
        description: string;
        linkText: string;
        linkUrl: string;
        count: number;
    };
    Testimonials: {
        heading: string;
        description: string;
        items: { name: string; role: string; content: string; rating: number }[];
    };
    CtaNewsletter: {
        logoUrl: string;
        logoAlt: string;
        title: string;
        description: string;
    };
    RichText: {
        html: string;
    };
    Spacer: {
        height: number;
    };
    ImageSection: {
        src: string;
        alt: string;
        width: string;
        rounded: boolean;
    };
};

// ---- Puck Config ----

export const puckConfig: Config<Components> = {
    categories: {
        landing: {
            title: "Landing",
            components: ["Hero", "Features", "FeaturedPosts", "Testimonials", "CtaNewsletter"],
        },
        content: {
            title: "Content",
            components: ["RichText", "ImageSection", "Spacer"],
        },
    },
    components: {
        Hero: {
            label: "Hero",
            fields: {
                badgeText: { type: "text", label: "Badge Text" },
                title: { type: "text", label: "Title (before highlight)" },
                titleHighlight: { type: "text", label: "Title Highlight" },
                titleSuffix: { type: "text", label: "Title Suffix" },
                description: richTextField("Description"),
                buttons: {
                    type: "array",
                    label: "Buttons",
                    arrayFields: {
                        text: { type: "text", label: "Label" },
                        link: { type: "text", label: "URL" },
                        variant: {
                            type: "select",
                            label: "Style",
                            options: [
                                { label: "Primary", value: "default" },
                                { label: "Outline", value: "outline" },
                                { label: "Secondary", value: "secondary" },
                                { label: "Ghost", value: "ghost" },
                            ],
                        },
                        icon: {
                            type: "select",
                            label: "Icon",
                            options: [
                                { label: "None", value: "none" },
                                { label: "Arrow", value: "arrow" },
                                { label: "External", value: "external" },
                                { label: "Play", value: "play" },
                                { label: "Download", value: "download" },
                                { label: "Mail", value: "mail" },
                                { label: "Info", value: "info" },
                                { label: "Star", value: "star" },
                                { label: "Check", value: "check" },
                            ],
                        },
                    },
                    defaultItemProps: {
                        text: "Get Started",
                        link: "/blog",
                        variant: "default",
                        icon: "arrow",
                    },
                },
                heroImage: { type: "text", label: "Background Image URL" },
                heroImageAlt: { type: "text", label: "Image Alt Text" },
            },
            defaultProps: {
                badgeText: "新しい冒険が始まる",
                title: "砂漠の風に導かれ、",
                titleHighlight: "未知なる世界",
                titleSuffix: "へ",
                description:
                    "ラクダイルは、世界中の砂漠、オアシス、そして冒険の旅をお届けする日本語トラベルブログです。あなたの次の旅を、特別なものに。",
                buttons: [
                    { text: "冒険を始める", link: "/blog", variant: "default", icon: "arrow" },
                    { text: "私たちについて", link: "/about", variant: "outline", icon: "none" },
                ],
                heroImage: "/hero-desert.jpg",
                heroImageAlt: "サハラ砂漠の美しい風景",
            },
            render: HeroBlock,
        },
        Features: {
            label: "Features Section",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: richTextField("Description"),
                items: {
                    type: "array",
                    label: "Feature Items",
                    arrayFields: {
                        icon: {
                            type: "select",
                            label: "Icon",
                            options: [
                                { label: "Map Pin", value: "map-pin" },
                                { label: "Compass", value: "compass" },
                                { label: "Camera", value: "camera" },
                                { label: "Globe", value: "globe" },
                                { label: "Heart", value: "heart" },
                                { label: "Star", value: "star" },
                                { label: "Plane", value: "plane" },
                                { label: "Mountain", value: "mountain" },
                            ],
                        },
                        title: { type: "text", label: "Title" },
                        description: richTextField("Description"),
                    },
                    defaultItemProps: {
                        icon: "map-pin",
                        title: "New Feature",
                        description: "<p>Enter a description here.</p>",
                    },
                },
            },
            defaultProps: {
                heading: "なぜラクダイル？",
                description:
                    "<p>私たちは単なる旅行ブログではありません。あなたの冒険心を刺激し、夢を現実にするためのインスピレーションをお届けします。</p>",
                items: [
                    {
                        icon: "map-pin",
                        title: "未知の地を探索",
                        description:
                            "<p>誰も知らない秘密の場所、地図にない絶景スポットをご紹介します。</p>",
                    },
                    {
                        icon: "compass",
                        title: "冒険のガイド",
                        description:
                            "<p>初心者から上級者まで、あなたの旅をサポートする詳細なガイド。</p>",
                    },
                    {
                        icon: "camera",
                        title: "美しい瞬間",
                        description: "<p>息をのむような写真と共に、旅の感動をお届けします。</p>",
                    },
                ],
            },
            render: FeaturesBlock,
        },
        FeaturedPosts: {
            label: "Featured Posts",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: richTextField("Description"),
                linkText: { type: "text", label: "Link Text" },
                linkUrl: { type: "text", label: "Link URL" },
                count: { type: "number", label: "Post Count", min: 1, max: 12 },
            },
            defaultProps: {
                heading: "最新の冒険記",
                description: "<p>砂漠の旅、文化探訪、星空観測。様々なテーマの記事をお楽しみください。</p>",
                linkText: "すべての記事を見る",
                linkUrl: "/blog",
                count: 3,
            },
            render: FeaturedPostsBlock,
        },
        Testimonials: {
            label: "Testimonials",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: richTextField("Description"),
                items: {
                    type: "array",
                    label: "Testimonials",
                    arrayFields: {
                        name: { type: "text", label: "Name" },
                        role: { type: "text", label: "Role" },
                        content: richTextField("Content"),
                        rating: { type: "number", label: "Rating (1-5)", min: 1, max: 5 },
                    },
                    defaultItemProps: {
                        name: "Name",
                        role: "Role",
                        content: "<p>Enter testimonial content here.</p>",
                        rating: 5,
                    },
                },
            },
            defaultProps: {
                heading: "読者の声",
                description: "<p>ラクダイルと一緒に旅をした読者の皆様からの温かいメッセージ</p>",
                items: [
                    {
                        name: "田中 美咲",
                        role: "フォトグラファー",
                        content:
                            "<p>ラクダイルの記事に触発されて、ついにサハラ砂漠への旅を実現しました。人生を変える経験でした。</p>",
                        rating: 5,
                    },
                    {
                        name: "佐藤 健太",
                        role: "バックパッカー",
                        content:
                            "<p>詳細な旅行ガイドのおかげで、安心して冒険に出かけることができました。本当に感謝しています。</p>",
                        rating: 5,
                    },
                    {
                        name: "山田 花子",
                        role: "旅行愛好家",
                        content:
                            "<p>美しい写真と心に響く文章。毎回の更新を楽しみにしています。</p>",
                        rating: 5,
                    },
                ],
            },
            render: TestimonialsBlock,
        },
        CtaNewsletter: {
            label: "CTA / Newsletter",
            fields: {
                logoUrl: { type: "text", label: "Logo URL" },
                logoAlt: { type: "text", label: "Logo Alt" },
                title: { type: "text", label: "Title" },
                description: richTextField("Description"),
            },
            defaultProps: {
                logoUrl: "/logo.jpg",
                logoAlt: "Rakudair Mascot",
                title: "次の冒険を一緒に計画しませんか？",
                description:
                    "<p>ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。</p>",
            },
            render: CtaNewsletterBlock,
        },
        RichText: {
            label: "Rich Text",
            fields: {
                html: richTextField("HTML Content"),
            },
            defaultProps: {
                html: "<p>Enter your text here.</p>",
            },
            render: RichTextBlock,
        },
        Spacer: {
            label: "Spacer",
            fields: {
                height: { type: "number", label: "Height (px)", min: 8, max: 200 },
            },
            defaultProps: {
                height: 64,
            },
            render: SpacerBlock,
        },
        ImageSection: {
            label: "Image Section",
            fields: {
                src: { type: "text", label: "Image URL" },
                alt: { type: "text", label: "Alt Text" },
                width: {
                    type: "select",
                    label: "Width",
                    options: [
                        { label: "Normal", value: "max-w-3xl" },
                        { label: "Wide", value: "max-w-5xl" },
                        { label: "Full Wide", value: "max-w-7xl" },
                    ],
                },
                rounded: {
                    type: "radio",
                    label: "Rounded",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
            },
            defaultProps: {
                src: "/hero-desert.jpg",
                alt: "Image",
                width: "max-w-5xl",
                rounded: true,
            },
            render: ImageBlock,
        },
    },
};
