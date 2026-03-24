"use client";

import { useState, useEffect, useCallback, useRef, type DragEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type MediaItem = {
    id: string;
    url: string;
    key: string;
    filename: string;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;
    altText: string | null;
    createdAt: string;
};

export default function MediaPage() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [search, setSearch] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
    });

    const fetchMedia = useCallback(async () => {
        const res = await fetch("/api/media");
        const json = await res.json();
        setItems(json.data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    async function handleUpload(files: File[]) {
        if (files.length === 0) return;
        setUploading(true);
        setUploadProgress(0);

        try {
            const result = await startUpload(files);
            if (result) {
                for (const file of result) {
                    await fetch("/api/media", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
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
                fetchMedia();
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
        if (!confirm("Delete this file?")) return;
        const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Failed to delete");
            return;
        }
        toast.success("File deleted");
        setSelected(null);
        fetchMedia();
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-neutral-500">
                        {items.length} file{items.length !== 1 ? "s" : ""} • Upload and manage your media assets.
                    </p>
                </div>
                <Button onClick={() => setUploadOpen(true)}>
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
                <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                    {items.length === 0 ? (
                        <>
                            <p className="text-lg font-medium">No media uploaded yet</p>
                            <p className="text-sm mt-1">Click &quot;Upload Files&quot; to get started.</p>
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
                            className="group relative aspect-square overflow-hidden rounded-lg border bg-neutral-100 dark:bg-neutral-900 hover:ring-2 hover:ring-red-500 transition-all"
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
                                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
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
                                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
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
                                        className="h-full bg-red-500 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-neutral-500">Uploading… {uploadProgress}%</p>
                            </div>
                        ) : (
                            <>
                                <svg className="h-10 w-10 text-neutral-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Drop files here or click to browse
                                </p>
                                <p className="text-xs text-neutral-400 mt-1">
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
                                <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100">
                                    <Image
                                        src={selected.url}
                                        alt={selected.altText ?? selected.filename}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-neutral-500">Size</div>
                                <div>{formatSize(selected.size)}</div>
                                {selected.width && (
                                    <>
                                        <div className="text-neutral-500">Dimensions</div>
                                        <div>
                                            {selected.width}×{selected.height}
                                        </div>
                                    </>
                                )}
                                <div className="text-neutral-500">Type</div>
                                <div>{selected.mimeType}</div>
                                <div className="text-neutral-500">Uploaded</div>
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
    );
}
