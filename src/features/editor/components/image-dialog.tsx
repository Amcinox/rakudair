"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
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
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface ImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, alt?: string) => void;
}

export function ImageDialog({ open, onOpenChange, onInsert }: ImageDialogProps) {
    const [tab, setTab] = useState<"upload" | "url">("upload");
    const [url, setUrl] = useState("");
    const [alt, setAlt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (p) => setProgress(p),
    });

    const reset = useCallback(() => {
        setTab("upload");
        setUrl("");
        setAlt("");
        setPreview(null);
        setUploading(false);
        setProgress(0);
        setDragActive(false);
    }, []);

    const handleOpenChange = (v: boolean) => {
        if (!v) reset();
        onOpenChange(v);
    };

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
            }
        } catch {
            // upload failed silently
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/"),
        );
        upload(files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        upload(files);
    };

    const handleInsert = () => {
        if (!url.trim()) return;
        onInsert(url.trim(), alt.trim() || undefined);
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                        Upload an image or paste a URL
                    </DialogDescription>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    <button
                        type="button"
                        onClick={() => setTab("upload")}
                        className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === "upload"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("url")}
                        className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === "url"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        URL
                    </button>
                </div>

                {tab === "upload" && (
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
                        {uploading ? (
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
                            onChange={handleFileChange}
                            className="hidden"
                        />
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
                        disabled={!url.trim() || uploading}
                    >
                        Insert Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
