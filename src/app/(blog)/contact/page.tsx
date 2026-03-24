import { Mail, MapPin, Globe, Clock, Send } from "lucide-react";
import { getWebsiteConfig } from "@/lib/config/get-website-config";
import { NewsletterForm } from "@/features/blog/components/newsletter-form";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const config = await getWebsiteConfig();
    return {
        title: `お問い合わせ | ${config.siteName}`,
        description: `${config.siteName}へのお問い合わせはこちらから。コラボレーション、取材依頼、その他のお問い合わせをお待ちしております。`,
    };
}

export default async function ContactPage() {
    const config = await getWebsiteConfig();
    const { siteName, contactEmail, settings } = config;

    const contactData = {
        email: contactEmail || "hello@rakudair.com",
        website: (settings.siteUrl as string) || "rakudair.com",
        location: "東京, 日本",
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            {/* Hero */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                    <Mail className="w-4 h-4" />
                    お問い合わせ
                </div>
                <h1
                    className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "var(--font-noto-serif)" }}
                >
                    お気軽にご連絡ください
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    コラボレーション、取材依頼、広告のご相談、その他のお問い合わせをお待ちしております。
                </p>
            </section>

            {/* Contact Cards */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Email */}
                    <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <h3
                            className="font-bold text-foreground mb-2"
                            style={{ fontFamily: "var(--font-noto-serif)" }}
                        >
                            メール
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            お気軽にメールでご連絡ください
                        </p>
                        <a
                            href={`mailto:${contactData.email}`}
                            className="text-primary hover:underline font-medium text-sm"
                        >
                            {contactData.email}
                        </a>
                    </div>

                    {/* Location */}
                    <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h3
                            className="font-bold text-foreground mb-2"
                            style={{ fontFamily: "var(--font-noto-serif)" }}
                        >
                            拠点
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            私たちの本拠地
                        </p>
                        <span className="text-foreground font-medium text-sm">
                            {contactData.location}
                        </span>
                    </div>

                    {/* Response Time */}
                    <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <h3
                            className="font-bold text-foreground mb-2"
                            style={{ fontFamily: "var(--font-noto-serif)" }}
                        >
                            返信時間
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            通常の返信までの目安
                        </p>
                        <span className="text-foreground font-medium text-sm">
                            1〜3営業日
                        </span>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-card border border-border rounded-2xl p-8">
                    <h2
                        className="text-2xl font-bold text-foreground mb-6"
                        style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                        メッセージを送る
                    </h2>
                    <form
                        action={`mailto:${contactData.email}`}
                        method="GET"
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-foreground"
                                >
                                    お名前
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="山田 太郎"
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground"
                                >
                                    メールアドレス
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="taro@example.com"
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="subject"
                                className="text-sm font-medium text-foreground"
                            >
                                件名
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="お問い合わせの件名"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="message"
                                className="text-sm font-medium text-foreground"
                            >
                                メッセージ
                            </label>
                            <textarea
                                id="message"
                                name="body"
                                rows={5}
                                placeholder="お気軽にメッセージをどうぞ…"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            送信する
                        </button>
                    </form>
                </div>
            </section>

            {/* FAQ-like section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center mb-10">
                    <h2
                        className="text-2xl font-bold text-foreground mb-2"
                        style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                        よくあるお問い合わせ
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        以下のカテゴリに該当する場合は、メールの件名にご記載ください
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            icon: "✈️",
                            title: "コラボレーション",
                            description:
                                "旅行ブランド・観光局との提携、スポンサード記事のご依頼",
                        },
                        {
                            icon: "📸",
                            title: "取材・撮影依頼",
                            description:
                                "写真・動画の使用許可、取材同行のご相談",
                        },
                        {
                            icon: "📝",
                            title: "寄稿・ゲスト投稿",
                            description:
                                "ゲストライターとしての記事投稿、コンテンツ共有",
                        },
                        {
                            icon: "💼",
                            title: "ビジネスのご相談",
                            description:
                                "広告掲載、アフィリエイト、その他のビジネス提案",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                        >
                            <span className="text-2xl shrink-0">
                                {item.icon}
                            </span>
                            <div>
                                <h3 className="font-semibold text-foreground text-sm mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                    <Globe className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h2
                        className="text-xl font-bold text-foreground mb-2"
                        style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                        旅の便りを受け取る
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                        {siteName}の最新記事や特別コンテンツをメールでお届けします
                    </p>
                    <div className="max-w-md mx-auto">
                        <NewsletterForm variant="footer" />
                    </div>
                </div>
            </section>
        </main>
    );
}
