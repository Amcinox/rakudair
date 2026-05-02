"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";

const ImageUploader = dynamic(() => import("./image-uploader"), { ssr: false });

type MediaItem = {
    id: string;
    url: string;
    filename: string;
    altText: string | null;
    mimeType: string;
};

interface ImagePickerProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
}

export function ImagePicker({ value, onChange, placeholder = "Image URL" }: ImagePickerProps) {
    const [mode, setMode] = useState<"closed" | "upload" | "assets" | "url">("closed");

    // Assets state
    const [assets, setAssets] = useState<MediaItem[]>([]);
    const [assetsLoading, setAssetsLoading] = useState(false);
    const [assetsSearch, setAssetsSearch] = useState("");

    // URL state
    const [urlInput, setUrlInput] = useState(value);

    // Sync urlInput with external value
    useEffect(() => {
        setUrlInput(value);
    }, [value]);

    // Fetch assets when panel opens to assets tab
    useEffect(() => {
        if (mode !== "assets" || assets.length > 0) return;
        setAssetsLoading(true);
        fetch("/api/media?limit=100")
            .then((r) => r.json())
            .then((json) => {
                const items = (json.data ?? []).filter((m: MediaItem) =>
                    m.mimeType?.startsWith("image/"),
                );
                setAssets(items);
            })
            .catch(() => { })
            .finally(() => setAssetsLoading(false));
    }, [mode, assets.length]);

    const filteredAssets = assetsSearch
        ? assets.filter(
            (a) =>
                a.filename?.toLowerCase().includes(assetsSearch.toLowerCase()) ||
                a.altText?.toLowerCase().includes(assetsSearch.toLowerCase()),
        )
        : assets;

    const selectAsset = (asset: MediaItem) => {
        onChange(asset.url);
        setMode("closed");
    };

    const handleUrlConfirm = () => {
        onChange(urlInput.trim());
        setMode("closed");
    };

    const handleClear = useCallback(() => {
        onChange("");
        setUrlInput("");
    }, [onChange]);

    const toggleMode = (newMode: "upload" | "assets" | "url") => {
        setMode((prev) => (prev === newMode ? "closed" : newMode));
    };

    return (
        <div className="space-y-2">
            {/* Preview / Current value */}
            {value ? (
                <div className="relative group">
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                            src={value}
                            alt="Selected image"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-border hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">{value}</p>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg border border-dashed border-border">
                    <ImagePlus className="w-4 h-4 shrink-0" />
                    <span className="truncate">{placeholder}</span>
                </div>
            )}

            {/* Tab buttons */}
            <div className="flex gap-1 rounded-lg bg-muted p-1">
                {(["upload", "assets", "url"] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => toggleMode(t)}
                        className={`flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${mode === t
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t === "upload" ? "Upload" : t === "assets" ? "Assets" : "URL"}
                    </button>
                ))}
            </div>

            {/* Upload panel */}
            {mode === "upload" && (
                <ImageUploader
                    onUploadComplete={(url) => {
                        onChange(url);
                        setMode("closed");
                    }}
                />
            )}

            {/* Assets panel */}
            {mode === "assets" && (
                <div className="space-y-2">
                    <Input
                        value={assetsSearch}
                        onChange={(e) => setAssetsSearch(e.target.value)}
                        placeholder="Search assets…"
                        className="h-7 text-xs"
                    />
                    {assetsLoading ? (
                        <div className="flex items-center justify-center h-[120px] text-xs text-muted-foreground">
                            Loading…
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="flex items-center justify-center h-[120px] text-xs text-muted-foreground">
                            {assetsSearch ? "No matches" : "No images"}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-1.5 max-h-[180px] overflow-y-auto rounded-lg p-0.5">
                            {filteredAssets.map((asset) => (
                                <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => selectAsset(asset)}
                                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:opacity-90 ${value === asset.url
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-transparent hover:border-border"
                                        }`}
                                >
                                    <Image
                                        src={asset.url}
                                        alt={asset.altText ?? asset.filename}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* URL panel */}
            {mode === "url" && (
                <div className="flex gap-1.5">
                    <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="h-8 text-xs flex-1"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleUrlConfirm();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleUrlConfirm}
                        className="h-8 px-3 text-xs shrink-0"
                    >
                        Set
                    </Button>
                </div>
            )}
        </div>
    );
}
