import type { Data } from "@puckeditor/core";

/**
 * Default Puck data for the landing page.
 * This is used when no landing page exists in the database yet.
 */
export const defaultLandingData: Data = {
    root: {},
    content: [
        {
            type: "Hero",
            props: {
                id: "hero-1",
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
                heroImage: "/hero-desert.jpg",
                heroImageAlt: "サハラ砂漠の美しい風景",
            },
        },
        {
            type: "Features",
            props: {
                id: "features-1",
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
                        description: "息をのむような写真と共に、旅の感動をお届けします。",
                    },
                ],
            },
        },
        {
            type: "FeaturedPosts",
            props: {
                id: "featured-posts-1",
                heading: "最新の冒険記",
                description:
                    "砂漠の旅、文化探訪、星空観測。様々なテーマの記事をお楽しみください。",
                linkText: "すべての記事を見る",
                linkUrl: "/blog",
                count: 3,
            },
        },
        {
            type: "Testimonials",
            props: {
                id: "testimonials-1",
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
                    },
                    {
                        name: "佐藤 健太",
                        role: "バックパッカー",
                        content:
                            "詳細な旅行ガイドのおかげで、安心して冒険に出かけることができました。本当に感謝しています。",
                        rating: 5,
                    },
                    {
                        name: "山田 花子",
                        role: "旅行愛好家",
                        content:
                            "美しい写真と心に響く文章。毎回の更新を楽しみにしています。",
                        rating: 5,
                    },
                ],
            },
        },
        {
            type: "CtaNewsletter",
            props: {
                id: "cta-1",
                logoUrl: "/logo.jpg",
                logoAlt: "Rakudair マスコット",
                title: "次の冒険を一緒に計画しませんか？",
                description:
                    "ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。",
            },
        },
    ],
};
