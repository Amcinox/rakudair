import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    MapPin,
    Compass,
    Camera,
    Star,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/features/blog/components/newsletter-form";
import { db } from "@/lib/db";
import { articles, categories } from "@/lib/db/schema";
import { getWebsiteConfig } from "@/lib/config/get-website-config";
import { desc, eq } from "drizzle-orm";

// ---- Default landing page content (fallbacks) ----

const defaultHero = {
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
};

const defaultFeatures = {
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
};

const defaultTestimonials = {
    heading: "読者の声",
    description: "ラクダイルと一緒に旅をした読者の皆様からの温かいメッセージ",
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
};

const defaultCta = {
    title: "次の冒険を一緒に計画しませんか？",
    description:
        "ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "map-pin": MapPin,
    compass: Compass,
    camera: Camera,
};

export default async function HomePage() {
    // Use centralized cached config — no extra DB hit
    const config = await getWebsiteConfig();
    const landing = (config.settings.landingPage ?? {}) as Record<string, unknown>;
    const hero = { ...defaultHero, ...(landing.hero as Record<string, string> | undefined) };
    const features = {
        ...defaultFeatures,
        ...(landing.features as Record<string, unknown> | undefined),
        items: (landing.features as Record<string, unknown> | undefined)?.items
            ? ((landing.features as Record<string, unknown>).items as typeof defaultFeatures.items)
            : defaultFeatures.items,
    };
    const testimonials = {
        ...defaultTestimonials,
        ...(landing.testimonials as Record<string, unknown> | undefined),
        items: (landing.testimonials as Record<string, unknown> | undefined)?.items
            ? ((landing.testimonials as Record<string, unknown>).items as typeof defaultTestimonials.items)
            : defaultTestimonials.items,
    };
    const cta = { ...defaultCta, ...(landing.cta as Record<string, string> | undefined) };

    // Fetch latest 3 published articles for featured posts
    const featuredPosts = await db
        .select({
            slug: articles.slug,
            title: articles.title,
            excerpt: articles.excerpt,
            coverImage: articles.coverImage,
            publishedAt: articles.publishedAt,
            readingTime: articles.readingTime,
            categoryName: categories.name,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt))
        .limit(3);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={hero.heroImage}
                        alt={hero.heroImageAlt}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm text-primary font-medium">
                            {hero.badgeText}
                        </span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
                        {hero.title}
                        <br />
                        <span className="text-primary">{hero.titleHighlight}</span>{hero.titleSuffix}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        {hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            asChild
                        >
                            <Link href={hero.ctaLink}>
                                {hero.ctaText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-foreground/20"
                            asChild
                        >
                            <Link href={hero.secondaryCtaLink}>{hero.secondaryCtaText}</Link>
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-sm">スクロール</span>
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2">
                        <div className="w-1.5 h-3 rounded-full bg-muted-foreground animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {features.heading}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {features.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.items.map((feature, index) => {
                            const FeatureIcon = iconMap[feature.icon] ?? MapPin;
                            return (
                                <div
                                    key={index}
                                    className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all hover:shadow-lg group"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <FeatureIcon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
                <section className="py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    最新の冒険記
                                </h2>
                                <p className="text-muted-foreground max-w-xl">
                                    砂漠の旅、文化探訪、星空観測。様々なテーマの記事をお楽しみください。
                                </p>
                            </div>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mt-4 md:mt-0 group"
                            >
                                すべての記事を見る
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredPosts.map((post) => (
                                <article
                                    key={post.slug}
                                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl"
                                >
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            {post.coverImage ? (
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                                    <span className="text-6xl text-muted-foreground/30">
                                                        旅
                                                    </span>
                                                </div>
                                            )}
                                            {post.categoryName && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-background/90 text-foreground text-xs font-medium">
                                                        {post.categoryName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                                {post.publishedAt && (
                                                    <span>
                                                        {post.publishedAt.toLocaleDateString("ja-JP", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                )}
                                                {post.publishedAt && post.readingTime && <span>•</span>}
                                                {post.readingTime && <span>{post.readingTime}分</span>}
                                            </div>
                                            <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-muted-foreground line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            <section className="py-20 md:py-32 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                            {testimonials.heading}
                        </h2>
                        <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                            {testimonials.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.items.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20"
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-current text-accent"
                                        />
                                    ))}
                                </div>
                                <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                                    {`"${testimonial.content}"`}
                                </p>
                                <div>
                                    <p className="font-bold">{testimonial.name}</p>
                                    <p className="text-primary-foreground/70 text-sm">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/20">
                        <Image
                            src="/logo.jpg"
                            alt="Rakudair マスコット"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {cta.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        {cta.description}
                    </p>
                    <NewsletterForm variant="inline" />
                </div>
            </section>
        </main>
    );
}
