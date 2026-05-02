"use client";

import { useState, useRef, type DragEvent } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { blurFacesInFile } from "@/lib/face-blur";
import { BlurReviewDialog, type BlurPreviewItem } from "@/components/dashboard/blur-review-dialog";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
    const [blurFaces, setBlurFaces] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [blurPreviews, setBlurPreviews] = useState<BlurPreviewItem[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadProgress: (p) => setProgress(p),
    });

    const startUploadFiles = async (files: File[]) => {
        setUploading(true);
        setProgress(0);
        try {
            const res = await startUpload(files);
            if (res?.[0]) {
                const uploadedUrl = res[0].ufsUrl ?? res[0].url;
                onUploadComplete(uploadedUrl);
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
                await startUploadFiles(files);
            } finally {
                setProcessing(false);
            }
        } else {
            await startUploadFiles(files);
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
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        processAndPreview(files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        processAndPreview(files);
    };

    return (
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

            <BlurReviewDialog
                open={!!blurPreviews}
                previews={blurPreviews ?? []}
                uploading={uploading}
                progress={progress}
                onConfirm={confirmBlurUpload}
                onDiscard={cancelBlurPreview}
            />

            <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
                        <span className="text-[10px] text-muted-foreground">Uploading… {progress}%</span>
                    </div>
                ) : (
                    <>
                        <span className="text-lg mb-1">📷</span>
                        <span className="text-[10px] text-muted-foreground">Drop or click to upload</span>
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
    );
}
