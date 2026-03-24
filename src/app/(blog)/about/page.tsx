import Image from "next/image";
import { Compass, Camera, Heart, Mail, Globe, MapPin } from "lucide-react";
import { NewsletterForm } from "@/features/blog/components/newsletter-form";
import { getWebsiteConfig } from "@/lib/config/get-website-config";
import type { Metadata } from "next";

// ---- Default content (fallbacks) ----

const defaultAbout = {
    hero: {
        badge: "私たちについて",
        title: "砂漠の先に、\n物語がある。",
        description: "Rakudairは、砂漠と冒険をテーマにした日本発のトラベルメディアです。",
        image: "/hero-desert.jpg",
    },
    stats: [
        { number: "120+", label: "記事" },
        { number: "35", label: "訪問国" },
        { number: "50K+", label: "読者" },
        { number: "3", label: "年の歴史" },
    ],
    story: {
        title: "私たちのストーリー",
        image: "/hero-desert.jpg",
        paragraphs: [
            "Rakudairは、2022年にサハラ砂漠への旅をきっかけに生まれました。広大な砂の海、夜空に輝く無数の星、そしてベルベル人の温かいおもてなし。",
            "その体験があまりにも衝撃的で、この感動を多くの人と共有したいという思いから、このメディアを立ち上げました。",
            "今では世界中の砂漠を旅し、その美しさと文化を記録しています。私たちの目標は、読者の皆さんに「行ってみたい」と思わせること。そして、旅を通じて世界の多様性を感じていただくことです。",
        ],
    },
    values: {
        heading: "大切にしていること",
        description: "すべてのコンテンツは、3つの価値観に基づいて作られています。",
        items: [
            { icon: "compass", title: "本物の冒険", description: "観光ガイドに載らない、本物の旅の体験をお届けします。砂漠の静寂、星空の美しさ、地元の人々との出会い。" },
            { icon: "camera", title: "ビジュアルストーリー", description: "一枚の写真が千の言葉を語る。プロフェッショナルな写真と映像で、旅の雰囲気を伝えます。" },
            { icon: "heart", title: "文化への敬意", description: "訪れる地域の文化、伝統、自然環境を尊重し、持続可能な旅のあり方を提案します。" },
        ],
    },
    team: {
        heading: "チーム",
        description: "情熱を持ったメンバーが、最高のコンテンツをお届けします。",
        members: [
            { name: "田中 ユウキ", role: "編集長 / フォトグラファー", bio: "元新聞記者。10年以上の旅行経験と写真技術で、世界の美しさを伝える。", avatar: "/logo.jpg" },
            { name: "サラ・ミッチェル", role: "トラベルライター", bio: "アメリカ出身、東京在住。日本文化と旅をテーマに執筆活動を行う。", avatar: "/logo.jpg" },
            { name: "アフメド・ハッサン", role: "砂漠ガイド / コンサルタント", bio: "サハラ砂漠出身。砂漠旅行の専門家として、安全で豊かな旅をサポート。", avatar: "/logo.jpg" },
        ],
    },
    contact: {
        heading: "お問い合わせ",
        description: "コラボレーション、取材依頼、その他のお問い合わせはお気軽にどうぞ。",
        email: "hello@rakudair.com",
        website: "rakudair.com",
        websiteUrl: "https://www.rakudair.com",
        location: "東京, 日本",
    },
    newsletter: {
        heading: "旅の便りを受け取る",
        description: "新しい記事や特別な旅のストーリーをメールでお届けします。",
    },
};

const valueIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    compass: Compass,
    camera: Camera,
    heart: Heart,
};

type AboutData = typeof defaultAbout;

export async function generateMetadata(): Promise<Metadata> {
    const config = await getWebsiteConfig();
    const data = config.settings.aboutPage as Partial<AboutData> | undefined;
    const hero = { ...defaultAbout.hero, ...(data?.hero ?? {}) };

    return {
        title: `${hero.badge} | ${config.siteName}`,
        description: hero.description,
    };
}

export default async function AboutPage() {
    const config = await getWebsiteConfig();
    const raw = (config.settings.aboutPage ?? {}) as Partial<AboutData>;
    const about: AboutData = {
        hero: { ...defaultAbout.hero, ...(raw.hero ?? {}) },
        stats: raw.stats ?? defaultAbout.stats,
        story: { ...defaultAbout.story, ...(raw.story ?? {}), paragraphs: raw.story?.paragraphs ?? defaultAbout.story.paragraphs },
        values: {
            heading: raw.values?.heading ?? defaultAbout.values.heading,
            description: raw.values?.description ?? defaultAbout.values.description,
            items: raw.values?.items ?? defaultAbout.values.items,
        },
        team: {
            heading: raw.team?.heading ?? defaultAbout.team.heading,
            description: raw.team?.description ?? defaultAbout.team.description,
            members: raw.team?.members ?? defaultAbout.team.members,
        },
        contact: { ...defaultAbout.contact, ...(raw.contact ?? {}) },
        newsletter: { ...defaultAbout.newsletter, ...(raw.newsletter ?? {}) },
    };

    const heroTitleParts = about.hero.title.split("\n");

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20">
                <div className="relative h-[50vh]">
                    <Image
                        src={about.hero.image}
                        alt={about.hero.badge}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            {about.hero.badge}
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            {heroTitleParts.map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i < heroTitleParts.length - 1 && <br />}
                                </span>
                            ))}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                            {about.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {about.stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-card border border-border rounded-2xl p-6 text-center"
                            >
                                <p className="font-serif text-3xl md:text-4xl font-bold text-primary">
                                    {stat.number}
                                </p>
                                <p className="text-muted-foreground mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-12 md:py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                            <Image
                                src={about.story.image}
                                alt={about.story.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                                {about.story.title}
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                {about.story.paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {about.values.heading}
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            {about.values.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {about.values.items.map((value) => {
                            const ValIcon = valueIconMap[value.icon] ?? Compass;
                            return (
                                <div
                                    key={value.title}
                                    className="bg-card border border-border rounded-2xl p-8 text-center"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                        <ValIcon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 md:py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {about.team.heading}
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            {about.team.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {about.team.members.map((member) => (
                            <div
                                key={member.name}
                                className="bg-card border border-border rounded-2xl p-8 text-center"
                            >
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20">
                                    <Image
                                        src={member.avatar}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-foreground">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-primary font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 md:py-16 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                        {about.contact.heading}
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                        {about.contact.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href={`mailto:${about.contact.email}`}
                            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur px-6 py-3 rounded-full transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            <span>{about.contact.email}</span>
                        </a>
                        <a
                            href={about.contact.websiteUrl}
                            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur px-6 py-3 rounded-full transition-colors"
                        >
                            <Globe className="w-5 h-5" />
                            <span>{about.contact.website}</span>
                        </a>
                        <span className="inline-flex items-center gap-2 bg-primary-foreground/10 px-6 py-3 rounded-full">
                            <MapPin className="w-5 h-5" />
                            <span>{about.contact.location}</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* CTA / Newsletter */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {about.newsletter.heading}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        {about.newsletter.description}
                    </p>
                    <NewsletterForm variant="inline" />
                </div>
            </section>
        </main>
    );
}
