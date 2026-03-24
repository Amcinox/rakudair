"use client";

import { useState, useCallback } from "react";
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

interface YoutubeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string) => void;
}

function extractYoutubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
        /youtube\.com\/shorts\/([\w-]+)/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m?.[1]) return m[1];
    }
    return null;
}

export function YoutubeDialog({
    open,
    onOpenChange,
    onInsert,
}: YoutubeDialogProps) {
    const [url, setUrl] = useState("");

    const reset = useCallback(() => {
        setUrl("");
    }, []);

    const handleOpenChange = (v: boolean) => {
        if (!v) reset();
        onOpenChange(v);
    };

    const handleInsert = () => {
        if (!url.trim()) return;
        onInsert(url.trim());
        handleOpenChange(false);
    };

    const videoId = extractYoutubeId(url);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Embed YouTube Video</DialogTitle>
                    <DialogDescription>
                        Paste a YouTube video URL to embed it
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">
                            YouTube URL
                        </label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleInsert();
                                }
                            }}
                            autoFocus
                        />
                    </div>

                    {videoId && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube preview"
                            />
                        </div>
                    )}

                    {url.trim() && !videoId && (
                        <p className="text-xs text-destructive">
                            Could not detect a valid YouTube URL. Try a different format.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleInsert} disabled={!videoId}>
                        Embed Video
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
