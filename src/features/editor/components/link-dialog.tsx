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

interface LinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInsert: (url: string, openInNewTab: boolean) => void;
    initialUrl?: string;
}

export function LinkDialog({
    open,
    onOpenChange,
    onInsert,
    initialUrl = "",
}: LinkDialogProps) {
    const [url, setUrl] = useState(initialUrl);
    const [newTab, setNewTab] = useState(true);

    const reset = useCallback(() => {
        setUrl("");
        setNewTab(true);
    }, []);

    const handleOpenChange = (v: boolean) => {
        if (!v) reset();
        onOpenChange(v);
    };

    const handleInsert = () => {
        if (!url.trim()) return;
        onInsert(url.trim(), newTab);
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                    <DialogDescription>
                        Add a URL to link the selected text
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">
                            URL
                        </label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleInsert();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={newTab}
                            onChange={(e) => setNewTab(e.target.checked)}
                            className="rounded border-border"
                        />
                        <span className="text-xs text-muted-foreground">
                            Open in new tab
                        </span>
                    </label>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleInsert} disabled={!url.trim()}>
                        Insert Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
