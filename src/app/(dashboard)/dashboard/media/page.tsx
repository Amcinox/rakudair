"use client";

import { useState, useRef, type DragEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BoomboxIllustration } from "@/components/dashboard/illustrations";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { useConfirm } from "@/hooks/use-confirm";
import { useMedia, type MediaItem } from "@/features/media/hooks/useMedia";
import { apiFetch } from "@/features/shared/api";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function MediaPage() {
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [search, setSearch] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { items, loading, refetch, remove } = useMedia(1, 500);
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Delete file?",
        description: "This file will be permanently deleted from storage.",
        confirmText: "Delete",
        variant: "destructive",
    });

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
    });

    async function handleUpload(files: File[]) {
        if (files.length === 0) return;
        setUploading(true);
        setUploadProgress(0);

        try {
            const result = await startUpload(files);
            if (result) {
                for (const file of result) {
                    await apiFetch("/api/media", {
                        method: "POST",
                        body: JSON.stringify({
                            url: file.ufsUrl,
                            key: file.key,
                            filename: file.name,
                            mimeType: file.type,
                            size: file.size,
                        }),
                    });
                }
                toast.success(`${result.length} file(s) uploaded`);
                refetch();
                setUploadOpen(false);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            handleUpload(files);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleDelete(id: string) {
        if (!(await confirm())) return;
        try {
            await remove(id);
            setSelected(null);
        } catch {
            // handled by hook
        }
    }

    function copyUrl(url: string) {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    }

    function formatSize(bytes: number) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    const filteredItems = search
        ? items.filter((item) =>
            item.filename.toLowerCase().includes(search.toLowerCase()),
        )
        : items;

    return (
        <>
            <ConfirmDialog />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight gold-gradient-text" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>Media Library</h2>
                        <p className="text-muted-foreground">
                            {items.length} file{items.length !== 1 ? "s" : ""} • Upload and manage your media assets.
                        </p>
                    </div>
                    <Button onClick={() => setUploadOpen(true)} className="btn-gold">
                        Upload Files
                    </Button>
                </div>

                {/* Search bar */}
                {items.length > 0 && (
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search media by filename…"
                        className="max-w-sm"
                    />
                )}

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-lg" />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        {items.length === 0 ? (
                            <>
                                <BoomboxIllustration className="w-40 h-auto opacity-70 mb-2" />
                                <p className="text-lg font-medium">No media uploaded yet</p>
                                <p className="text-sm mt-1">Turn the volume up — drop some files!</p>
                                <Button className="mt-4" onClick={() => setUploadOpen(true)}>
                                    Upload your first file
                                </Button>
                            </>
                        ) : (
                            <p>No files match &quot;{search}&quot;</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {filteredItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelected(item)}
                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:ring-2 hover:ring-primary transition-all"
                            >
                                {item.mimeType.startsWith("image/") ? (
                                    <Image
                                        src={item.url}
                                        alt={item.altText ?? item.filename}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        {item.filename}
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-white truncate">{item.filename}</p>
                                    <p className="text-[10px] text-white/70">{formatSize(item.size)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Upload Files</DialogTitle>
                        </DialogHeader>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                            relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 cursor-pointer transition-colors
                            ${dragActive
                                    ? "border-primary bg-primary/10"
                                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
                                }
                            ${uploading ? "pointer-events-none opacity-60" : ""}
                        `}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {uploading ? (
                                <div className="text-center space-y-3">
                                    <div className="h-2 w-48 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Uploading… {uploadProgress}%</p>
                                </div>
                            ) : (
                                <>
                                    <svg className="h-10 w-10 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-sm font-medium text-foreground dark:text-neutral-300">
                                        Drop files here or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Images up to 8MB each • Max 10 files
                                    </p>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Detail dialog */}
                <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selected?.filename}</DialogTitle>
                        </DialogHeader>
                        {selected && (
                            <div className="space-y-4">
                                {selected.mimeType.startsWith("image/") && (
                                    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                        <Image
                                            src={selected.url}
                                            alt={selected.altText ?? selected.filename}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Size</div>
                                    <div>{formatSize(selected.size)}</div>
                                    {selected.width && (
                                        <>
                                            <div className="text-muted-foreground">Dimensions</div>
                                            <div>
                                                {selected.width}×{selected.height}
                                            </div>
                                        </>
                                    )}
                                    <div className="text-muted-foreground">Type</div>
                                    <div>{selected.mimeType}</div>
                                    <div className="text-muted-foreground">Uploaded</div>
                                    <div>{new Date(selected.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        value={selected.url}
                                        readOnly
                                        onClick={() => copyUrl(selected.url)}
                                        className="cursor-pointer text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => copyUrl(selected.url)} className="flex-1">
                                        Copy URL
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(selected.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}