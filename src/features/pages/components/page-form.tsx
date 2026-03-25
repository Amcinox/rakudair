"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { Puck, usePuck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "@/features/puck/puck-config";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiFetch } from "@/features/shared/api";
import { ImagePicker } from "@/components/dashboard/image-picker";
import { Save, Globe, Eye } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tiny child component that syncs Puck data up to the parent ref     */
/* ------------------------------------------------------------------ */
function PuckDataSync({
    dataRef,
}: {
    dataRef: React.MutableRefObject<Data | null>;
}) {
    const { appState } = usePuck();
    dataRef.current = appState.data;
    return null;
}

/* ------------------------------------------------------------------ */
/*  Main form                                                          */
/* ------------------------------------------------------------------ */
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

    // Puck data
    const puckDataRef = useRef<Data | null>(null);
    const [initialPuckData, setInitialPuckData] = useState<Data>({
        root: { props: {} },
        content: [],
    });

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

    // Load page + SEO data for editing
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

                // Load Puck content
                const content = p.content as Data | null;
                const isPuck =
                    content &&
                    typeof content === "object" &&
                    "root" in content &&
                    "content" in content &&
                    Array.isArray((content as Data).content);
                if (isPuck) {
                    setInitialPuckData(content as Data);
                }

                // Load SEO data (arrives via `with: { seo: true }`)
                const seo = p.seo as Record<string, unknown> | null;
                if (seo) {
                    setSeoTitle((seo.metaTitle as string) ?? "");
                    setSeoDescription((seo.metaDescription as string) ?? "");
                    setSeoKeywords(
                        Array.isArray(seo.metaKeywords)
                            ? (seo.metaKeywords as string[]).join(", ")
                            : "",
                    );
                    setOgTitle((seo.ogTitle as string) ?? "");
                    setOgDescription((seo.ogDescription as string) ?? "");
                    setOgImage((seo.ogImage as string) ?? "");
                    setCanonicalUrl((seo.canonicalUrl as string) ?? "");
                    setNoIndex(!!seo.noIndex);
                    setNoFollow(!!seo.noFollow);
                }

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

    const handleSave = useCallback(
        async (publishStatus?: string) => {
            if (!title.trim()) {
                toast.error("Title is required");
                return;
            }

            setSaving(true);
            const saveStatus = publishStatus ?? status;

            const body: Record<string, unknown> = {
                title,
                slug: slug || undefined,
                content: puckDataRef.current ?? initialPuckData,
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
        },
        [
            title, slug, status, template, showInNav, navOrder, locale,
            seoTitle, seoDescription, seoKeywords, ogTitle, ogDescription,
            ogImage, canonicalUrl, noIndex, noFollow,
            isEdit, pageId, router, initialPuckData,
        ],
    );

    if (loading) {
        return <div className="h-[600px] animate-pulse rounded-lg bg-muted" />;
    }

    const seoTitlePlaceholder = title || "Page title";

    return (
        <div className="space-y-4">
            {/* ===== Top bar: title / slug / actions ===== */}
            <div className="dash-card rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Page title"
                            className="text-xl font-bold h-11 px-3 placeholder:text-muted-foreground/40"
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
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[120px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() => handleSave()}
                            disabled={saving}
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {saving ? "Saving…" : "Save"}
                        </Button>
                        <Button
                            onClick={() => handleSave("published")}
                            disabled={saving}
                            size="sm"
                            className="btn-gold gap-1.5"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Publish
                        </Button>
                        {slug && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    window.open(slug === "home" ? "/" : `/${slug}`, "_blank")
                                }
                            >
                                <Eye className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Compact settings row */}
                <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Template</Label>
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger className="h-7 w-[110px] text-xs">
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
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                        <Label htmlFor="showInNav" className="text-xs text-muted-foreground">
                            Show in Nav
                        </Label>
                        <Switch
                            id="showInNav"
                            checked={showInNav}
                            onCheckedChange={setShowInNav}
                            className="scale-75"
                        />
                    </div>
                    {showInNav && (
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Order</Label>
                            <Input
                                type="number"
                                value={navOrder}
                                onChange={(e) => setNavOrder(Number(e.target.value))}
                                className="h-7 w-16 text-xs"
                            />
                        </div>
                    )}
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Locale</Label>
                        <Select value={locale} onValueChange={setLocale}>
                            <SelectTrigger className="h-7 w-[80px] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="ja">JA</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ===== Tabs: Builder | SEO ===== */}
            <Tabs defaultValue="builder" className="w-full">
                <TabsList>
                    <TabsTrigger value="builder">Builder</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* ---- Builder Tab ---- */}
                <TabsContent value="builder" className="mt-3">
                    <div className="puck-dashboard-embed rounded-lg border border-border overflow-hidden">
                        <Puck
                            config={puckConfig}
                            data={initialPuckData}
                            onPublish={() => handleSave("published")}
                            renderHeader={() => <></>}
                        >
                            <PuckDataSync dataRef={puckDataRef} />
                            <div className="puck-embed-layout">
                                {/* Left: component drawer */}
                                <div className="puck-embed-sidebar-left">
                                    <Puck.Components />
                                </div>
                                {/* Center: preview */}
                                <div className="puck-embed-canvas">
                                    <Puck.Preview />
                                </div>
                                {/* Right: fields */}
                                <div className="puck-embed-sidebar-right">
                                    <Puck.Fields />
                                </div>
                            </div>
                        </Puck>
                    </div>
                </TabsContent>

                {/* ---- SEO Tab ---- */}
                <TabsContent value="seo" className="mt-3">
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
                                    <Input
                                        value={seoTitle}
                                        onChange={(e) => setSeoTitle(e.target.value)}
                                        placeholder={seoTitlePlaceholder}
                                        className="h-8 text-sm"
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {(seoTitle || title).length}/60
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Meta Description</Label>
                                    <Textarea
                                        value={seoDescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        placeholder="Page description for search engines"
                                        rows={2}
                                        className="text-sm"
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                        {seoDescription.length}/160
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Keywords</Label>
                                    <Input
                                        value={seoKeywords}
                                        onChange={(e) => setSeoKeywords(e.target.value)}
                                        placeholder="keyword1, keyword2"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Canonical URL</Label>
                                    <Input
                                        value={canonicalUrl}
                                        onChange={(e) => setCanonicalUrl(e.target.value)}
                                        placeholder="Leave empty for default"
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">OG Title</Label>
                                    <Input
                                        value={ogTitle}
                                        onChange={(e) => setOgTitle(e.target.value)}
                                        placeholder={seoTitle || title || "Same as meta title"}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">OG Description</Label>
                                    <Textarea
                                        value={ogDescription}
                                        onChange={(e) => setOgDescription(e.target.value)}
                                        placeholder={
                                            seoDescription || "Same as meta description"
                                        }
                                        rows={2}
                                        className="text-sm"
                                    />
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
                                        <Switch
                                            id="noIndex"
                                            checked={noIndex}
                                            onCheckedChange={setNoIndex}
                                        />
                                        <Label htmlFor="noIndex" className="text-xs">
                                            No Index
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="noFollow"
                                            checked={noFollow}
                                            onCheckedChange={setNoFollow}
                                        />
                                        <Label htmlFor="noFollow" className="text-xs">
                                            No Follow
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
