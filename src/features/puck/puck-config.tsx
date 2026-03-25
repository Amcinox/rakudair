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
import { HeadingBlock } from "./blocks/heading-block";
import { ButtonGroupBlock } from "./blocks/button-group-block";
import { ColumnsBlock } from "./blocks/columns-block";
import { StatsBlock } from "./blocks/stats-block";
import { DividerBlock } from "./blocks/divider-block";
import { VideoEmbedBlock } from "./blocks/video-embed-block";
import { CardBlock } from "./blocks/card-block";
import { LogoCloudBlock } from "./blocks/logo-cloud-block";
import { BannerBlock } from "./blocks/banner-block";

import { ImagePickerField } from "./fields/image-picker-field";
import { RichTextField } from "./fields/rich-text-field";

// ---- Component prop types ----

export type Components = {
    Hero: {
        badgeText: string;
        title: string;
        titleHighlight: string;
        titleSuffix: string;
        description: string;
        ctaText: string;
        ctaLink: string;
        secondaryCtaText: string;
        secondaryCtaLink: string;
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
        items: {
            name: string;
            role: string;
            content: string;
            rating: number;
            avatar: string;
        }[];
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
        caption: string;
        width: string;
        rounded: boolean;
    };
    Heading: {
        text: string;
        level: "h1" | "h2" | "h3" | "h4";
        alignment: "left" | "center" | "right";
        subtitle: string;
        size: "sm" | "md" | "lg" | "xl";
    };
    ButtonGroup: {
        buttons: {
            text: string;
            link: string;
            variant: "default" | "outline" | "secondary" | "ghost" | "destructive";
            size: "sm" | "default" | "lg";
            icon: "none" | "arrow" | "external";
        }[];
        alignment: "left" | "center" | "right";
    };
    Columns: {
        columns: {
            heading: string;
            content: string;
            image: string;
            imageAlt: string;
        }[];
        layout: "2" | "3" | "4";
        gap: "sm" | "md" | "lg";
        verticalAlign: "top" | "center" | "bottom";
    };
    Stats: {
        heading: string;
        description: string;
        items: {
            value: string;
            label: string;
            prefix: string;
            suffix: string;
        }[];
        style: "default" | "cards" | "minimal";
    };
    Divider: {
        style: "solid" | "dashed" | "dotted" | "gradient" | "ornament";
        width: "sm" | "md" | "lg" | "full";
        spacing: "sm" | "md" | "lg";
        color: "default" | "primary" | "muted";
    };
    VideoEmbed: {
        url: string;
        aspectRatio: "16:9" | "4:3" | "1:1";
        width: "sm" | "md" | "lg" | "full";
        rounded: boolean;
        caption: string;
    };
    Card: {
        image: string;
        imageAlt: string;
        heading: string;
        description: string;
        linkText: string;
        linkUrl: string;
        style: "elevated" | "bordered" | "flat";
        alignment: "left" | "center";
    };
    LogoCloud: {
        heading: string;
        logos: { src: string; alt: string; url: string }[];
        grayscale: boolean;
        columns: "4" | "5" | "6";
    };
    Banner: {
        text: string;
        linkText: string;
        linkUrl: string;
        variant: "info" | "success" | "warning" | "accent";
        dismissible: boolean;
        icon: "info" | "bell" | "check" | "warning" | "none";
    };
};

// ---- Puck Config ----

export const puckConfig: Config<Components> = {
    categories: {
        landing: {
            title: "Landing",
            components: [
                "Hero",
                "Features",
                "FeaturedPosts",
                "Testimonials",
                "CtaNewsletter",
                "Stats",
                "LogoCloud",
            ],
        },
        content: {
            title: "Content",
            components: [
                "Heading",
                "RichText",
                "ImageSection",
                "Card",
                "VideoEmbed",
                "Columns",
            ],
        },
        layout: {
            title: "Layout & Utility",
            components: [
                "ButtonGroup",
                "Banner",
                "Divider",
                "Spacer",
            ],
        },
    },
    components: {
        // =====================================================================
        // HERO
        // =====================================================================
        Hero: {
            label: "Hero Section",
            fields: {
                badgeText: { type: "text", label: "Badge Text" },
                title: { type: "text", label: "Title (before highlight)" },
                titleHighlight: { type: "text", label: "Title Highlight" },
                titleSuffix: { type: "text", label: "Title Suffix" },
                description: { type: "textarea", label: "Description" },
                ctaText: { type: "text", label: "CTA Button Text" },
                ctaLink: { type: "text", label: "CTA Link" },
                secondaryCtaText: { type: "text", label: "Secondary CTA Text" },
                secondaryCtaLink: { type: "text", label: "Secondary CTA Link" },
                heroImage: {
                    type: "custom",
                    label: "Background Image",
                    render: ({ value, onChange }) => (
                        <ImagePickerField
                            value={value}
                            onChange={onChange}
                            placeholder="Select hero background image"
                        />
                    ),
                },
                heroImageAlt: { type: "text", label: "Image Alt Text" },
            },
            defaultProps: {
                badgeText: "新しい冒険が始まる",
                title: "砂漠の風に導かれ、",
                titleHighlight: "未知なる世界",
                titleSuffix: "へ",
                description:
                    "ラクダイルは、世界中の砂漠、オアシス、そして冒険の旅をお届けする日本語トラベルブログです。あなたの次の旅を、特別なものに。",
                ctaText: "冒険を始める",
                ctaLink: "/blog",
                secondaryCtaText: "私たちについて",
                secondaryCtaLink: "/about",
                heroImage: "",
                heroImageAlt: "サハラ砂漠の美しい風景",
            },
            render: HeroBlock,
        },

        // =====================================================================
        // FEATURES
        // =====================================================================
        Features: {
            label: "Features Section",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: { type: "textarea", label: "Description" },
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
                                { label: "Shield", value: "shield" },
                                { label: "Zap", value: "zap" },
                                { label: "Users", value: "users" },
                                { label: "Clock", value: "clock" },
                                { label: "Code", value: "code" },
                                { label: "Settings", value: "settings" },
                                { label: "Rocket", value: "rocket" },
                                { label: "Palette", value: "palette" },
                            ],
                        },
                        title: { type: "text", label: "Title" },
                        description: { type: "textarea", label: "Description" },
                    },
                    defaultItemProps: {
                        icon: "map-pin",
                        title: "New Feature",
                        description: "Enter a description here.",
                    },
                },
            },
            defaultProps: {
                heading: "なぜラクダイル？",
                description:
                    "私たちは単なる旅行ブログではありません。あなたの冒険心を刺激し、夢を現実にするためのインスピレーションをお届けします。",
                items: [
                    {
                        icon: "map-pin",
                        title: "未知の地を探索",
                        description:
                            "誰も知らない秘密の場所、地図にない絶景スポットをご紹介します。",
                    },
                    {
                        icon: "compass",
                        title: "冒険のガイド",
                        description:
                            "初心者から上級者まで、あなたの旅をサポートする詳細なガイド。",
                    },
                    {
                        icon: "camera",
                        title: "美しい瞬間",
                        description:
                            "息をのむような写真と共に、旅の感動をお届けします。",
                    },
                ],
            },
            render: FeaturesBlock,
        },

        // =====================================================================
        // FEATURED POSTS
        // =====================================================================
        FeaturedPosts: {
            label: "Featured Posts",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: { type: "textarea", label: "Description" },
                linkText: { type: "text", label: "Link Text" },
                linkUrl: { type: "text", label: "Link URL" },
                count: { type: "number", label: "Post Count", min: 1, max: 12 },
            },
            defaultProps: {
                heading: "最新の冒険記",
                description:
                    "砂漠の旅、文化探訪、星空観測。様々なテーマの記事をお楽しみください。",
                linkText: "すべての記事を見る",
                linkUrl: "/blog",
                count: 3,
            },
            render: FeaturedPostsBlock,
        },

        // =====================================================================
        // TESTIMONIALS
        // =====================================================================
        Testimonials: {
            label: "Testimonials",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: { type: "textarea", label: "Description" },
                items: {
                    type: "array",
                    label: "Testimonials",
                    arrayFields: {
                        name: { type: "text", label: "Name" },
                        role: { type: "text", label: "Role" },
                        content: { type: "textarea", label: "Content" },
                        rating: {
                            type: "number",
                            label: "Rating (1-5)",
                            min: 1,
                            max: 5,
                        },
                        avatar: {
                            type: "custom",
                            label: "Avatar",
                            render: ({ value, onChange }) => (
                                <ImagePickerField
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Avatar image (optional)"
                                />
                            ),
                        },
                    },
                    defaultItemProps: {
                        name: "Name",
                        role: "Role",
                        content: "Enter testimonial content here.",
                        rating: 5,
                        avatar: "",
                    },
                },
            },
            defaultProps: {
                heading: "読者の声",
                description:
                    "ラクダイルと一緒に旅をした読者の皆様からの温かいメッセージ",
                items: [
                    {
                        name: "田中 美咲",
                        role: "フォトグラファー",
                        content:
                            "ラクダイルの記事に触発されて、ついにサハラ砂漠への旅を実現しました。人生を変える経験でした。",
                        rating: 5,
                        avatar: "",
                    },
                    {
                        name: "佐藤 健太",
                        role: "バックパッカー",
                        content:
                            "詳細な旅行ガイドのおかげで、安心して冒険に出かけることができました。本当に感謝しています。",
                        rating: 5,
                        avatar: "",
                    },
                    {
                        name: "山田 花子",
                        role: "旅行愛好家",
                        content:
                            "美しい写真と心に響く文章。毎回の更新を楽しみにしています。",
                        rating: 5,
                        avatar: "",
                    },
                ],
            },
            render: TestimonialsBlock,
        },

        // =====================================================================
        // CTA / NEWSLETTER
        // =====================================================================
        CtaNewsletter: {
            label: "CTA / Newsletter",
            fields: {
                logoUrl: {
                    type: "custom",
                    label: "Logo / Image",
                    render: ({ value, onChange }) => (
                        <ImagePickerField
                            value={value}
                            onChange={onChange}
                            placeholder="Select logo or mascot image"
                        />
                    ),
                },
                logoAlt: { type: "text", label: "Logo Alt" },
                title: { type: "text", label: "Title" },
                description: { type: "textarea", label: "Description" },
            },
            defaultProps: {
                logoUrl: "/logo.png",
                logoAlt: "Rakudair",
                title: "次の冒険を一緒に計画しませんか？",
                description:
                    "ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。",
            },
            render: CtaNewsletterBlock,
        },

        // =====================================================================
        // RICH TEXT (with embedded Tiptap editor)
        // =====================================================================
        RichText: {
            label: "Rich Text",
            fields: {
                html: {
                    type: "custom",
                    label: "Content",
                    render: ({ value, onChange }) => (
                        <RichTextField value={value} onChange={onChange} />
                    ),
                },
            },
            defaultProps: {
                html: "<p>Enter your text here.</p>",
            },
            render: RichTextBlock,
        },

        // =====================================================================
        // SPACER
        // =====================================================================
        Spacer: {
            label: "Spacer",
            fields: {
                height: {
                    type: "number",
                    label: "Height (px)",
                    min: 8,
                    max: 200,
                },
            },
            defaultProps: {
                height: 64,
            },
            render: SpacerBlock,
        },

        // =====================================================================
        // IMAGE SECTION
        // =====================================================================
        ImageSection: {
            label: "Image",
            fields: {
                src: {
                    type: "custom",
                    label: "Image",
                    render: ({ value, onChange }) => (
                        <ImagePickerField
                            value={value}
                            onChange={onChange}
                            placeholder="Select or upload image"
                        />
                    ),
                },
                alt: { type: "text", label: "Alt Text" },
                caption: { type: "text", label: "Caption (optional)" },
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
                    label: "Rounded Corners",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
            },
            defaultProps: {
                src: "",
                alt: "Image",
                caption: "",
                width: "max-w-5xl",
                rounded: true,
            },
            render: ImageBlock,
        },

        // =====================================================================
        // HEADING
        // =====================================================================
        Heading: {
            label: "Heading",
            fields: {
                text: { type: "text", label: "Heading Text" },
                subtitle: { type: "textarea", label: "Subtitle (optional)" },
                level: {
                    type: "select",
                    label: "Level",
                    options: [
                        { label: "H1", value: "h1" },
                        { label: "H2", value: "h2" },
                        { label: "H3", value: "h3" },
                        { label: "H4", value: "h4" },
                    ],
                },
                size: {
                    type: "select",
                    label: "Size",
                    options: [
                        { label: "Small", value: "sm" },
                        { label: "Medium", value: "md" },
                        { label: "Large", value: "lg" },
                        { label: "Extra Large", value: "xl" },
                    ],
                },
                alignment: {
                    type: "radio",
                    label: "Alignment",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                },
            },
            defaultProps: {
                text: "Section Heading",
                subtitle: "",
                level: "h2",
                size: "md",
                alignment: "center",
            },
            render: HeadingBlock,
        },

        // =====================================================================
        // BUTTON GROUP
        // =====================================================================
        ButtonGroup: {
            label: "Buttons",
            fields: {
                buttons: {
                    type: "array",
                    label: "Buttons",
                    arrayFields: {
                        text: { type: "text", label: "Button Text" },
                        link: { type: "text", label: "Link URL" },
                        variant: {
                            type: "select",
                            label: "Style",
                            options: [
                                { label: "Primary", value: "default" },
                                { label: "Outline", value: "outline" },
                                { label: "Secondary", value: "secondary" },
                                { label: "Ghost", value: "ghost" },
                                { label: "Destructive", value: "destructive" },
                            ],
                        },
                        size: {
                            type: "select",
                            label: "Size",
                            options: [
                                { label: "Small", value: "sm" },
                                { label: "Default", value: "default" },
                                { label: "Large", value: "lg" },
                            ],
                        },
                        icon: {
                            type: "select",
                            label: "Icon",
                            options: [
                                { label: "None", value: "none" },
                                { label: "Arrow", value: "arrow" },
                                { label: "External Link", value: "external" },
                            ],
                        },
                    },
                    defaultItemProps: {
                        text: "Button",
                        link: "#",
                        variant: "default",
                        size: "default",
                        icon: "none",
                    },
                },
                alignment: {
                    type: "radio",
                    label: "Alignment",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                },
            },
            defaultProps: {
                buttons: [
                    {
                        text: "Get Started",
                        link: "#",
                        variant: "default",
                        size: "lg",
                        icon: "arrow",
                    },
                    {
                        text: "Learn More",
                        link: "#",
                        variant: "outline",
                        size: "lg",
                        icon: "none",
                    },
                ],
                alignment: "center",
            },
            render: ButtonGroupBlock,
        },

        // =====================================================================
        // COLUMNS
        // =====================================================================
        Columns: {
            label: "Columns",
            fields: {
                layout: {
                    type: "radio",
                    label: "Columns",
                    options: [
                        { label: "2 Columns", value: "2" },
                        { label: "3 Columns", value: "3" },
                        { label: "4 Columns", value: "4" },
                    ],
                },
                gap: {
                    type: "select",
                    label: "Gap",
                    options: [
                        { label: "Small", value: "sm" },
                        { label: "Medium", value: "md" },
                        { label: "Large", value: "lg" },
                    ],
                },
                verticalAlign: {
                    type: "select",
                    label: "Vertical Alignment",
                    options: [
                        { label: "Top", value: "top" },
                        { label: "Center", value: "center" },
                        { label: "Bottom", value: "bottom" },
                    ],
                },
                columns: {
                    type: "array",
                    label: "Column Content",
                    arrayFields: {
                        heading: { type: "text", label: "Heading" },
                        content: {
                            type: "custom",
                            label: "Content",
                            render: ({ value, onChange }) => (
                                <RichTextField value={value} onChange={onChange} />
                            ),
                        },
                        image: {
                            type: "custom",
                            label: "Image (optional)",
                            render: ({ value, onChange }) => (
                                <ImagePickerField
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Column image"
                                />
                            ),
                        },
                        imageAlt: { type: "text", label: "Image Alt" },
                    },
                    defaultItemProps: {
                        heading: "Column Title",
                        content: "<p>Column content goes here.</p>",
                        image: "",
                        imageAlt: "",
                    },
                },
            },
            defaultProps: {
                layout: "2",
                gap: "md",
                verticalAlign: "top",
                columns: [
                    {
                        heading: "First Column",
                        content: "<p>Content for the first column.</p>",
                        image: "",
                        imageAlt: "",
                    },
                    {
                        heading: "Second Column",
                        content: "<p>Content for the second column.</p>",
                        image: "",
                        imageAlt: "",
                    },
                ],
            },
            render: ColumnsBlock,
        },

        // =====================================================================
        // STATS
        // =====================================================================
        Stats: {
            label: "Stats / Numbers",
            fields: {
                heading: { type: "text", label: "Heading" },
                description: { type: "textarea", label: "Description" },
                style: {
                    type: "select",
                    label: "Style",
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Cards", value: "cards" },
                        { label: "Minimal", value: "minimal" },
                    ],
                },
                items: {
                    type: "array",
                    label: "Stats",
                    arrayFields: {
                        value: { type: "text", label: "Value" },
                        label: { type: "text", label: "Label" },
                        prefix: { type: "text", label: "Prefix (e.g. $)" },
                        suffix: { type: "text", label: "Suffix (e.g. +, %, K)" },
                    },
                    defaultItemProps: {
                        value: "100",
                        label: "Stat Label",
                        prefix: "",
                        suffix: "+",
                    },
                },
            },
            defaultProps: {
                heading: "",
                description: "",
                style: "default",
                items: [
                    { value: "50", label: "Countries", prefix: "", suffix: "+" },
                    { value: "200", label: "Articles", prefix: "", suffix: "+" },
                    { value: "10K", label: "Readers", prefix: "", suffix: "" },
                    { value: "99", label: "Satisfaction", prefix: "", suffix: "%" },
                ],
            },
            render: StatsBlock,
        },

        // =====================================================================
        // DIVIDER
        // =====================================================================
        Divider: {
            label: "Divider",
            fields: {
                style: {
                    type: "select",
                    label: "Style",
                    options: [
                        { label: "Solid", value: "solid" },
                        { label: "Dashed", value: "dashed" },
                        { label: "Dotted", value: "dotted" },
                        { label: "Gradient", value: "gradient" },
                        { label: "Ornament", value: "ornament" },
                    ],
                },
                width: {
                    type: "select",
                    label: "Width",
                    options: [
                        { label: "Narrow", value: "sm" },
                        { label: "Medium", value: "md" },
                        { label: "Wide", value: "lg" },
                        { label: "Full", value: "full" },
                    ],
                },
                spacing: {
                    type: "radio",
                    label: "Spacing",
                    options: [
                        { label: "Small", value: "sm" },
                        { label: "Medium", value: "md" },
                        { label: "Large", value: "lg" },
                    ],
                },
                color: {
                    type: "select",
                    label: "Color",
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Primary", value: "primary" },
                        { label: "Muted", value: "muted" },
                    ],
                },
            },
            defaultProps: {
                style: "solid",
                width: "lg",
                spacing: "md",
                color: "default",
            },
            render: DividerBlock,
        },

        // =====================================================================
        // VIDEO EMBED
        // =====================================================================
        VideoEmbed: {
            label: "Video Embed",
            fields: {
                url: { type: "text", label: "YouTube or Vimeo URL" },
                caption: { type: "text", label: "Caption (optional)" },
                aspectRatio: {
                    type: "radio",
                    label: "Aspect Ratio",
                    options: [
                        { label: "16:9", value: "16:9" },
                        { label: "4:3", value: "4:3" },
                        { label: "1:1", value: "1:1" },
                    ],
                },
                width: {
                    type: "select",
                    label: "Width",
                    options: [
                        { label: "Small", value: "sm" },
                        { label: "Medium", value: "md" },
                        { label: "Large", value: "lg" },
                        { label: "Full", value: "full" },
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
                url: "",
                caption: "",
                aspectRatio: "16:9",
                width: "md",
                rounded: true,
            },
            render: VideoEmbedBlock,
        },

        // =====================================================================
        // CARD
        // =====================================================================
        Card: {
            label: "Card",
            fields: {
                image: {
                    type: "custom",
                    label: "Card Image",
                    render: ({ value, onChange }) => (
                        <ImagePickerField
                            value={value}
                            onChange={onChange}
                            placeholder="Card image"
                        />
                    ),
                },
                imageAlt: { type: "text", label: "Image Alt" },
                heading: { type: "text", label: "Heading" },
                description: { type: "textarea", label: "Description" },
                linkText: { type: "text", label: "Link Text" },
                linkUrl: { type: "text", label: "Link URL" },
                style: {
                    type: "select",
                    label: "Card Style",
                    options: [
                        { label: "Elevated", value: "elevated" },
                        { label: "Bordered", value: "bordered" },
                        { label: "Flat", value: "flat" },
                    ],
                },
                alignment: {
                    type: "radio",
                    label: "Text Alignment",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                    ],
                },
            },
            defaultProps: {
                image: "",
                imageAlt: "",
                heading: "Card Heading",
                description: "Card description text goes here.",
                linkText: "Read more",
                linkUrl: "#",
                style: "elevated",
                alignment: "left",
            },
            render: CardBlock,
        },

        // =====================================================================
        // LOGO CLOUD
        // =====================================================================
        LogoCloud: {
            label: "Logo Cloud",
            fields: {
                heading: { type: "text", label: "Heading (optional)" },
                grayscale: {
                    type: "radio",
                    label: "Grayscale",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                columns: {
                    type: "radio",
                    label: "Columns",
                    options: [
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                        { label: "6", value: "6" },
                    ],
                },
                logos: {
                    type: "array",
                    label: "Logos",
                    arrayFields: {
                        src: {
                            type: "custom",
                            label: "Logo Image",
                            render: ({ value, onChange }) => (
                                <ImagePickerField
                                    value={value}
                                    onChange={onChange}
                                    placeholder="Logo image"
                                />
                            ),
                        },
                        alt: { type: "text", label: "Alt Text" },
                        url: { type: "text", label: "Link URL (optional)" },
                    },
                    defaultItemProps: {
                        src: "",
                        alt: "Logo",
                        url: "",
                    },
                },
            },
            defaultProps: {
                heading: "Trusted By",
                grayscale: true,
                columns: "5",
                logos: [],
            },
            render: LogoCloudBlock,
        },

        // =====================================================================
        // BANNER
        // =====================================================================
        Banner: {
            label: "Banner / Alert",
            fields: {
                text: { type: "text", label: "Banner Text" },
                linkText: { type: "text", label: "Link Text (optional)" },
                linkUrl: { type: "text", label: "Link URL" },
                variant: {
                    type: "select",
                    label: "Style",
                    options: [
                        { label: "Info", value: "info" },
                        { label: "Success", value: "success" },
                        { label: "Warning", value: "warning" },
                        { label: "Accent", value: "accent" },
                    ],
                },
                icon: {
                    type: "select",
                    label: "Icon",
                    options: [
                        { label: "Info", value: "info" },
                        { label: "Bell", value: "bell" },
                        { label: "Check", value: "check" },
                        { label: "Warning", value: "warning" },
                        { label: "None", value: "none" },
                    ],
                },
                dismissible: {
                    type: "radio",
                    label: "Dismissible",
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
            },
            defaultProps: {
                text: "Important announcement goes here.",
                linkText: "Learn more",
                linkUrl: "#",
                variant: "info",
                icon: "info",
                dismissible: false,
            },
            render: BannerBlock,
        },
    },
};
