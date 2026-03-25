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
import { ImagePicker } from "@/components/dashboard/image-picker";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        siteName: "Rakuda Air",
        siteTagline: "ラクダイル",
        siteDescription: "A Japanese travel & culture blog",
        siteUrl: "https://www.rakudair.com",
        logoUrl: "/logo.png",
        contactEmail: "info@rakudair.com",
        socialTwitter: "",
        socialInstagram: "",
        socialYoutube: "",
        socialFacebook: "",
        socialTiktok: "",
        postsPerPage: "12",
        analyticsId: "",
        // Header & Footer
        headerCtaText: "購読する",
        headerCtaLink: "/blog",
        footerNavHeading: "探索する",
        footerLegalHeading: "会社情報",
        footerNewsletterHeading: "ニュースレター",
        footerNewsletterDescription: "最新の旅行記や特別コンテンツを受け取る",
        footerLegalLinks: JSON.stringify([
            { label: "プライバシーポリシー", url: "/privacy" },
            { label: "利用規約", url: "/terms" },
        ]),
    });

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
                    socialFacebook: (data.socialFacebook as string) ?? "",
                    socialTiktok: (data.socialTiktok as string) ?? "",
                    postsPerPage: String(data.postsPerPage ?? "12"),
                    analyticsId: (data.analyticsId as string) ?? "",
                    headerCtaText: (data.headerCtaText as string) ?? f.headerCtaText,
                    headerCtaLink: (data.headerCtaLink as string) ?? f.headerCtaLink,
                    footerNavHeading: (data.footerNavHeading as string) ?? f.footerNavHeading,
                    footerLegalHeading: (data.footerLegalHeading as string) ?? f.footerLegalHeading,
                    footerNewsletterHeading: (data.footerNewsletterHeading as string) ?? f.footerNewsletterHeading,
                    footerNewsletterDescription: (data.footerNewsletterDescription as string) ?? f.footerNewsletterDescription,
                    footerLegalLinks: typeof data.footerLegalLinks === "string"
                        ? data.footerLegalLinks as string
                        : data.footerLegalLinks
                            ? JSON.stringify(data.footerLegalLinks)
                            : f.footerLegalLinks,
                }));
                setLoading(false);
            });
    }, []);

    async function handleSave() {
        setSaving(true);

        const batch = [
            ...Object.entries(form)
                .filter(([key]) => key !== "footerLegalLinks")
                .map(([key, value]) => ({ key, value })),
            {
                key: "footerLegalLinks",
                value: (() => { try { return JSON.parse(form.footerLegalLinks); } catch { return []; } })(),
            },
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

    if (loading) {
        return (
            <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Settings</h2>
                <p className="text-muted-foreground">General site configuration.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="header-footer">Header & Footer</TabsTrigger>
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
                                <Label>Contact Email</Label>
                                <Input
                                    value={form.contactEmail}
                                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <ImagePicker
                                value={form.logoUrl}
                                onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
                                placeholder="/logo.png"
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Social Tab =============== */}
                <TabsContent value="social" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Social Media Links</h3>
                        <p className="text-sm text-muted-foreground">These links appear in the footer. Leave empty to hide.</p>
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label>Facebook</Label>
                                <Input
                                    value={form.socialFacebook}
                                    onChange={(e) => setForm((f) => ({ ...f, socialFacebook: e.target.value }))}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>TikTok</Label>
                                <Input
                                    value={form.socialTiktok}
                                    onChange={(e) => setForm((f) => ({ ...f, socialTiktok: e.target.value }))}
                                    placeholder="https://tiktok.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Header & Footer Tab =============== */}
                <TabsContent value="header-footer" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Header CTA Button</h3>
                        <p className="text-sm text-muted-foreground">Configure the call-to-action button shown in the site header.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Button Text</Label>
                                <Input
                                    value={form.headerCtaText}
                                    onChange={(e) => setForm((f) => ({ ...f, headerCtaText: e.target.value }))}
                                    placeholder="購読する"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Button Link</Label>
                                <Input
                                    value={form.headerCtaLink}
                                    onChange={(e) => setForm((f) => ({ ...f, headerCtaLink: e.target.value }))}
                                    placeholder="/blog"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Footer Columns</h3>
                        <p className="text-sm text-muted-foreground">Customize the footer column headings and content. Navigation links come from the Navigation page.</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Navigation Column Heading</Label>
                                <Input
                                    value={form.footerNavHeading}
                                    onChange={(e) => setForm((f) => ({ ...f, footerNavHeading: e.target.value }))}
                                    placeholder="探索する"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Legal Column Heading</Label>
                                <Input
                                    value={form.footerLegalHeading}
                                    onChange={(e) => setForm((f) => ({ ...f, footerLegalHeading: e.target.value }))}
                                    placeholder="会社情報"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Newsletter Column Heading</Label>
                                <Input
                                    value={form.footerNewsletterHeading}
                                    onChange={(e) => setForm((f) => ({ ...f, footerNewsletterHeading: e.target.value }))}
                                    placeholder="ニュースレター"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Newsletter Description</Label>
                            <Input
                                value={form.footerNewsletterDescription}
                                onChange={(e) => setForm((f) => ({ ...f, footerNewsletterDescription: e.target.value }))}
                                placeholder="最新の旅行記や特別コンテンツを受け取る"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="dash-card rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold">Legal Links</h3>
                        <p className="text-sm text-muted-foreground">JSON array of legal links shown in the footer. Format: [{`{"label":"…","url":"…"}`}]</p>
                        <Textarea
                            value={form.footerLegalLinks}
                            onChange={(e) => setForm((f) => ({ ...f, footerLegalLinks: e.target.value }))}
                            rows={4}
                            className="font-mono text-sm"
                        />
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
