"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type SeoEntry = {
    id: string;
    entityType: string;
    entityId: string | null;
    entityTitle: string;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string[] | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    ogType: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    noFollow: boolean;
    updatedAt: string;
};

const typeColors: Record<string, string> = {
    article: "bg-blue-100 text-blue-700",
    page: "bg-purple-100 text-purple-700",
    global: "bg-green-100 text-green-700",
    category: "bg-orange-100 text-orange-700",
};

export default function SeoPage() {
    const [entries, setEntries] = useState<SeoEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<SeoEntry | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "summary_large_image",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        canonicalUrl: "",
        noIndex: false,
        noFollow: false,
    });

    async function fetchEntries() {
        setLoading(true);
        const params = new URLSearchParams({ limit: "50" });
        if (typeFilter !== "all") params.set("entityType", typeFilter);
        if (search) params.set("search", search);

        const res = await fetch(`/api/seo?${params}`);
        const json = await res.json();
        setEntries(json.data ?? []);
        setTotal(json.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        fetchEntries();
    }, [typeFilter]);

    function openEdit(entry: SeoEntry) {
        setEditing(entry);
        setForm({
            metaTitle: entry.metaTitle ?? "",
            metaDescription: entry.metaDescription ?? "",
            metaKeywords: entry.metaKeywords?.join(", ") ?? "",
            ogTitle: entry.ogTitle ?? "",
            ogDescription: entry.ogDescription ?? "",
            ogImage: entry.ogImage ?? "",
            twitterCard: entry.twitterCard ?? "summary_large_image",
            twitterTitle: entry.twitterTitle ?? "",
            twitterDescription: entry.twitterDescription ?? "",
            twitterImage: entry.twitterImage ?? "",
            canonicalUrl: entry.canonicalUrl ?? "",
            noIndex: entry.noIndex,
            noFollow: entry.noFollow,
        });
    }

    async function handleSave() {
        if (!editing) return;
        setSaving(true);

        const res = await fetch(`/api/seo/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                metaTitle: form.metaTitle || undefined,
                metaDescription: form.metaDescription || undefined,
                metaKeywords: form.metaKeywords
                    ? form.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
                    : undefined,
                ogTitle: form.ogTitle || undefined,
                ogDescription: form.ogDescription || undefined,
                ogImage: form.ogImage || undefined,
                twitterCard: form.twitterCard,
                twitterTitle: form.twitterTitle || undefined,
                twitterDescription: form.twitterDescription || undefined,
                twitterImage: form.twitterImage || undefined,
                canonicalUrl: form.canonicalUrl || undefined,
                noIndex: form.noIndex,
                noFollow: form.noFollow,
            }),
        });

        setSaving(false);

        if (!res.ok) {
            toast.error("Failed to save SEO metadata");
            return;
        }

        toast.success("SEO metadata updated");
        setEditing(null);
        fetchEntries();
    }

    function titleScore(title: string | null): string {
        if (!title) return "text-red-500";
        const len = title.length;
        if (len >= 30 && len <= 60) return "text-green-600";
        if (len > 0 && len < 30) return "text-yellow-500";
        return "text-red-500";
    }

    function descScore(desc: string | null): string {
        if (!desc) return "text-red-500";
        const len = desc.length;
        if (len >= 120 && len <= 160) return "text-green-600";
        if (len > 0 && len < 120) return "text-yellow-500";
        return "text-red-500";
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">SEO Management</h2>
                <p className="text-neutral-500">
                    Manage meta tags for all articles, pages, and global settings.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchEntries()}
                    placeholder="Search by meta title…"
                    className="max-w-sm"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="article">Articles</SelectItem>
                        <SelectItem value="page">Pages</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="category">Categories</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white dark:bg-neutral-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Meta Title</TableHead>
                            <TableHead>Meta Description</TableHead>
                            <TableHead>Index</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : entries.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-neutral-500"
                                >
                                    No SEO entries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <Badge
                                            className={typeColors[entry.entityType] ?? ""}
                                            variant="secondary"
                                        >
                                            {entry.entityType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {entry.entityTitle || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-sm ${titleScore(entry.metaTitle)}`}
                                        >
                                            {entry.metaTitle
                                                ? `${entry.metaTitle.slice(0, 50)}${entry.metaTitle.length > 50 ? "…" : ""}`
                                                : "Missing"}
                                        </span>
                                        {entry.metaTitle && (
                                            <span className="block text-xs text-neutral-400">
                                                {entry.metaTitle.length}/60
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-sm ${descScore(entry.metaDescription)}`}
                                        >
                                            {entry.metaDescription
                                                ? `${entry.metaDescription.slice(0, 60)}${entry.metaDescription.length > 60 ? "…" : ""}`
                                                : "Missing"}
                                        </span>
                                        {entry.metaDescription && (
                                            <span className="block text-xs text-neutral-400">
                                                {entry.metaDescription.length}/160
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {entry.noIndex ? (
                                            <Badge variant="destructive" className="text-xs">
                                                noindex
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-700 text-xs"
                                            >
                                                index
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(entry)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Edit SEO — {editing?.entityTitle || editing?.entityType}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Basic Meta */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Basic Meta Tags</h4>
                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Meta Title{" "}
                                    <span className="text-neutral-400">
                                        ({form.metaTitle.length}/60)
                                    </span>
                                </Label>
                                <Input
                                    value={form.metaTitle}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, metaTitle: e.target.value }))
                                    }
                                    maxLength={120}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Meta Description{" "}
                                    <span className="text-neutral-400">
                                        ({form.metaDescription.length}/160)
                                    </span>
                                </Label>
                                <Textarea
                                    value={form.metaDescription}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            metaDescription: e.target.value,
                                        }))
                                    }
                                    maxLength={320}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Keywords (comma-separated)</Label>
                                <Input
                                    value={form.metaKeywords}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, metaKeywords: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Open Graph */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Open Graph</h4>
                            <div className="space-y-2">
                                <Label className="text-sm">OG Title</Label>
                                <Input
                                    value={form.ogTitle}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, ogTitle: e.target.value }))
                                    }
                                    placeholder="Falls back to meta title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">OG Description</Label>
                                <Textarea
                                    value={form.ogDescription}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            ogDescription: e.target.value,
                                        }))
                                    }
                                    placeholder="Falls back to meta description"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">OG Image URL</Label>
                                <Input
                                    value={form.ogImage}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, ogImage: e.target.value }))
                                    }
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Twitter */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Twitter Card</h4>
                            <div className="space-y-2">
                                <Label className="text-sm">Card Type</Label>
                                <Select
                                    value={form.twitterCard}
                                    onValueChange={(v) =>
                                        setForm((f) => ({ ...f, twitterCard: v }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="summary">Summary</SelectItem>
                                        <SelectItem value="summary_large_image">
                                            Summary Large Image
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Twitter Title</Label>
                                <Input
                                    value={form.twitterTitle}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, twitterTitle: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Twitter Description</Label>
                                <Textarea
                                    value={form.twitterDescription}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            twitterDescription: e.target.value,
                                        }))
                                    }
                                    rows={2}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Advanced */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Advanced</h4>
                            <div className="space-y-2">
                                <Label className="text-sm">Canonical URL</Label>
                                <Input
                                    value={form.canonicalUrl}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, canonicalUrl: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="noIndex" className="text-sm">
                                    noindex
                                </Label>
                                <Switch
                                    id="noIndex"
                                    checked={form.noIndex}
                                    onCheckedChange={(v) =>
                                        setForm((f) => ({ ...f, noIndex: v }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="noFollow" className="text-sm">
                                    nofollow
                                </Label>
                                <Switch
                                    id="noFollow"
                                    checked={form.noFollow}
                                    onCheckedChange={(v) =>
                                        setForm((f) => ({ ...f, noFollow: v }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setEditing(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving…" : "Save SEO"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
