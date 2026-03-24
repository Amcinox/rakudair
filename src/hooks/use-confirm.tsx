"use client";

import { useState, useCallback, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UseConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "default";
}

/**
 * Hook that returns a `confirm()` function which opens a custom dialog
 * and resolves a promise with `true` (confirmed) or `false` (cancelled).
 *
 * Usage:
 * ```tsx
 * const [ConfirmDialog, confirm] = useConfirm({
 *   title: "Delete item?",
 *   description: "This action cannot be undone.",
 *   variant: "destructive",
 * });
 *
 * // In handler:
 * const ok = await confirm();
 * if (!ok) return;
 *
 * // In JSX:
 * <ConfirmDialog />
 * ```
 */
export function useConfirm(defaults: UseConfirmOptions = {}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(defaults);
    const resolveRef = useRef<((v: boolean) => void) | null>(null);

    const confirm = useCallback(
        (overrides?: Partial<UseConfirmOptions>) => {
            if (overrides) setOptions({ ...defaults, ...overrides });
            else setOptions(defaults);
            setOpen(true);

            return new Promise<boolean>((resolve) => {
                resolveRef.current = resolve;
            });
        },
        [defaults],
    );

    const handleResponse = useCallback((value: boolean) => {
        setOpen(false);
        resolveRef.current?.(value);
        resolveRef.current = null;
    }, []);

    function ConfirmDialog() {
        const {
            title = "Are you sure?",
            description = "This action cannot be undone.",
            confirmText = "Confirm",
            cancelText = "Cancel",
            variant = "default",
        } = options;

        return (
            <Dialog
                open={open}
                onOpenChange={(v) => {
                    if (!v) handleResponse(false);
                }}
            >
                <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => handleResponse(false)}>
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === "destructive" ? "destructive" : "default"}
                            onClick={() => handleResponse(true)}
                        >
                            {confirmText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return [ConfirmDialog, confirm] as const;
}
