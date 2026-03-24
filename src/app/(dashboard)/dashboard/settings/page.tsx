"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

// Default landing page content (matches page.tsx defaults)
const defaultLanding = {
    hero: {
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
    features: {
        heading: "なぜラクダイル？",
        description:
            "私たちは単なる旅行ブログではありません。あなたの冒険心を刺激し、夢を現実にするためのインスピレーションをお届けします。",
        items: [
            { icon: "map-pin", title: "未知の地を探索", description: "誰も知らない秘密の場所、地図にない絶景スポットをご紹介します。" },
            { icon: "compass", title: "冒険のガイド", description: "初心者から上級者まで、あなたの旅をサポートする詳細なガイド。" },
            { icon: "camera", title: "美しい瞬間", description: "息をのむような写真と共に、旅の感動をお届けします。" },
        ],
    },
    testimonials: {
        heading: "読者の声",
        description: "ラクダイルと一緒に旅をした読者の皆様からの温かいメッセージ",
        items: [
            { name: "田中 美咲", role: "フォトグラファー", content: "ラクダイルの記事に触発されて、ついにサハラ砂漠への旅を実現しました。人生を変える経験でした。", rating: 5 },
            { name: "佐藤 健太", role: "バックパッカー", content: "詳細な旅行ガイドのおかげで、安心して冒険に出かけることができました。本当に感謝しています。", rating: 5 },
            { name: "山田 花子", role: "旅行愛好家", content: "美しい写真と心に響く文章。毎回の更新を楽しみにしています。", rating: 5 },
        ],
    },
    cta: {
        title: "次の冒険を一緒に計画しませんか？",
        description: "ニュースレターに登録して、最新の旅行記、特別なガイド、そしてここでしか読めないコンテンツを受け取りましょう。",
    },
};

type FeatureItem = { icon: string; title: string; description: string };
type TestimonialItem = { name: string; role: string; content: string; rating: number };

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        siteName: "Rakuda Air",
        siteTagline: "ラクダイル",
        siteDescription: "A Japanese travel & culture blog",
        siteUrl: "https://www.rakudair.com",
        logoUrl: "/logo.jpg",
        contactEmail: "info@rakudair.com",
        socialTwitter: "",
        socialInstagram: "",
        socialYoutube: "",
        postsPerPage: "12",
        analyticsId: "",
    });

    const [landing, setLanding] = useState(defaultLanding);

    useEffect(() => {
        fetch("/api/settings")
            .then((r) => r.json())
            .then((json) => {
                const data = json.data ?? {};
                setForm((f) => ({
                    ...f,
                    siteName: (data.siteName as string) ?? f.siteName,
                    siteTagline: (data.siteTagline as string) ?? f.siteTagline,
                    siteDescription: (data.siteDescription as string) ?? f.siteDescription,
                    siteUrl: (data.siteUrl as string) ?? f.siteUrl,
                    logoUrl: (data.logoUrl as string) ?? f.logoUrl,
                    contactEmail: (data.contactEmail as string) ?? f.contactEmail,
                    socialTwitter: (data.socialTwitter as string) ?? "",
                    socialInstagram: (data.socialInstagram as string) ?? "",
                    socialYoutube: (data.socialYoutube as string) ?? "",
                    postsPerPage: String(data.postsPerPage ?? "12"),
                    analyticsId: (data.analyticsId as string) ?? "",
                }));
                // Load landing page content
                if (data.landingPage && typeof data.landingPage === "object") {
                    const lp = data.landingPage as Record<string, unknown>;
                    setLanding((prev) => ({
                        hero: { ...prev.hero, ...(lp.hero as Record<string, string> ?? {}) },
                        features: {
                            heading: ((lp.features as Record<string, unknown>)?.heading as string) ?? prev.features.heading,
                            description: ((lp.features as Record<string, unknown>)?.description as string) ?? prev.features.description,
                            items: ((lp.features as Record<string, unknown>)?.items as FeatureItem[]) ?? prev.features.items,
                        },
                        testimonials: {
                            heading: ((lp.testimonials as Record<string, unknown>)?.heading as string) ?? prev.testimonials.heading,
                            description: ((lp.testimonials as Record<string, unknown>)?.description as string) ?? prev.testimonials.description,
                            items: ((lp.testimonials as Record<string, unknown>)?.items as TestimonialItem[]) ?? prev.testimonials.items,
                        },
                        cta: { ...prev.cta, ...(lp.cta as Record<string, string> ?? {}) },
                    }));
                }
                setLoading(false);
            });
    }, []);

    async function handleSave() {
        setSaving(true);

        const batch = [
            ...Object.entries(form).map(([key, value]) => ({ key, value })),
            { key: "landingPage", value: landing },
        ];

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batch),
        });

        setSaving(false);

        if (!res.ok) {
            toast.error("Failed to save settings");
            return;
        }

        toast.success("Settings saved");
    }

    function updateHero(key: string, value: string) {
        setLanding((prev) => ({
            ...prev,
            hero: { ...prev.hero, [key]: value },
        }));
    }

    function updateFeatures(key: string, value: string) {
        setLanding((prev) => ({
            ...prev,
            features: { ...prev.features, [key]: value },
        }));
    }

    function updateFeatureItem(index: number, key: keyof FeatureItem, value: string) {
        setLanding((prev) => ({
            ...prev,
            features: {
                ...prev.features,
                items: prev.features.items.map((item, i) =>
                    i === index ? { ...item, [key]: value } : item
                ),
            },
        }));
    }

    function updateTestimonials(key: string, value: string) {
        setLanding((prev) => ({
            ...prev,
            testimonials: { ...prev.testimonials, [key]: value },
        }));
    }

    function updateTestimonialItem(index: number, key: keyof TestimonialItem, value: string | number) {
        setLanding((prev) => ({
            ...prev,
            testimonials: {
                ...prev.testimonials,
                items: prev.testimonials.items.map((item, i) =>
                    i === index ? { ...item, [key]: value } : item
                ),
            },
        }));
    }

    function updateCta(key: string, value: string) {
        setLanding((prev) => ({
            ...prev,
            cta: { ...prev.cta, [key]: value },
        }));
    }

    function addFeatureItem() {
        setLanding((prev) => ({
            ...prev,
            features: {
                ...prev.features,
                items: [...prev.features.items, { icon: "map-pin", title: "", description: "" }],
            },
        }));
    }

    function removeFeatureItem(index: number) {
        setLanding((prev) => ({
            ...prev,
            features: {
                ...prev.features,
                items: prev.features.items.filter((_, i) => i !== index),
            },
        }));
    }

    function addTestimonialItem() {
        setLanding((prev) => ({
            ...prev,
            testimonials: {
                ...prev.testimonials,
                items: [...prev.testimonials.items, { name: "", role: "", content: "", rating: 5 }],
            },
        }));
    }

    function removeTestimonialItem(index: number) {
        setLanding((prev) => ({
            ...prev,
            testimonials: {
                ...prev.testimonials,
                items: prev.testimonials.items.filter((_, i) => i !== index),
            },
        }));
    }

    if (loading) {
        return (
            <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Settings</h2>
                <p className="text-muted-foreground">General site configuration & landing page content.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="landing">Landing Page</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* =============== General Tab =============== */}
                <TabsContent value="general" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Site Identity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Site Name</Label>
                                <Input
                                    value={form.siteName}
                                    onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tagline</Label>
                                <Input
                                    value={form.siteTagline}
                                    onChange={(e) => setForm((f) => ({ ...f, siteTagline: e.target.value }))}
                                    placeholder="ラクダイル"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Site Description</Label>
                            <Textarea
                                value={form.siteDescription}
                                onChange={(e) => setForm((f) => ({ ...f, siteDescription: e.target.value }))}
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Site URL</Label>
                                <Input
                                    value={form.siteUrl}
                                    onChange={(e) => setForm((f) => ({ ...f, siteUrl: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input
                                    value={form.logoUrl}
                                    onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                                    placeholder="/logo.jpg"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Contact Email</Label>
                            <Input
                                value={form.contactEmail}
                                onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Social Tab =============== */}
                <TabsContent value="social" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Social Media Links</h3>
                        <p className="text-sm text-muted-foreground">These links appear in the footer. Leave empty to hide.</p>
                        <div className="space-y-2">
                            <Label>Twitter / X</Label>
                            <Input
                                value={form.socialTwitter}
                                onChange={(e) => setForm((f) => ({ ...f, socialTwitter: e.target.value }))}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram</Label>
                            <Input
                                value={form.socialInstagram}
                                onChange={(e) => setForm((f) => ({ ...f, socialInstagram: e.target.value }))}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>YouTube</Label>
                            <Input
                                value={form.socialYoutube}
                                onChange={(e) => setForm((f) => ({ ...f, socialYoutube: e.target.value }))}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Landing Page Tab =============== */}
                <TabsContent value="landing" className="space-y-6">
                    {/* Hero Section */}
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Hero Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Badge Text</Label>
                                <Input value={landing.hero.badgeText} onChange={(e) => updateHero("badgeText", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Image URL</Label>
                                <Input value={landing.hero.heroImage} onChange={(e) => updateHero("heroImage", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Title (before highlight)</Label>
                            <Input value={landing.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title Highlight</Label>
                                <Input value={landing.hero.titleHighlight} onChange={(e) => updateHero("titleHighlight", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Title Suffix</Label>
                                <Input value={landing.hero.titleSuffix} onChange={(e) => updateHero("titleSuffix", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={landing.hero.description} onChange={(e) => updateHero("description", e.target.value)} rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CTA Button Text</Label>
                                <Input value={landing.hero.ctaText} onChange={(e) => updateHero("ctaText", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>CTA Link</Label>
                                <Input value={landing.hero.ctaLink} onChange={(e) => updateHero("ctaLink", e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Secondary CTA Text</Label>
                                <Input value={landing.hero.secondaryCtaText} onChange={(e) => updateHero("secondaryCtaText", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Secondary CTA Link</Label>
                                <Input value={landing.hero.secondaryCtaLink} onChange={(e) => updateHero("secondaryCtaLink", e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Features Section */}
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Features Section</h3>
                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Input value={landing.features.heading} onChange={(e) => updateFeatures("heading", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={landing.features.description} onChange={(e) => updateFeatures("description", e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-4">
                            {landing.features.items.map((item, i) => (
                                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Feature {i + 1}</span>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFeatureItem(i)}>Remove</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Icon (map-pin, compass, camera)</Label>
                                            <Input value={item.icon} onChange={(e) => updateFeatureItem(i, "icon", e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Title</Label>
                                            <Input value={item.title} onChange={(e) => updateFeatureItem(i, "title", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Description</Label>
                                        <Textarea value={item.description} onChange={(e) => updateFeatureItem(i, "description", e.target.value)} rows={2} />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addFeatureItem}>+ Add Feature</Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Testimonials */}
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Testimonials Section</h3>
                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Input value={landing.testimonials.heading} onChange={(e) => updateTestimonials("heading", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={landing.testimonials.description} onChange={(e) => updateTestimonials("description", e.target.value)} rows={2} />
                        </div>
                        <div className="space-y-4">
                            {landing.testimonials.items.map((item, i) => (
                                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Testimonial {i + 1}</span>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeTestimonialItem(i)}>Remove</Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Name</Label>
                                            <Input value={item.name} onChange={(e) => updateTestimonialItem(i, "name", e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Role</Label>
                                            <Input value={item.role} onChange={(e) => updateTestimonialItem(i, "role", e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Rating (1-5)</Label>
                                            <Input type="number" min={1} max={5} value={item.rating} onChange={(e) => updateTestimonialItem(i, "rating", parseInt(e.target.value) || 5)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Content</Label>
                                        <Textarea value={item.content} onChange={(e) => updateTestimonialItem(i, "content", e.target.value)} rows={2} />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addTestimonialItem}>+ Add Testimonial</Button>
                        </div>
                    </div>

                    <Separator />

                    {/* CTA Section */}
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">CTA Section (Newsletter)</h3>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={landing.cta.title} onChange={(e) => updateCta("title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={landing.cta.description} onChange={(e) => updateCta("description", e.target.value)} rows={3} />
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Advanced Tab =============== */}
                <TabsContent value="advanced" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Display & Analytics</h3>
                        <div className="space-y-2">
                            <Label>Posts Per Page</Label>
                            <Input
                                type="number"
                                value={form.postsPerPage}
                                onChange={(e) => setForm((f) => ({ ...f, postsPerPage: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Google Analytics ID</Label>
                            <Input
                                value={form.analyticsId}
                                onChange={(e) => setForm((f) => ({ ...f, analyticsId: e.target.value }))}
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? "Saving…" : "Save Settings"}
                </Button>
            </div>
        </div>
    );
}
