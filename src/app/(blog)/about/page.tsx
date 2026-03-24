import Image from "next/image";
import { MapPin, Compass, Camera, Heart, Mail, Globe } from "lucide-react";
import { NewsletterForm } from "@/features/blog/components/newsletter-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "私たちについて | Rakudair",
    description:
        "Rakudairは日本発のトラベルメディアです。世界中の砂漠と冒険を記録しています。",
};

const stats = [
    { number: "120+", label: "記事" },
    { number: "35", label: "訪問国" },
    { number: "50K+", label: "読者" },
    { number: "3", label: "年の歴史" },
];

const values = [
    {
        icon: Compass,
        title: "本物の冒険",
        description:
            "観光ガイドに載らない、本物の旅の体験をお届けします。砂漠の静寂、星空の美しさ、地元の人々との出会い。",
    },
    {
        icon: Camera,
        title: "ビジュアルストーリー",
        description:
            "一枚の写真が千の言葉を語る。プロフェッショナルな写真と映像で、旅の雰囲気を伝えます。",
    },
    {
        icon: Heart,
        title: "文化への敬意",
        description:
            "訪れる地域の文化、伝統、自然環境を尊重し、持続可能な旅のあり方を提案します。",
    },
];

const team = [
    {
        name: "田中 ユウキ",
        role: "編集長 / フォトグラファー",
        bio: "元新聞記者。10年以上の旅行経験と写真技術で、世界の美しさを伝える。",
        avatar: "/logo.jpg",
    },
    {
        name: "サラ・ミッチェル",
        role: "トラベルライター",
        bio: "アメリカ出身、東京在住。日本文化と旅をテーマに執筆活動を行う。",
        avatar: "/logo.jpg",
    },
    {
        name: "アフメド・ハッサン",
        role: "砂漠ガイド / コンサルタント",
        bio: "サハラ砂漠出身。砂漠旅行の専門家として、安全で豊かな旅をサポート。",
        avatar: "/logo.jpg",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20">
                <div className="relative h-[50vh]">
                    <Image
                        src="/hero-desert.jpg"
                        alt="Rakudairチームについて"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            私たちについて
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            砂漠の先に、
                            <br />
                            物語がある。
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                            Rakudairは、砂漠と冒険をテーマにした日本発のトラベルメディアです。
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
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
                                src="/hero-desert.jpg"
                                alt="私たちのストーリー"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                                私たちのストーリー
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Rakudairは、2022年にサハラ砂漠への旅をきっかけに生まれました。広大な砂の海、夜空に輝く無数の星、そしてベルベル人の温かいおもてなし。
                                </p>
                                <p>
                                    その体験があまりにも衝撃的で、この感動を多くの人と共有したいという思いから、このメディアを立ち上げました。
                                </p>
                                <p>
                                    今では世界中の砂漠を旅し、その美しさと文化を記録しています。私たちの目標は、読者の皆さんに「行ってみたい」と思わせること。そして、旅を通じて世界の多様性を感じていただくことです。
                                </p>
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
                            大切にしていること
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            すべてのコンテンツは、3つの価値観に基づいて作られています。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="bg-card border border-border rounded-2xl p-8 text-center"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 md:py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                            チーム
                        </h2>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            情熱を持ったメンバーが、最高のコンテンツをお届けします。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member) => (
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
                        お問い合わせ
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                        コラボレーション、取材依頼、その他のお問い合わせはお気軽にどうぞ。
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="mailto:hello@rakudair.com"
                            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur px-6 py-3 rounded-full transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            <span>hello@rakudair.com</span>
                        </a>
                        <a
                            href="https://www.rakudair.com"
                            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur px-6 py-3 rounded-full transition-colors"
                        >
                            <Globe className="w-5 h-5" />
                            <span>rakudair.com</span>
                        </a>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur px-6 py-3 rounded-full transition-colors"
                        >
                            <MapPin className="w-5 h-5" />
                            <span>東京, 日本</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA / Newsletter */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        旅の便りを受け取る
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        新しい記事や特別な旅のストーリーをメールでお届けします。
                    </p>
                    <NewsletterForm variant="inline" />
                </div>
            </section>
        </main>
    );
}
