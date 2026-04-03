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
                    "<p>ラクダイルは、世界中の砂漠、オアシス、そして冒険の旅をお届けする日本語トラベルブログです。あなたの次の旅を、特別なものに。</p>",
                buttons: [
                    { text: "冒険を始める", link: "/blog", variant: "default", icon: "arrow" },
                    { text: "私たちについて", link: "/about", variant: "outline", icon: "none" },
                ],
                heroImage: "",
                heroImageAlt: "サハラ砂漠の美しい風景",
            },
        },
        {
            type: "Features",
            props: {
                id: "features-1",
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
        },
        {
            type: "FeaturedPosts",
            props: {
                id: "featured-posts-1",
                heading: "最新の冒険記",
                description:
                    "<p>砂漠の旅、文化探訪、星空観測。様々なテーマの記事をお楽しみください。</p>",
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
                    "<p>ラクダイルと一緒に旅をした読者の皆様からの温かいメッセージ</p>",
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
        },
        {
            type: "CtaNewsletter",
            props: {
                id: "cta-1",
                logoUrl: "/logo.png",
                logoAlt: "Rakudair マスコット",
                title: "次の冒険を一緒に計画しませんか？",
                description:
                    "<p>ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。</p>",
            },
        },
    ],
};
