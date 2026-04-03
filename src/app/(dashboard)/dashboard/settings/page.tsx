"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImagePicker } from "@/components/dashboard/image-picker";
import {
    Globe,
    Palette,
    LayoutDashboard,
    Settings2,
    Plus,
    Trash2,
    GripVertical,
    ArrowRight,
    ExternalLink,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Type,
    Link as LinkIcon,
    Copyright,
    FileText,
} from "lucide-react";

// ---------- Types ----------

interface LegalLink {
    label: string;
    url: string;
}

// ---------- Component ----------

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
        // Header CTA
        headerCtaText: "購読する",
        headerCtaLink: "/blog",
        headerCtaVariant: "default",
        headerCtaIcon: "none",
        headerCtaVisible: true,
        // Footer
        footerNavHeading: "探索する",
        footerLegalHeading: "会社情報",
        footerNewsletterHeading: "ニュースレター",
        footerNewsletterDescription: "最新の旅行記や特別コンテンツを受け取る",
        footerCopyrightText: "© 2025 Rakuda Air. All rights reserved.",
        footerDescription: "",
        footerLogoUrl: "",
    });

    const [legalLinks, setLegalLinks] = useState<LegalLink[]>([
        { label: "プライバシーポリシー", url: "/privacy" },
        { label: "利用規約", url: "/terms" },
    ]);

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
                    headerCtaVariant: (data.headerCtaVariant as string) ?? f.headerCtaVariant,
                    headerCtaIcon: (data.headerCtaIcon as string) ?? f.headerCtaIcon,
                    headerCtaVisible: data.headerCtaVisible !== undefined ? Boolean(data.headerCtaVisible) : f.headerCtaVisible,
                    footerNavHeading: (data.footerNavHeading as string) ?? f.footerNavHeading,
                    footerLegalHeading: (data.footerLegalHeading as string) ?? f.footerLegalHeading,
                    footerNewsletterHeading: (data.footerNewsletterHeading as string) ?? f.footerNewsletterHeading,
                    footerNewsletterDescription: (data.footerNewsletterDescription as string) ?? f.footerNewsletterDescription,
                    footerCopyrightText: (data.footerCopyrightText as string) ?? f.footerCopyrightText,
                    footerDescription: (data.footerDescription as string) ?? f.footerDescription,
                    footerLogoUrl: (data.footerLogoUrl as string) ?? f.footerLogoUrl,
                }));

                // Parse legal links
                if (data.footerLegalLinks) {
                    try {
                        const parsed = typeof data.footerLegalLinks === "string"
                            ? JSON.parse(data.footerLegalLinks)
                            : data.footerLegalLinks;
                        if (Array.isArray(parsed)) {
                            setLegalLinks(parsed);
                        }
                    } catch {
                        // keep default
                    }
                }
                setLoading(false);
            });
    }, []);

    async function handleSave() {
        setSaving(true);

        const batch = [
            ...Object.entries(form).map(([key, value]) => ({ key, value })),
            { key: "footerLegalLinks", value: legalLinks },
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

    // ---------- Legal links helpers ----------

    function addLegalLink() {
        setLegalLinks((prev) => [...prev, { label: "", url: "" }]);
    }

    function removeLegalLink(index: number) {
        setLegalLinks((prev) => prev.filter((_, i) => i !== index));
    }

    function updateLegalLink(index: number, field: keyof LegalLink, value: string) {
        setLegalLinks((prev) =>
            prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
        );
    }

    // ---------- Render ----------

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
            </div>
        );
    }

    const CtaIconPreview = form.headerCtaIcon === "arrow"
        ? ArrowRight
        : form.headerCtaIcon === "external"
            ? ExternalLink
            : null;

    return (
        <div className="space-y-6">
            <div>
                <h2
                    className="text-2xl font-bold tracking-tight gold-gradient-text"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                >
                    Settings
                </h2>
                <p className="text-muted-foreground">
                    General site configuration.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general" className="gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="social" className="gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        Social
                    </TabsTrigger>
                    <TabsTrigger value="header-footer" className="gap-1.5">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Header & Footer
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-1.5">
                        <Settings2 className="w-3.5 h-3.5" />
                        Advanced
                    </TabsTrigger>
                </TabsList>

                {/* =============== General Tab =============== */}
                <TabsContent value="general" className="space-y-6">
                    {/* Site Identity */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Type className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Site Identity</h3>
                                <p className="text-xs text-muted-foreground">Name, tagline, and description</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Logo */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <ImageIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Logo</h3>
                                <p className="text-xs text-muted-foreground">Your site logo displayed in the header</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                            <div className="space-y-2">
                                <Label>Logo Image</Label>
                                <ImagePicker
                                    value={form.logoUrl}
                                    onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
                                    placeholder="/logo.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: SVG or PNG with transparent background, max 180px wide.
                                </p>
                            </div>
                            {form.logoUrl && (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-xs text-muted-foreground font-medium">Preview</p>
                                    <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 min-h-[80px] min-w-[120px]">
                                        <img
                                            src={form.logoUrl}
                                            alt="Logo preview"
                                            className="max-w-[180px] max-h-[60px] w-auto h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* =============== Social Tab =============== */}
                <TabsContent value="social" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Social Media Links</h3>
                                <p className="text-xs text-muted-foreground">These links appear in the footer. Leave empty to hide.</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {/* Header CTA */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                    <LinkIcon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Header CTA Button</h3>
                                    <p className="text-xs text-muted-foreground">Configure the call-to-action button in the site header</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">
                                    {form.headerCtaVisible ? "Visible" : "Hidden"}
                                </Label>
                                <Switch
                                    checked={form.headerCtaVisible}
                                    onCheckedChange={(v) => setForm((f) => ({ ...f, headerCtaVisible: v }))}
                                />
                            </div>
                        </div>
                        <Separator />

                        <div className={`space-y-4 transition-opacity ${form.headerCtaVisible ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Button Style</Label>
                                    <Select
                                        value={form.headerCtaVariant}
                                        onValueChange={(v) => setForm((f) => ({ ...f, headerCtaVariant: v }))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Primary (Filled)</SelectItem>
                                            <SelectItem value="outline">Outline</SelectItem>
                                            <SelectItem value="secondary">Secondary</SelectItem>
                                            <SelectItem value="ghost">Ghost</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Button Icon</Label>
                                    <Select
                                        value={form.headerCtaIcon}
                                        onValueChange={(v) => setForm((f) => ({ ...f, headerCtaIcon: v }))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Icon</SelectItem>
                                            <SelectItem value="arrow">Arrow →</SelectItem>
                                            <SelectItem value="external">External ↗</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Live preview */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Preview</Label>
                                <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                                    <Button
                                        variant={form.headerCtaVariant as "default" | "outline" | "secondary" | "ghost"}
                                        size="sm"
                                        className="pointer-events-none"
                                    >
                                        {form.headerCtaText || "Button"}
                                        {CtaIconPreview && <CtaIconPreview className="ml-1.5 h-3.5 w-3.5" />}
                                    </Button>
                                    <span className="text-xs text-muted-foreground">→ {form.headerCtaLink || "/"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Footer Settings */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <LayoutDashboard className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Footer Columns</h3>
                                <p className="text-xs text-muted-foreground">Customize footer column headings and content.</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* Footer Branding */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Copyright className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Footer Branding</h3>
                                <p className="text-xs text-muted-foreground">Logo, description, and copyright text for the footer</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Footer Logo</Label>
                                <ImagePicker
                                    value={form.footerLogoUrl}
                                    onChange={(url) => setForm((f) => ({ ...f, footerLogoUrl: url }))}
                                    placeholder="Leave empty to use main logo"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Copyright Text</Label>
                                <Input
                                    value={form.footerCopyrightText}
                                    onChange={(e) => setForm((f) => ({ ...f, footerCopyrightText: e.target.value }))}
                                    placeholder="© 2025 Rakuda Air. All rights reserved."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Footer Description</Label>
                            <Textarea
                                value={form.footerDescription}
                                onChange={(e) => setForm((f) => ({ ...f, footerDescription: e.target.value }))}
                                rows={2}
                                placeholder="A brief description shown in the footer area"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Legal Links Editor */}
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                    <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Legal Links</h3>
                                    <p className="text-xs text-muted-foreground">Links shown in the legal column of the footer</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={addLegalLink} className="gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                Add Link
                            </Button>
                        </div>
                        <Separator />

                        {legalLinks.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                <FileText className="w-8 h-8 opacity-40" />
                                <p className="text-sm">No legal links added yet.</p>
                                <Button variant="outline" size="sm" onClick={addLegalLink} className="gap-1.5 mt-1">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add your first link
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {legalLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg border bg-card p-2.5 transition-all hover:bg-muted/50"
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => updateLegalLink(index, "label", e.target.value)}
                                                placeholder="Link label"
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                value={link.url}
                                                onChange={(e) => updateLegalLink(index, "url", e.target.value)}
                                                placeholder="/privacy"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLegalLink(index)}
                                            className="p-1.5 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* =============== Advanced Tab =============== */}
                <TabsContent value="advanced" className="space-y-6">
                    <div className="dash-card rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Settings2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Display & Analytics</h3>
                                <p className="text-xs text-muted-foreground">Pagination and tracking configuration</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
