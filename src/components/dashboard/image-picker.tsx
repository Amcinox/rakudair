"use client";

import { useState, useRef, useCallback, useEffect, type DragEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { blurFacesInFile } from "@/lib/face-blur";
import { ImagePlus, X } from "lucide-react";
import { BlurReviewDialog, type BlurPreviewItem } from "@/components/dashboard/blur-review-dialog";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

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
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [blurFaces, setBlurFaces] = useState(true);
    const [processing, setProcessing] = useState(false);
    // preview state: array of { original / processed } per file
    const [blurPreviews, setBlurPreviews] = useState<BlurPreviewItem[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Assets state
    const [assets, setAssets] = useState<MediaItem[]>([]);
    const [assetsLoading, setAssetsLoading] = useState(false);
    const [assetsSearch, setAssetsSearch] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);

    // URL state
    const [urlInput, setUrlInput] = useState(value);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (p) => setProgress(p),
    });

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

    const processAndPreview = async (files: File[]) => {
        if (!files.length) return;
        if (blurFaces) {
            setProcessing(true);
            try {
                const previews = await Promise.all(
                    files.map(async (file) => {
                        const processed = await blurFacesInFile(file);
                        return {
                            originalUrl: URL.createObjectURL(file),
                            processedObjectUrl: URL.createObjectURL(processed),
                            processedFile: processed,
                        };
                    }),
                );
                setBlurPreviews(previews);
            } catch {
                // fallback: upload without blurring
                await startUploadFiles(files);
            } finally {
                setProcessing(false);
            }
        } else {
            await startUploadFiles(files);
        }
    };

    const startUploadFiles = async (files: File[]) => {
        setUploading(true);
        setProgress(0);
        try {
            const res = await startUpload(files);
            if (res?.[0]) {
                const uploadedUrl = res[0].ufsUrl ?? res[0].url;
                onChange(uploadedUrl);
                setMode("closed");
                setBlurPreviews(null);
            }
        } catch {
            // upload failed silently
        } finally {
            setUploading(false);
        }
    };

    const confirmBlurUpload = (items: BlurPreviewItem[]) => {
        items.forEach((p) => {
            URL.revokeObjectURL(p.originalUrl);
            URL.revokeObjectURL(p.processedObjectUrl);
        });
        startUploadFiles(items.map((p) => p.processedFile));
    };

    const cancelBlurPreview = () => {
        if (blurPreviews) {
            blurPreviews.forEach((p) => {
                URL.revokeObjectURL(p.originalUrl);
                URL.revokeObjectURL(p.processedObjectUrl);
            });
        }
        setBlurPreviews(null);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/"),
        );
        processAndPreview(files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        processAndPreview(files);
    };

    const selectAsset = (asset: MediaItem) => {
        setSelectedAsset(asset);
        onChange(asset.url);
        setMode("closed");
    };

    const handleUrlConfirm = () => {
        onChange(urlInput.trim());
        setMode("closed");
    };

    const handleClear = useCallback(() => {
        onChange("");
        setSelectedAsset(null);
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
                <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <Label htmlFor="ip-blur-faces" className="text-[11px] font-medium cursor-pointer select-none">
                            Blur faces
                        </Label>
                        <Switch
                            id="ip-blur-faces"
                            size="sm"
                            checked={blurFaces}
                            onCheckedChange={setBlurFaces}
                        />
                    </div>

                    {/* Blur review dialog */}
                    <BlurReviewDialog
                        open={!!blurPreviews}
                        previews={blurPreviews ?? []}
                        uploading={uploading}
                        progress={progress}
                        onConfirm={confirmBlurUpload}
                        onDiscard={cancelBlurPreview}
                    />

                    {/* Drop zone — always visible (dialog overlays) */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                            }`}
                    >
                        {processing ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">Detecting faces…</span>
                            </div>
                        ) : uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    Uploading… {progress}%
                                </span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg mb-1">📷</span>
                                <span className="text-[10px] text-muted-foreground">
                                    Drop or click to upload
                                </span>
                            </>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
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
