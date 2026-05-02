"use client";

import { useState, useRef, useCallback, useEffect, type DragEvent } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { blurFacesInFile } from "@/lib/face-blur";
import { BlurReviewDialog, type BlurPreviewItem } from "@/components/dashboard/blur-review-dialog";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type MediaItem = {
    id: string;
    url: string;
    filename: string;
    altText: string | null;
    mimeType: string;
};

interface ImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, alt?: string) => void;
}

export function ImageDialog({ open, onOpenChange, onInsert }: ImageDialogProps) {
    const [tab, setTab] = useState<"upload" | "url" | "assets">("upload");
    const [url, setUrl] = useState("");
    const [alt, setAlt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [blurFaces, setBlurFaces] = useState(true);
    const [progress, setProgress] = useState(0);
    const [blurPreviews, setBlurPreviews] = useState<BlurPreviewItem[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Assets state
    const [assets, setAssets] = useState<MediaItem[]>([]);
    const [assetsLoading, setAssetsLoading] = useState(false);
    const [assetsSearch, setAssetsSearch] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (p) => setProgress(p),
    });

    const reset = useCallback(() => {
        setTab("upload");
        setUrl("");
        setAlt("");
        setPreview(null);
        setUploading(false);
        setProcessing(false);
        setProgress(0);
        setDragActive(false);
        setSelectedAsset(null);
        setAssetsSearch("");
        if (blurPreviews) {
            blurPreviews.forEach((p) => {
                URL.revokeObjectURL(p.originalUrl);
                URL.revokeObjectURL(p.processedObjectUrl);
            });
        }
        setBlurPreviews(null);
    }, [blurPreviews]);

    const handleOpenChange = (v: boolean) => {
        if (!v) reset();
        onOpenChange(v);
    };

    // Fetch assets when dialog opens
    useEffect(() => {
        if (!open) return;
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
    }, [open]);

    const filteredAssets = assetsSearch
        ? assets.filter(
            (a) =>
                a.filename?.toLowerCase().includes(assetsSearch.toLowerCase()) ||
                a.altText?.toLowerCase().includes(assetsSearch.toLowerCase()),
        )
        : assets;

    const upload = async (files: File[]) => {
        if (!files.length) return;
        setUploading(true);
        setProgress(0);
        try {
            const res = await startUpload(files);
            if (res?.[0]) {
                const uploadedUrl = res[0].ufsUrl ?? res[0].url;
                setPreview(uploadedUrl);
                setUrl(uploadedUrl);
                setTab("url");
                setBlurPreviews(null);
            }
        } catch {
            // upload failed silently
        } finally {
            setUploading(false);
        }
    };

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
                await upload(files);
            } finally {
                setProcessing(false);
            }
        } else {
            await upload(files);
        }
    };

    const confirmBlurUpload = (items: BlurPreviewItem[]) => {
        items.forEach((p) => {
            URL.revokeObjectURL(p.originalUrl);
            URL.revokeObjectURL(p.processedObjectUrl);
        });
        upload(items.map((p) => p.processedFile));
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

    const handleInsert = () => {
        if (selectedAsset && tab === "assets") {
            onInsert(selectedAsset.url, selectedAsset.altText || undefined);
            handleOpenChange(false);
            return;
        }
        if (!url.trim()) return;
        onInsert(url.trim(), alt.trim() || undefined);
        handleOpenChange(false);
    };

    const selectAsset = (asset: MediaItem) => {
        setSelectedAsset(asset);
        setUrl(asset.url);
        setAlt(asset.altText ?? "");
        setPreview(asset.url);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                        Upload, pick from assets, or paste a URL
                    </DialogDescription>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {(["upload", "assets", "url"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => { setTab(t); if (t !== "assets") setSelectedAsset(null); }}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === t
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t === "upload" ? "Upload" : t === "assets" ? "Assets" : "URL"}
                        </button>
                    ))}
                </div>

                {tab === "upload" && (
                    <div className="space-y-3">
                        {/* Blur review dialog (portal) */}
                        <BlurReviewDialog
                            open={!!blurPreviews}
                            previews={blurPreviews ?? []}
                            uploading={uploading}
                            progress={progress}
                            onConfirm={confirmBlurUpload}
                            onDiscard={cancelBlurPreview}
                        />

                        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                            <Label htmlFor="id-blur-faces" className="text-xs font-medium cursor-pointer select-none">
                                Blur faces
                            </Label>
                            <Switch
                                id="id-blur-faces"
                                size="sm"
                                checked={blurFaces}
                                onCheckedChange={setBlurFaces}
                            />
                        </div>

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragActive
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                                }`}
                        >
                            {processing ? (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Detecting faces…</span>
                                </div>
                            ) : uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Uploading… {progress}%
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-2xl mb-2">📷</span>
                                    <span className="text-xs text-muted-foreground">
                                        Drop an image here or click to browse
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 mt-1">
                                        Max 8 MB · JPG, PNG, GIF, WebP
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

                {tab === "assets" && (
                    <div className="space-y-3">
                        <Input
                            value={assetsSearch}
                            onChange={(e) => setAssetsSearch(e.target.value)}
                            placeholder="Search assets…"
                            className="h-8 text-sm"
                        />
                        {assetsLoading ? (
                            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                                Loading assets…
                            </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                                {assetsSearch ? "No matching images" : "No images in your media library"}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto rounded-lg p-0.5">
                                {filteredAssets.map((asset) => (
                                    <button
                                        key={asset.id}
                                        type="button"
                                        onClick={() => selectAsset(asset)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${selectedAsset?.id === asset.id
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
                                        {selectedAsset?.id === asset.id && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectedAsset && (
                            <p className="text-xs text-muted-foreground truncate">
                                Selected: {selectedAsset.filename}
                            </p>
                        )}
                    </div>
                )}

                {tab === "url" && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-foreground mb-1.5 block">
                                Image URL
                            </label>
                            <Input
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setPreview(e.target.value);
                                }}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-foreground mb-1.5 block">
                                Alt text (optional)
                            </label>
                            <Input
                                value={alt}
                                onChange={(e) => setAlt(e.target.value)}
                                placeholder="Describe the image…"
                            />
                        </div>
                        {preview && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                                <Image
                                    src={preview}
                                    alt={alt || "Preview"}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleInsert}
                        disabled={(!url.trim() && !selectedAsset) || uploading}
                    >
                        Insert Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
