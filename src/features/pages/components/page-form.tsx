"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiFetch } from "@/features/shared/api";
import { ImagePicker } from "@/components/dashboard/image-picker";
import type { JSONContent } from "@tiptap/react";

const Editor = dynamic(
    () => import("@/features/editor/components/editor").then((m) => m.Editor),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] animate-pulse rounded-lg border bg-muted" />
        ),
    },
);

interface PageFormProps {
    pageId?: string;
}

export function PageForm({ pageId }: PageFormProps) {
    const router = useRouter();
    const isEdit = !!pageId;
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    // Form state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [status, setStatus] = useState<string>("draft");
    const [template, setTemplate] = useState<string>("default");
    const [showInNav, setShowInNav] = useState(false);
    const [navOrder, setNavOrder] = useState(0);
    const [locale, setLocale] = useState("ja");

    // SEO state
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [ogTitle, setOgTitle] = useState("");
    const [ogDescription, setOgDescription] = useState("");
    const [ogImage, setOgImage] = useState("");
    const [canonicalUrl, setCanonicalUrl] = useState("");
    const [noIndex, setNoIndex] = useState(false);
    const [noFollow, setNoFollow] = useState(false);

    // Editor content
    const contentRef = useRef<JSONContent | undefined>(undefined);
    const htmlRef = useRef<string>("");
    const [initialContent, setInitialContent] = useState<JSONContent | undefined>(undefined);

    useEffect(() => {
        if (!pageId) return;
        apiFetch<{ data: Record<string, unknown> }>(`/api/pages/${pageId}`).then(
            (json) => {
                const p = json.data;
                setTitle(p.title as string);
                setSlug((p.slug as string) ?? "");
                setSlugTouched(true);
                setStatus(p.status as string);
                setTemplate(p.template as string);
                setShowInNav(p.showInNav as boolean);
                setNavOrder(p.navOrder as number);
                setLocale(p.locale as string);
                if (p.content) setInitialContent(p.content as JSONContent);
                setLoading(false);
            },
        );
    }, [pageId]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugTouched && title) {
            setSlug(slugify(title, { lower: true, strict: true }));
        }
    }, [title, slugTouched]);

    const handleEditorChange = useCallback(
        (json: JSONContent, html: string) => {
            contentRef.current = json;
            htmlRef.current = html;
        },
        [],
    );

    async function handleSave(publishStatus?: string) {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setSaving(true);
        const saveStatus = publishStatus ?? status;

        const body: Record<string, unknown> = {
            title,
            slug: slug || undefined,
            content: contentRef.current,
            contentHtml: htmlRef.current,
            status: saveStatus,
            template,
            showInNav,
            navOrder,
            locale,
        };

        const url = isEdit ? `/api/pages/${pageId}` : "/api/pages";
        const method = isEdit ? "PATCH" : "POST";

        try {
            const json = await apiFetch<{ data: { id: string } }>(url, {
                method,
                body: JSON.stringify(body),
            });

            // Save SEO data if any field was filled
            const hasSeo =
                seoTitle || seoDescription || seoKeywords || ogTitle || ogDescription || ogImage || canonicalUrl || noIndex || noFollow;
            if (hasSeo) {
                const entityId = isEdit ? pageId : json.data.id;
                await apiFetch("/api/seo", {
                    method: "POST",
                    body: JSON.stringify({
                        entityType: "page",
                        entityId,
                        metaTitle: seoTitle || title,
                        metaDescription: seoDescription || "",
                        metaKeywords: seoKeywords
                            ? seoKeywords.split(",").map((k) => k.trim())
                            : [],
                        ogTitle: ogTitle || seoTitle || title,
                        ogDescription: ogDescription || seoDescription || "",
                        ogImage: ogImage || undefined,
                        canonicalUrl: canonicalUrl || undefined,
                        noIndex,
                        noFollow,
                    }),
                });
            }

            toast.success(isEdit ? "Page updated" : "Page created");
            if (!isEdit) {
                router.push("/dashboard/pages");
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="h-[600px] animate-pulse rounded-lg bg-muted" />;
    }

    const seoTitlePlaceholder = title || "Page title";

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main editor area */}
                <div className="space-y-4">
                    <div className="dash-card rounded-lg p-4 space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Page title"
                            className="text-2xl font-bold h-14 px-3 placeholder:text-muted-foreground/40"
                            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="shrink-0">Slug:</span>
                            <Input
                                value={slug}
                                onChange={(e) => {
                                    setSlugTouched(true);
                                    setSlug(slugify(e.target.value, { lower: true, strict: true }));
                                }}
                                placeholder="auto-generated-slug"
                                className="h-7 text-sm border-dashed border-border/50 bg-transparent"
                            />
                        </div>
                    </div>

                    <Editor
                        content={initialContent}
                        onChange={handleEditorChange}
                        placeholder="Start writing your page content…"
                    />
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Publish panel */}
                    <div className="dash-card rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-sm gold-text">Status & Publish</h3>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleSave()}
                                disabled={saving}
                                className="flex-1"
                                variant="outline"
                            >
                                {saving ? "Saving…" : "Save Draft"}
                            </Button>
                            <Button
                                onClick={() => handleSave("published")}
                                disabled={saving}
                                className="flex-1 btn-gold"
                            >
                                Publish
                            </Button>
                        </div>
                        {slug && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground"
                                onClick={() => window.open(`/${slug}`, "_blank")}
                            >
                                Preview in new tab ↗
                            </Button>
                        )}
                    </div>

                    {/* Template */}
                    <div className="dash-card rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-sm gold-text">Template</h3>
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="full-width">Full Width</SelectItem>
                                <SelectItem value="contact">Contact</SelectItem>
                                <SelectItem value="blank">Blank</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Settings */}
                    <div className="dash-card rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-sm gold-text">Settings</h3>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="showInNav" className="text-sm">Show in Navigation</Label>
                            <Switch id="showInNav" checked={showInNav} onCheckedChange={setShowInNav} />
                        </div>
                        {showInNav && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-sm">Nav Order</Label>
                                    <Input
                                        type="number"
                                        value={navOrder}
                                        onChange={(e) => setNavOrder(Number(e.target.value))}
                                    />
                                </div>
                            </>
                        )}
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-sm">Locale</Label>
                            <Select value={locale} onValueChange={setLocale}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ja">日本語</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>
            </div>

            {/* SEO — Full Width */}
            <div className="dash-card rounded-lg p-6 space-y-5">
                <div>
                    <h3 className="font-semibold text-sm gold-text">SEO</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                        SEO fields auto-fill from the page. Override below if needed.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Meta Title</Label>
                            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={seoTitlePlaceholder} className="h-8 text-sm" />
                            <span className="text-[10px] text-muted-foreground">{(seoTitle || title).length}/60</span>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Meta Description</Label>
                            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Page description for search engines" rows={2} className="text-sm" />
                            <span className="text-[10px] text-muted-foreground">{seoDescription.length}/160</span>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Keywords</Label>
                            <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="keyword1, keyword2" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Canonical URL</Label>
                            <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="Leave empty for default" className="h-8 text-sm" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs">OG Title</Label>
                            <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={seoTitle || title || "Same as meta title"} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">OG Description</Label>
                            <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder={seoDescription || "Same as meta description"} rows={2} className="text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">OG Image</Label>
                            <ImagePicker
                                value={ogImage}
                                onChange={setOgImage}
                                placeholder="Image URL for social sharing"
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Switch id="noIndex" checked={noIndex} onCheckedChange={setNoIndex} />
                                <Label htmlFor="noIndex" className="text-xs">No Index</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch id="noFollow" checked={noFollow} onCheckedChange={setNoFollow} />
                                <Label htmlFor="noFollow" className="text-xs">No Follow</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
