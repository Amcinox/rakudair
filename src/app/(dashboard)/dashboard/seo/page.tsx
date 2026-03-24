"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraffitiTagIllustration } from "@/components/dashboard/illustrations";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    ChevronDown,
    ChevronRight,
    Check,
    AlertTriangle,
    X as XIcon,
} from "lucide-react";

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

type FormState = {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    canonicalUrl: string;
    noIndex: boolean;
    noFollow: boolean;
};

const typeColors: Record<string, string> = {
    article: "badge-scheduled",
    page: "bg-purple-100 text-purple-700",
    global: "badge-published",
    category: "bg-orange-100 text-orange-700",
};

// ── SEO Score Calculator ──────────────────────────────────────────────

function calculateSeoScore(entry: SeoEntry): {
    score: number;
    checks: { label: string; status: "good" | "warning" | "bad" }[];
} {
    const checks: { label: string; status: "good" | "warning" | "bad" }[] = [];

    // Meta Title
    const titleLen = entry.metaTitle?.length ?? 0;
    if (titleLen >= 30 && titleLen <= 60) {
        checks.push({ label: "Meta title length (30-60)", status: "good" });
    } else if (titleLen > 0 && titleLen < 30) {
        checks.push({ label: "Meta title too short", status: "warning" });
    } else if (titleLen > 60) {
        checks.push({ label: "Meta title too long", status: "warning" });
    } else {
        checks.push({ label: "Meta title missing", status: "bad" });
    }

    // Meta Description
    const descLen = entry.metaDescription?.length ?? 0;
    if (descLen >= 120 && descLen <= 160) {
        checks.push({ label: "Description length (120-160)", status: "good" });
    } else if (descLen > 0 && descLen < 120) {
        checks.push({ label: "Description too short", status: "warning" });
    } else if (descLen > 160) {
        checks.push({ label: "Description too long", status: "warning" });
    } else {
        checks.push({ label: "Description missing", status: "bad" });
    }

    // Keywords
    if (entry.metaKeywords && entry.metaKeywords.length > 0) {
        checks.push({ label: "Keywords defined", status: "good" });
    } else {
        checks.push({ label: "Keywords missing", status: "warning" });
    }

    // OG Title
    if (entry.ogTitle || entry.metaTitle) {
        checks.push({ label: "OG title present", status: "good" });
    } else {
        checks.push({ label: "OG title missing", status: "bad" });
    }

    // OG Description
    if (entry.ogDescription || entry.metaDescription) {
        checks.push({ label: "OG description present", status: "good" });
    } else {
        checks.push({ label: "OG description missing", status: "bad" });
    }

    // OG Image
    if (entry.ogImage) {
        checks.push({ label: "OG image set", status: "good" });
    } else {
        checks.push({ label: "OG image missing", status: "warning" });
    }

    // Twitter Card
    if (entry.twitterCard) {
        checks.push({ label: "Twitter card type set", status: "good" });
    } else {
        checks.push({ label: "Twitter card missing", status: "warning" });
    }

    // Index status
    if (!entry.noIndex) {
        checks.push({ label: "Page is indexable", status: "good" });
    } else {
        checks.push({ label: "Page set to noindex", status: "warning" });
    }

    const total = checks.length;
    const goodCount = checks.filter((c) => c.status === "good").length;
    const warningCount = checks.filter((c) => c.status === "warning").length;
    const score = Math.round(((goodCount + warningCount * 0.5) / total) * 100);

    return { score, checks };
}

function ScoreBadge({ score }: { score: number }) {
    const color =
        score >= 80
            ? "bg-green-100 text-green-700 border-green-200"
            : score >= 50
                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                : "bg-red-100 text-red-700 border-red-200";

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}
        >
            {score >= 80 ? (
                <Check className="w-3 h-3" />
            ) : score >= 50 ? (
                <AlertTriangle className="w-3 h-3" />
            ) : (
                <XIcon className="w-3 h-3" />
            )}
            {score}%
        </div>
    );
}

// ── Score Ring ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color =
        score >= 80 ? "stroke-green-500" : score >= 50 ? "stroke-yellow-500" : "stroke-red-500";

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="72" height="72" className="-rotate-90">
                <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-muted/30"
                />
                <circle
                    cx="36"
                    cy="36"
                    r={radius}
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={color}
                />
            </svg>
            <span className="absolute text-sm font-bold">{score}</span>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────

export default function SeoPage() {
    const [entries, setEntries] = useState<SeoEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state for the currently expanded entry
    const [form, setForm] = useState<FormState>({
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
        setLoading(false);
    }

    useEffect(() => {
        fetchEntries();
    }, [typeFilter]);

    function toggleExpand(entry: SeoEntry) {
        if (expandedId === entry.id) {
            setExpandedId(null);
            return;
        }
        setExpandedId(entry.id);
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

    // Live score for the currently edited form
    const liveScore = useMemo(() => {
        if (!expandedId) return null;
        return calculateSeoScore({
            metaTitle: form.metaTitle || null,
            metaDescription: form.metaDescription || null,
            metaKeywords: form.metaKeywords
                ? form.metaKeywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean)
                : null,
            ogTitle: form.ogTitle || null,
            ogDescription: form.ogDescription || null,
            ogImage: form.ogImage || null,
            twitterCard: form.twitterCard || null,
            twitterTitle: form.twitterTitle || null,
            twitterDescription: form.twitterDescription || null,
            twitterImage: form.twitterImage || null,
            canonicalUrl: form.canonicalUrl || null,
            noIndex: form.noIndex,
            noFollow: form.noFollow,
        } as SeoEntry);
    }, [expandedId, form]);

    async function handleSave() {
        if (!expandedId) return;
        setSaving(true);

        const res = await fetch(`/api/seo/${expandedId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                metaTitle: form.metaTitle || undefined,
                metaDescription: form.metaDescription || undefined,
                metaKeywords: form.metaKeywords
                    ? form.metaKeywords
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean)
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
        setExpandedId(null);
        fetchEntries();
    }

    function titleScoreColor(title: string | null): string {
        if (!title) return "text-red-500";
        const len = title.length;
        if (len >= 30 && len <= 60) return "text-green-600";
        if (len > 0 && len < 30) return "text-yellow-500";
        return "text-red-500";
    }

    function descScoreColor(desc: string | null): string {
        if (!desc) return "text-red-500";
        const len = desc.length;
        if (len >= 120 && len <= 160) return "text-green-600";
        if (len > 0 && len < 120) return "text-yellow-500";
        return "text-red-500";
    }

    return (
        <div className="space-y-6">
            <div>
                <h2
                    className="text-2xl font-bold tracking-tight gold-gradient-text"
                    style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.04em",
                    }}
                >
                    SEO Management
                </h2>
                <p className="text-muted-foreground">
                    Manage meta tags for all articles, pages, and global
                    settings. Click a row to edit inline.
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

            <div className="dash-card rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8" />
                            <TableHead>Type</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Meta Title</TableHead>
                            <TableHead>Meta Description</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Index</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        ) : entries.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <GraffitiTagIllustration className="w-32 h-14 opacity-70" />
                                        <p className="font-medium">
                                            No SEO entries found.
                                        </p>
                                        <p className="text-sm">
                                            Make your mark — optimize a page!
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => {
                                const { score } = calculateSeoScore(entry);
                                const isExpanded = expandedId === entry.id;
                                return (
                                    <TableRow
                                        key={entry.id}
                                        className="group"
                                    >
                                        <TableCell colSpan={7} className="p-0">
                                            {/* Summary Row */}
                                            <button
                                                type="button"
                                                className="w-full flex items-center gap-0 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                                                onClick={() =>
                                                    toggleExpand(entry)
                                                }
                                            >
                                                <span className="w-8 shrink-0">
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </span>
                                                <span className="shrink-0 w-24">
                                                    <Badge
                                                        className={
                                                            typeColors[
                                                            entry
                                                                .entityType
                                                            ] ?? ""
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {entry.entityType}
                                                    </Badge>
                                                </span>
                                                <span className="font-medium w-48 truncate shrink-0">
                                                    {entry.entityTitle || "—"}
                                                </span>
                                                <span
                                                    className={`text-sm w-48 truncate shrink-0 ${titleScoreColor(entry.metaTitle)}`}
                                                >
                                                    {entry.metaTitle
                                                        ? `${entry.metaTitle.slice(0, 40)}${entry.metaTitle.length > 40 ? "…" : ""}`
                                                        : "Missing"}
                                                    {entry.metaTitle && (
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            (
                                                            {
                                                                entry.metaTitle
                                                                    .length
                                                            }
                                                            /60)
                                                        </span>
                                                    )}
                                                </span>
                                                <span
                                                    className={`text-sm flex-1 truncate ${descScoreColor(entry.metaDescription)}`}
                                                >
                                                    {entry.metaDescription
                                                        ? `${entry.metaDescription.slice(0, 50)}${entry.metaDescription.length > 50 ? "…" : ""}`
                                                        : "Missing"}
                                                    {entry.metaDescription && (
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            (
                                                            {
                                                                entry
                                                                    .metaDescription
                                                                    .length
                                                            }
                                                            /160)
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="shrink-0 w-16 flex justify-center">
                                                    <ScoreBadge
                                                        score={score}
                                                    />
                                                </span>
                                                <span className="shrink-0 w-20 flex justify-center">
                                                    {entry.noIndex ? (
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-xs"
                                                        >
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
                                                </span>
                                            </button>

                                            {/* Inline Edit Panel */}
                                            {isExpanded && (
                                                <div className="border-t border-border bg-muted/30 px-6 py-6">
                                                    <div className="grid grid-cols-[1fr_auto] gap-8">
                                                        {/* Left: Edit Fields */}
                                                        <div className="space-y-6">
                                                            {/* Basic Meta */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-semibold">
                                                                    Basic Meta
                                                                    Tags
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">
                                                                        Meta
                                                                        Title{" "}
                                                                        <span
                                                                            className={
                                                                                form
                                                                                    .metaTitle
                                                                                    .length >=
                                                                                    30 &&
                                                                                    form
                                                                                        .metaTitle
                                                                                        .length <=
                                                                                    60
                                                                                    ? "text-green-600"
                                                                                    : form
                                                                                        .metaTitle
                                                                                        .length >
                                                                                        0
                                                                                        ? "text-yellow-500"
                                                                                        : "text-red-500"
                                                                            }
                                                                        >
                                                                            (
                                                                            {
                                                                                form
                                                                                    .metaTitle
                                                                                    .length
                                                                            }
                                                                            /60)
                                                                        </span>
                                                                    </Label>
                                                                    <Input
                                                                        value={
                                                                            form.metaTitle
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setForm(
                                                                                (
                                                                                    f,
                                                                                ) => ({
                                                                                    ...f,
                                                                                    metaTitle:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }),
                                                                            )
                                                                        }
                                                                        maxLength={
                                                                            120
                                                                        }
                                                                    />
                                                                    {/* Character bar */}
                                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all ${form
                                                                                    .metaTitle
                                                                                    .length >=
                                                                                    30 &&
                                                                                    form
                                                                                        .metaTitle
                                                                                        .length <=
                                                                                    60
                                                                                    ? "bg-green-500"
                                                                                    : form
                                                                                        .metaTitle
                                                                                        .length >
                                                                                        60
                                                                                        ? "bg-red-500"
                                                                                        : "bg-yellow-500"
                                                                                }`}
                                                                            style={{
                                                                                width: `${Math.min((form.metaTitle.length / 60) * 100, 100)}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">
                                                                        Meta
                                                                        Description{" "}
                                                                        <span
                                                                            className={
                                                                                form
                                                                                    .metaDescription
                                                                                    .length >=
                                                                                    120 &&
                                                                                    form
                                                                                        .metaDescription
                                                                                        .length <=
                                                                                    160
                                                                                    ? "text-green-600"
                                                                                    : form
                                                                                        .metaDescription
                                                                                        .length >
                                                                                        0
                                                                                        ? "text-yellow-500"
                                                                                        : "text-red-500"
                                                                            }
                                                                        >
                                                                            (
                                                                            {
                                                                                form
                                                                                    .metaDescription
                                                                                    .length
                                                                            }
                                                                            /160)
                                                                        </span>
                                                                    </Label>
                                                                    <Textarea
                                                                        value={
                                                                            form.metaDescription
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setForm(
                                                                                (
                                                                                    f,
                                                                                ) => ({
                                                                                    ...f,
                                                                                    metaDescription:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }),
                                                                            )
                                                                        }
                                                                        maxLength={
                                                                            320
                                                                        }
                                                                        rows={3}
                                                                    />
                                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all ${form
                                                                                    .metaDescription
                                                                                    .length >=
                                                                                    120 &&
                                                                                    form
                                                                                        .metaDescription
                                                                                        .length <=
                                                                                    160
                                                                                    ? "bg-green-500"
                                                                                    : form
                                                                                        .metaDescription
                                                                                        .length >
                                                                                        160
                                                                                        ? "bg-red-500"
                                                                                        : "bg-yellow-500"
                                                                                }`}
                                                                            style={{
                                                                                width: `${Math.min((form.metaDescription.length / 160) * 100, 100)}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">
                                                                        Keywords
                                                                        (comma-separated)
                                                                    </Label>
                                                                    <Input
                                                                        value={
                                                                            form.metaKeywords
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setForm(
                                                                                (
                                                                                    f,
                                                                                ) => ({
                                                                                    ...f,
                                                                                    metaKeywords:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }),
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            {/* Open Graph */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-semibold">
                                                                    Open Graph
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            OG
                                                                            Title
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                form.ogTitle
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        ogTitle:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }),
                                                                                )
                                                                            }
                                                                            placeholder="Falls back to meta title"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            OG
                                                                            Image
                                                                            URL
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                form.ogImage
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        ogImage:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-sm">
                                                                        OG
                                                                        Description
                                                                    </Label>
                                                                    <Textarea
                                                                        value={
                                                                            form.ogDescription
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setForm(
                                                                                (
                                                                                    f,
                                                                                ) => ({
                                                                                    ...f,
                                                                                    ogDescription:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }),
                                                                            )
                                                                        }
                                                                        placeholder="Falls back to meta description"
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            {/* Twitter */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-semibold">
                                                                    Twitter
                                                                    Card
                                                                </h4>
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            Card
                                                                            Type
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                form.twitterCard
                                                                            }
                                                                            onValueChange={(
                                                                                v,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        twitterCard:
                                                                                            v,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        >
                                                                            <SelectTrigger>
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="summary">
                                                                                    Summary
                                                                                </SelectItem>
                                                                                <SelectItem value="summary_large_image">
                                                                                    Summary
                                                                                    Large
                                                                                    Image
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            Twitter
                                                                            Title
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                form.twitterTitle
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        twitterTitle:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            Twitter
                                                                            Description
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                form.twitterDescription
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        twitterDescription:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            {/* Advanced */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-semibold">
                                                                    Advanced
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-sm">
                                                                            Canonical
                                                                            URL
                                                                        </Label>
                                                                        <Input
                                                                            value={
                                                                                form.canonicalUrl
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setForm(
                                                                                    (
                                                                                        f,
                                                                                    ) => ({
                                                                                        ...f,
                                                                                        canonicalUrl:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }),
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center gap-6 pt-6">
                                                                        <div className="flex items-center gap-2">
                                                                            <Switch
                                                                                id={`noIndex-${entry.id}`}
                                                                                checked={
                                                                                    form.noIndex
                                                                                }
                                                                                onCheckedChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    setForm(
                                                                                        (
                                                                                            f,
                                                                                        ) => ({
                                                                                            ...f,
                                                                                            noIndex:
                                                                                                v,
                                                                                        }),
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Label
                                                                                htmlFor={`noIndex-${entry.id}`}
                                                                                className="text-sm"
                                                                            >
                                                                                noindex
                                                                            </Label>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Switch
                                                                                id={`noFollow-${entry.id}`}
                                                                                checked={
                                                                                    form.noFollow
                                                                                }
                                                                                onCheckedChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    setForm(
                                                                                        (
                                                                                            f,
                                                                                        ) => ({
                                                                                            ...f,
                                                                                            noFollow:
                                                                                                v,
                                                                                        }),
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Label
                                                                                htmlFor={`noFollow-${entry.id}`}
                                                                                className="text-sm"
                                                                            >
                                                                                nofollow
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Save / Cancel */}
                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setExpandedId(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={
                                                                        handleSave
                                                                    }
                                                                    disabled={
                                                                        saving
                                                                    }
                                                                >
                                                                    {saving
                                                                        ? "Saving…"
                                                                        : "Save SEO"}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Right: Live Score */}
                                                        {liveScore && (
                                                            <div className="w-56 shrink-0">
                                                                <div className="sticky top-4 space-y-4">
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <ScoreRing
                                                                            score={
                                                                                liveScore.score
                                                                            }
                                                                        />
                                                                        <span className="text-xs font-semibold text-muted-foreground">
                                                                            SEO
                                                                            Score
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        {liveScore.checks.map(
                                                                            (
                                                                                check,
                                                                                i,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="flex items-center gap-2 text-xs"
                                                                                >
                                                                                    {check.status ===
                                                                                        "good" ? (
                                                                                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                                                                    ) : check.status ===
                                                                                        "warning" ? (
                                                                                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                                                                                    ) : (
                                                                                        <XIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                                                    )}
                                                                                    <span
                                                                                        className={
                                                                                            check.status ===
                                                                                                "good"
                                                                                                ? "text-muted-foreground"
                                                                                                : check.status ===
                                                                                                    "warning"
                                                                                                    ? "text-yellow-600"
                                                                                                    : "text-red-600"
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            check.label
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
