"use client";

import {
    useRef,
    useState,
    useEffect,
    useCallback,
    startTransition,
    type PointerEvent as ReactPointerEvent,
} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, Paintbrush, RotateCcw, Upload, Blend } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlurPreviewItem {
    originalUrl: string;
    processedObjectUrl: string;
    processedFile: File;
}

interface BlurReviewDialogProps {
    open: boolean;
    previews: BlurPreviewItem[];
    uploading: boolean;
    progress: number;
    onConfirm: (items: BlurPreviewItem[]) => void;
    onDiscard: () => void;
}

// ---------------------------------------------------------------------------
// Helper: pixelate a rectangular region — identical algorithm to face-blur.ts
// pixelSize is computed the same way: Math.max(Math.floor(Math.min(w,h)/10), 8)
// ---------------------------------------------------------------------------

function pixelateRegion(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    pixelSize: number,
) {
    const cx = Math.max(0, Math.floor(x));
    const cy = Math.max(0, Math.floor(y));
    const cw = Math.min(Math.ceil(w), ctx.canvas.width - cx);
    const ch = Math.min(Math.ceil(h), ctx.canvas.height - cy);
    if (cw <= 0 || ch <= 0) return;
    for (let py = cy; py < cy + ch; py += pixelSize) {
        for (let px = cx; px < cx + cw; px += pixelSize) {
            const bw = Math.min(pixelSize, cx + cw - px);
            const bh = Math.min(pixelSize, cy + ch - py);
            const d = ctx.getImageData(px, py, 1, 1).data;
            ctx.fillStyle = `rgb(${d[0]},${d[1]},${d[2]})`;
            ctx.fillRect(px, py, bw, bh);
        }
    }
}

// ---------------------------------------------------------------------------
// Compute object-fit:contain geometry (canvas display coords → image coords)
// ---------------------------------------------------------------------------
function getContainGeometry(
    containerW: number,
    containerH: number,
    naturalW: number,
    naturalH: number,
) {
    if (!naturalW || !naturalH) return null;
    const scale = Math.min(containerW / naturalW, containerH / naturalH);
    const renderedW = naturalW * scale;
    const renderedH = naturalH * scale;
    const offsetX = (containerW - renderedW) / 2;
    const offsetY = (containerH - renderedH) / 2;
    return { scale, offsetX, offsetY, renderedW, renderedH };
}

// ---------------------------------------------------------------------------
// Sub-component: single image editor
// ---------------------------------------------------------------------------

interface ImageEditorProps {
    item: BlurPreviewItem;
    onPainted: (newObjectUrl: string, newFile: File) => void;
}

// Default brush radius in CSS display pixels
const DEFAULT_BRUSH_RADIUS = 24;
const LOUPE_SIZE = 160;
const LOUPE_ZOOM = 2.5;

function ImageEditor({ item, onPainted }: ImageEditorProps) {
    const [split, setSplit] = useState(50);
    const [draggingSplit, setDraggingSplit] = useState(false);
    const [magnifierOn, setMagnifierOn] = useState(false);
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
    const [paintMode, setPaintMode] = useState(false);
    const [brushRadius, setBrushRadius] = useState(DEFAULT_BRUSH_RADIUS);

    const containerRef = useRef<HTMLDivElement>(null);
    // Paint canvas — displayed directly as the blurred side (no hidden canvas)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Original image element — used as source for the loupe
    const originalImgRef = useRef<HTMLImageElement>(null);
    // Loupe canvas — drawn via drawImage for correct zoomed view
    const loupeCanvasRef = useRef<HTMLCanvasElement>(null);

    // Refs to avoid stale closures in rAF / event handlers
    const paintingRef = useRef(false);
    const paintRafRef = useRef<number | null>(null);
    const didPaintRef = useRef(false);
    const splitRef = useRef(split);
    const magnifierOnRef = useRef(magnifierOn);
    const paintModeRef = useRef(paintMode);
    const brushRadiusRef = useRef(brushRadius);

    useEffect(() => { splitRef.current = split; }, [split]);
    useEffect(() => { magnifierOnRef.current = magnifierOn; }, [magnifierOn]);
    useEffect(() => { paintModeRef.current = paintMode; }, [paintMode]);
    useEffect(() => { brushRadiusRef.current = brushRadius; }, [brushRadius]);

    // ── Load processedObjectUrl into the paint canvas ─────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = new window.Image();
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            // willReadFrequently enables optimised getImageData path
            const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
            ctx.drawImage(img, 0, 0);
        };
        img.src = item.processedObjectUrl;
        didPaintRef.current = false;
    }, [item.processedObjectUrl]);

    // Cleanup pending rAF on unmount
    useEffect(() => () => {
        if (paintRafRef.current) cancelAnimationFrame(paintRafRef.current);
    }, []);

    // ── Update loupe canvas (called directly in pointer handler, no useEffect) ─
    const updateLoupe = useCallback((relX: number, relY: number) => {
        const lc = loupeCanvasRef.current;
        const container = containerRef.current;
        const paintCanvas = canvasRef.current;
        const originalImg = originalImgRef.current;
        if (!lc || !container || !paintCanvas || !paintCanvas.width) return;

        const lctx = lc.getContext("2d");
        if (!lctx) return;
        lc.width = LOUPE_SIZE;
        lc.height = LOUPE_SIZE;

        const cw = container.offsetWidth;
        const ch = container.offsetHeight;
        const geo = getContainGeometry(cw, ch, paintCanvas.width, paintCanvas.height);
        if (!geo) return;

        // Map container coords → image pixel coords
        const imgX = (relX - geo.offsetX) / geo.scale;
        const imgY = (relY - geo.offsetY) / geo.scale;
        // Half the image-pixel extent that fills the loupe at LOUPE_ZOOM
        const halfInImg = (LOUPE_SIZE / 2) / (geo.scale * LOUPE_ZOOM);

        const isBlurredSide = (relX / cw) * 100 < splitRef.current;
        const source: CanvasImageSource = isBlurredSide ? paintCanvas : (originalImg as CanvasImageSource);
        if (!source) return;

        lctx.clearRect(0, 0, LOUPE_SIZE, LOUPE_SIZE);
        try {
            lctx.drawImage(
                source,
                imgX - halfInImg, imgY - halfInImg, halfInImg * 2, halfInImg * 2,
                0, 0, LOUPE_SIZE, LOUPE_SIZE,
            );
        } catch {
            // Out-of-bounds or image not yet decoded — ignore
        }
    }, []);

    // ── Execute one paint step on the canvas (no blob/state update) ──────
    const executePaintAt = useCallback((relX: number, relY: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !canvas.width) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const geo = getContainGeometry(
            container.offsetWidth, container.offsetHeight,
            canvas.width, canvas.height,
        );
        if (!geo) return;

        // Map display coords → canvas (image) coords accounting for letterboxing
        const cx = (relX - geo.offsetX) / geo.scale;
        const cy = (relY - geo.offsetY) / geo.scale;

        // Brush radius in canvas (image) pixels
        const brushR = brushRadiusRef.current / geo.scale;
        // Match face-blur.ts: pixelSize = max(floor(min(w,h)/10), 8)
        const pixelSize = Math.max(Math.floor((brushR * 2) / 10), 8);

        pixelateRegion(ctx, cx - brushR, cy - brushR, brushR * 2, brushR * 2, pixelSize);
        didPaintRef.current = true;
    }, []);

    // ── Pointer handlers ──────────────────────────────────────────────────
    const onContainerPointerMove = useCallback(
        (e: ReactPointerEvent<HTMLDivElement>) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // Always update visual state (cursor, loupe position)
            setMousePos({ x: relX, y: relY });

            if (draggingSplit) {
                const pct = Math.max(0, Math.min(100, (relX / rect.width) * 100));
                setSplit(pct);
            }

            // Update loupe canvas directly (no state/render cycle needed)
            if (magnifierOnRef.current) {
                updateLoupe(relX, relY);
            }

            // Paint: throttle to one draw per animation frame
            if (paintingRef.current && paintModeRef.current) {
                if (!paintRafRef.current) {
                    const x = relX;
                    const y = relY;
                    paintRafRef.current = requestAnimationFrame(() => {
                        paintRafRef.current = null;
                        executePaintAt(x, y);
                    });
                }
            }
        },
        [draggingSplit, updateLoupe, executePaintAt],
    );

    const onContainerPointerLeave = useCallback(() => setMousePos(null), []);

    const onPointerDown = useCallback(
        (e: ReactPointerEvent<HTMLDivElement>) => {
            if (!paintModeRef.current) return;
            paintingRef.current = true;
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) executePaintAt(e.clientX - rect.left, e.clientY - rect.top);
        },
        [executePaintAt],
    );

    const finishPainting = useCallback(() => {
        if (!paintingRef.current) return;
        paintingRef.current = false;
        if (paintRafRef.current) {
            cancelAnimationFrame(paintRafRef.current);
            paintRafRef.current = null;
        }
        // Serialize to blob only once per stroke (not per move event)
        if (!didPaintRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (!blob) return;
            const newFile = new File([blob], item.processedFile.name, { type: blob.type });
            const newUrl = URL.createObjectURL(blob);
            onPainted(newUrl, newFile);
        }, item.processedFile.type || "image/jpeg");
    }, [item.processedFile, onPainted]);

    // ── Blur entire image ──────────────────────────────────────────────────
    const blurAll = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.width) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        const pixelSize = Math.max(Math.floor(Math.min(canvas.width, canvas.height) / 10), 8);
        pixelateRegion(ctx, 0, 0, canvas.width, canvas.height, pixelSize);
        didPaintRef.current = true;
        canvas.toBlob((blob) => {
            if (!blob) return;
            const newFile = new File([blob], item.processedFile.name, { type: blob.type });
            const newUrl = URL.createObjectURL(blob);
            onPainted(newUrl, newFile);
        }, item.processedFile.type || "image/jpeg");
    }, [item.processedFile, onPainted]);

    // ── Reset painted edits ───────────────────────────────────────────────
    const resetPaint = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = new window.Image();
        img.onload = () => {
            const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            didPaintRef.current = false;
        };
        img.src = item.processedObjectUrl;
        onPainted(item.processedObjectUrl, item.processedFile);
    }, [item, onPainted]);

    return (
        <div className="flex flex-col gap-2 h-full">
            {/* ── Toolbar main row ── */}
            <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
                    {paintMode ? "Click / drag to add blur" : "Drag the divider to compare"}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        type="button"
                        size="sm"
                        variant={magnifierOn ? "default" : "outline"}
                        className="h-7 gap-1 text-xs px-2.5"
                        onClick={() => setMagnifierOn((v) => !v)}
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                        Magnify
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={paintMode ? "default" : "outline"}
                        className="h-7 gap-1 text-xs px-2.5"
                        onClick={() => setPaintMode((v) => !v)}
                    >
                        <Paintbrush className="w-3.5 h-3.5" />
                        Brush
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs px-2.5"
                        onClick={blurAll}
                    >
                        <Blend className="w-3.5 h-3.5" />
                        Blur All
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs px-2.5"
                        onClick={resetPaint}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* ── Brush size row (only visible in brush mode) ── */}
            {paintMode && (
                <div className="flex items-center gap-2.5 shrink-0 rounded-md border border-border bg-muted/40 px-3 py-1.5">
                    <Paintbrush className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground shrink-0">Size</span>
                    <input
                        type="range"
                        min={6}
                        max={120}
                        step={2}
                        value={brushRadius}
                        onChange={(e) => setBrushRadius(Number(e.target.value))}
                        className="flex-1 accent-primary cursor-pointer"
                    />
                    <span className="text-xs tabular-nums text-muted-foreground w-9 text-right shrink-0">{brushRadius}px</span>
                </div>
            )}

            {/* Comparison area */}
            <div
                ref={containerRef}
                className="relative flex-1 overflow-hidden rounded-xl border border-border bg-black select-none"
                style={{ cursor: paintMode ? "none" : draggingSplit ? "col-resize" : "default" }}
                onPointerMove={onContainerPointerMove}
                onPointerLeave={onContainerPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={finishPainting}
                onPointerCancel={finishPainting}
            >
                {/* Original image — full container, clipped to right of split */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={originalImgRef}
                    src={item.originalUrl}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    draggable={false}
                />

                {/* Blurred side — the paint canvas IS the display element (no img round-trip) */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                >
                    {/*
                     * object-fit:contain on <canvas> works in all modern browsers.
                     * The canvas's width/height attributes give its intrinsic dimensions.
                     * Painting draws directly here — zero lag, no blob/URL on every stroke.
                     */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ objectFit: "contain" }}
                    />
                </div>

                {/* Divider line + handle */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.8)] z-10"
                    style={{ left: `${split}%` }}
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDraggingSplit(true);
                    }}
                    onPointerUp={(e) => {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDraggingSplit(false);
                    }}
                >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-col-resize">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <span className="absolute top-2 left-3 text-[10px] font-semibold text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none z-20">
                    BLURRED
                </span>
                <span className="absolute top-2 right-3 text-[10px] font-semibold text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none z-20">
                    ORIGINAL
                </span>

                {/* Magnifier loupe — canvas-based for correct zoom geometry */}
                {magnifierOn && mousePos && (
                    <div
                        className="absolute pointer-events-none z-30 rounded-full border-2 border-white shadow-2xl overflow-hidden"
                        style={{
                            width: LOUPE_SIZE,
                            height: LOUPE_SIZE,
                            left: mousePos.x - LOUPE_SIZE / 2,
                            top: mousePos.y - LOUPE_SIZE / 2,
                        }}
                    >
                        {/*
                         * drawImage-based zoom: accounts for object-fit:contain letterboxing.
                         * updateLoupe() maps container coords → image coords and draws the
                         * correct zoomed region directly — no CSS transform artifacts.
                         */}
                        <canvas
                            ref={loupeCanvasRef}
                            width={LOUPE_SIZE}
                            height={LOUPE_SIZE}
                            className="w-full h-full"
                        />
                    </div>
                )}

                {/* Paint brush cursor ring (replaces system cursor while in brush mode) */}
                {paintMode && mousePos && (
                    <div
                        className="absolute pointer-events-none z-30 rounded-full border-2 border-white mix-blend-difference"
                        style={{
                            width: brushRadius * 2,
                            height: brushRadius * 2,
                            left: mousePos.x - brushRadius,
                            top: mousePos.y - brushRadius,
                        }}
                    />
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main dialog
// ---------------------------------------------------------------------------

export function BlurReviewDialog({
    open,
    previews,
    uploading,
    progress,
    onConfirm,
    onDiscard,
}: BlurReviewDialogProps) {
    const [current, setCurrent] = useState(0);
    // Mutable copy so painting updates are reflected
    const [items, setItems] = useState<BlurPreviewItem[]>([]);

    useEffect(() => {
        if (open) {
            startTransition(() => {
                setItems(previews.map((p) => ({ ...p })));
                setCurrent(0);
            });
        }
    }, [open, previews]);

    const handlePainted = useCallback(
        (index: number, newObjectUrl: string, newFile: File) => {
            setItems((prev) =>
                prev.map((item, i) =>
                    i === index
                        ? { ...item, processedObjectUrl: newObjectUrl, processedFile: newFile }
                        : item,
                ),
            );
        },
        [],
    );

    const item = items[current];

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v && !uploading) onDiscard(); }}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-5 pt-4 pb-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-sm font-semibold">
                            Review before uploading
                        </DialogTitle>
                        {items.length > 1 && (
                            <div className="flex items-center gap-1.5 ml-auto">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    disabled={current === 0}
                                    onClick={() => setCurrent((c) => c - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {current + 1} / {items.length}
                                </span>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    disabled={current === items.length - 1}
                                    onClick={() => setCurrent((c) => c + 1)}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    {items.length > 1 && (
                        <div className="flex gap-1 mt-2">
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setCurrent(i)}
                                    className={`h-1 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30 w-4 hover:bg-muted-foreground/50"}`}
                                />
                            ))}
                        </div>
                    )}
                </DialogHeader>

                {/* Editor area */}
                <div className="flex-1 min-h-0 px-5 py-4">
                    {item && (
                        <ImageEditor
                            key={current}
                            item={item}
                            onPainted={(url, file) => handlePainted(current, url, file)}
                        />
                    )}
                </div>

                <DialogFooter className="px-5 py-3 border-t border-border shrink-0 flex-row justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onDiscard}
                        disabled={uploading}
                    >
                        Discard
                    </Button>
                    <div className="flex items-center gap-3">
                        {uploading && (
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {progress}%
                                </span>
                            </div>
                        )}
                        <Button
                            type="button"
                            onClick={() => onConfirm(items)}
                            disabled={uploading}
                            className="gap-1.5"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            {uploading
                                ? "Uploading…"
                                : items.length > 1
                                    ? `Upload ${items.length} images`
                                    : "Upload"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
