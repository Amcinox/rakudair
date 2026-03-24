"use client";

import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

type Category = { id: string; name: string; slug: string };
type Tag = { id: string; name: string; slug: string };

interface ArticleFormProps {
    articleId?: string;
}

export function ArticleForm({ articleId }: ArticleFormProps) {
    const router = useRouter();
    const isEdit = !!articleId;
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);

    // Form state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [status, setStatus] = useState<string>("draft");
    const [categoryId, setCategoryId] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [locale, setLocale] = useState("ja");

    // Tag input
    const [tagInput, setTagInput] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);

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
    // For edit pages, track whether content has been loaded (may still be undefined if article has no content)
    const [contentLoaded, setContentLoaded] = useState(!isEdit);

    // Data
    const [categories, setCategories] = useState<Category[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);

    useEffect(() => {
        Promise.all([
            apiFetch<{ data: Category[] }>("/api/categories"),
            apiFetch<{ data: Tag[] }>("/api/tags"),
        ]).then(([catRes, tagRes]) => {
            setCategories(catRes.data ?? []);
            setAllTags(tagRes.data ?? []);
        });
    }, []);

    useEffect(() => {
        if (!articleId) return;
        apiFetch<{ data: Record<string, unknown> }>(`/api/articles/${articleId}`).then(
            (json) => {
                const a = json.data;
                setTitle(a.title as string);
                setSlug((a.slug as string) ?? "");
                setSlugTouched(true);
                setExcerpt((a.excerpt as string) ?? "");
                setCoverImage((a.coverImage as string) ?? "");
                setStatus(a.status as string);
                setCategoryId((a.categoryId as string) ?? "");
                setIsFeatured(a.isFeatured as boolean);
                setLocale(a.locale as string);
                const tagIds = (a.articleTags as { tagId: string }[])?.map((at) => at.tagId) ?? [];
                setSelectedTags((prev) => {
                    if (prev.length > 0) return prev;
                    return tagIds.map((id) => ({ id, name: "", slug: "" }));
                });
                if (a.content) setInitialContent(a.content as JSONContent);
                setContentLoaded(true);
                setLoading(false);
            },
        );
    }, [articleId]);

    // Once allTags loads, resolve selected tag names
    useEffect(() => {
        if (allTags.length === 0 || selectedTags.length === 0) return;
        if (selectedTags[0]?.name) return;
        setSelectedTags((prev) =>
            prev
                .map((t) => allTags.find((at) => at.id === t.id))
                .filter(Boolean) as Tag[],
        );
    }, [allTags, selectedTags]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugTouched && title) {
            setSlug(slugify(title, { lower: true, strict: true }));
        }
    }, [title, slugTouched]);

    // Tag suggestions
    useEffect(() => {
        if (!tagInput.trim()) {
            setTagSuggestions([]);
            return;
        }
        const q = tagInput.toLowerCase();
        const selectedIds = new Set(selectedTags.map((t) => t.id));
        const matches = allTags.filter(
            (t) => t.name.toLowerCase().includes(q) && !selectedIds.has(t.id),
        );
        setTagSuggestions(matches.slice(0, 8));
    }, [tagInput, allTags, selectedTags]);

    function addTag(tag: Tag) {
        setSelectedTags((prev) => {
            if (prev.some((t) => t.id === tag.id)) return prev;
            return [...prev, tag];
        });
        setTagInput("");
        setShowSuggestions(false);
        tagInputRef.current?.focus();
    }

    function removeTag(tagId: string) {
        setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
    }

    async function createAndAddTag(name: string) {
        try {
            const json = await apiFetch<{ data: Tag }>("/api/tags", {
                method: "POST",
                body: JSON.stringify({ name }),
            });
            const newTag = json.data;
            setAllTags((prev) => [...prev, newTag]);
            addTag(newTag);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to create tag");
        }
    }

    function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const value = tagInput.trim().replace(/,$/, "");
            if (!value) return;

            const existing = allTags.find(
                (t) => t.name.toLowerCase() === value.toLowerCase(),
            );
            if (existing) {
                addTag(existing);
            } else {
                createAndAddTag(value);
            }
        } else if (e.key === "Backspace" && !tagInput && selectedTags.length > 0) {
            setSelectedTags((prev) => prev.slice(0, -1));
        }
    }

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
            excerpt,
            content: contentRef.current,
            contentHtml: htmlRef.current,
            coverImage,
            status: saveStatus,
            categoryId: categoryId || null,
            isFeatured,
            locale,
            tagIds: selectedTags.map((t) => t.id),
        };

        const url = isEdit ? `/api/articles/${articleId}` : "/api/articles";
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
                const entityId = isEdit ? articleId : json.data.id;
                await apiFetch("/api/seo", {
                    method: "POST",
                    body: JSON.stringify({
                        entityType: "article",
                        entityId,
                        metaTitle: seoTitle || title,
                        metaDescription: seoDescription || excerpt,
                        metaKeywords: seoKeywords
                            ? seoKeywords.split(",").map((k) => k.trim())
                            : [],
                        ogTitle: ogTitle || seoTitle || title,
                        ogDescription: ogDescription || seoDescription || excerpt,
                        ogImage: ogImage || coverImage,
                        canonicalUrl: canonicalUrl || undefined,
                        noIndex,
                        noFollow,
                    }),
                });
            }

            toast.success(isEdit ? "Article updated" : "Article created");
            if (!isEdit) {
                router.push(`/dashboard/articles/${json.data.id}/edit`);
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

    const seoTitlePlaceholder = title || "Article title";
    const seoDescPlaceholder = excerpt || "Auto-generated from excerpt";

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main editor area */}
                <div className="space-y-4">
                    <div className="dash-card rounded-lg p-4 space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Article title"
                            className="text-2xl font-bold h-14 bg-transparent border-none shadow-none focus-visible:ring-0 px-1 placeholder:text-muted-foreground/40"
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

                    {contentLoaded && (
                        <Editor
                            key={isEdit ? "edit" : "new"}
                            content={initialContent}
                            onChange={handleEditorChange}
                            placeholder="Start writing your article…"
                        />
                    )}
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
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
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
                                onClick={() => window.open(`/blog/${slug}`, "_blank")}
                            >
                                Preview in new tab ↗
                            </Button>
                        )}
                    </div>

                    {/* Category */}
                    <div className="dash-card rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-sm gold-text">Category</h3>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tags — WordPress-style chip input */}
                    <div className="dash-card rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-sm gold-text">Tags</h3>
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {selectedTags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="secondary"
                                        className="gap-1 pl-2.5 pr-1 py-0.5 text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                                        onClick={() => removeTag(tag.id)}
                                    >
                                        {tag.name}
                                        <span className="ml-0.5 text-[10px] opacity-60">✕</span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <div className="relative">
                            <Input
                                ref={tagInputRef}
                                value={tagInput}
                                onChange={(e) => {
                                    setTagInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={handleTagKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="Type to add tags…"
                                className="h-8 text-sm"
                            />
                            {showSuggestions && (tagSuggestions.length > 0 || tagInput.trim()) && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-card shadow-lg max-h-48 overflow-y-auto">
                                    {tagSuggestions.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => addTag(tag)}
                                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                    {tagInput.trim() &&
                                        !allTags.some(
                                            (t) => t.name.toLowerCase() === tagInput.trim().toLowerCase(),
                                        ) && (
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => createAndAddTag(tagInput.trim())}
                                                className="w-full text-left px-3 py-1.5 text-sm text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                + Create &quot;{tagInput.trim()}&quot;
                                            </button>
                                        )}
                                </div>
                            )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Type and press Enter to add. New tags are created automatically.
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div className="dash-card rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-sm gold-text">Cover Image</h3>
                        <ImagePicker
                            value={coverImage}
                            onChange={setCoverImage}
                            placeholder="No cover image selected"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="dash-card rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-sm gold-text">Excerpt</h3>
                        <Textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short summary for cards and SEO"
                            rows={3}
                        />
                    </div>

                    {/* Settings */}
                    <div className="dash-card rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-sm gold-text">Settings</h3>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="featured" className="text-sm">Featured</Label>
                            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                        </div>
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
                        SEO fields auto-fill from the article. Override below if needed.
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
                            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={seoDescPlaceholder} rows={2} className="text-sm" />
                            <span className="text-[10px] text-muted-foreground">{(seoDescription || excerpt).length}/160</span>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Keywords</Label>
                            <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="japan, travel, tokyo" className="h-8 text-sm" />
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
                            <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder={seoDescription || excerpt || "Same as meta description"} rows={2} className="text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">OG Image</Label>
                            <ImagePicker
                                value={ogImage}
                                onChange={setOgImage}
                                placeholder={coverImage || "Falls back to cover image"}
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
