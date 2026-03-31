"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Globe,
    FileText,
    Newspaper,
    FolderOpen,
    Search,
    Check,
} from "lucide-react";

// ---------- Types ----------

export interface LinkOption {
    type: "page" | "article" | "category";
    id: string;
    title: string;
    slug: string;
    url: string;
}

export interface LinkPickerValue {
    url: string;
    type?: "custom" | "page" | "article" | "category";
    id?: string;
}

interface LinkPickerProps {
    value: string;
    onChange: (value: string, meta?: { type: string; id: string; title: string }) => void;
    placeholder?: string;
}

// ---------- Component ----------

export function LinkPicker({ value, onChange, placeholder }: LinkPickerProps) {
    const [tab, setTab] = useState<string>("custom");
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<{
        pages: LinkOption[];
        articles: LinkOption[];
        categories: LinkOption[];
    }>({ pages: [], articles: [], categories: [] });
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Fetch options when a non-custom tab is first activated
    useEffect(() => {
        if (tab === "custom" || loaded) return;
        setLoading(true);
        fetch("/api/navigation/link-options")
            .then((r) => r.json())
            .then((json) => {
                setOptions(json.data ?? { pages: [], articles: [], categories: [] });
                setLoaded(true);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [tab, loaded]);

    // Filter options by search
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return options;
        return {
            pages: options.pages.filter(
                (o) => o.title.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q)
            ),
            articles: options.articles.filter(
                (o) => o.title.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q)
            ),
            categories: options.categories.filter(
                (o) => o.title.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q)
            ),
        };
    }, [options, search]);

    function selectOption(opt: LinkOption) {
        onChange(opt.url, { type: opt.type, id: opt.id, title: opt.title });
    }

    const currentList =
        tab === "pages"
            ? filtered.pages
            : tab === "articles"
                ? filtered.articles
                : tab === "categories"
                    ? filtered.categories
                    : [];

    return (
        <div className="space-y-2">
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="h-8 p-0.5">
                    <TabsTrigger value="custom" className="text-xs h-7 gap-1 px-2.5">
                        <Globe className="w-3 h-3" />
                        URL
                    </TabsTrigger>
                    <TabsTrigger value="pages" className="text-xs h-7 gap-1 px-2.5">
                        <FileText className="w-3 h-3" />
                        Pages
                    </TabsTrigger>
                    <TabsTrigger value="articles" className="text-xs h-7 gap-1 px-2.5">
                        <Newspaper className="w-3 h-3" />
                        Articles
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="text-xs h-7 gap-1 px-2.5">
                        <FolderOpen className="w-3 h-3" />
                        Categories
                    </TabsTrigger>
                </TabsList>

                {/* Custom URL */}
                <TabsContent value="custom" className="mt-2">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder || "/about or https://..."}
                    />
                </TabsContent>

                {/* Pages / Articles / Categories */}
                {["pages", "articles", "categories"].map((key) => (
                    <TabsContent key={key} value={key} className="mt-2 space-y-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search ${key}...`}
                                className="pl-8 h-8 text-sm"
                            />
                        </div>

                        <div className="max-h-[180px] overflow-y-auto rounded-md border bg-card">
                            {loading ? (
                                <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                                    Loading…
                                </div>
                            ) : currentList.length === 0 ? (
                                <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                                    {search ? "No results found" : `No ${key} available`}
                                </div>
                            ) : (
                                currentList.map((opt) => {
                                    const isSelected = value === opt.url;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => selectOption(opt)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60 border-b border-border/50 last:border-b-0 ${
                                                isSelected ? "bg-primary/5 text-primary" : ""
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate text-[13px]">{opt.title}</p>
                                                <p className="text-[11px] text-muted-foreground truncate">{opt.url}</p>
                                            </div>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
