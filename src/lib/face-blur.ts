import * as faceapi from "@vladmandic/face-api";

const MODELS_URL = "/models";

let loadPromise: Promise<void> | null = null;

function loadModels(): Promise<void> {
    if (!loadPromise) {
        loadPromise = faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL);
    }
    return loadPromise;
}

function pixelateRegion(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
) {
    const pixelSize = Math.max(Math.floor(Math.min(w, h) / 10), 8);
    const cx = Math.max(0, Math.floor(x));
    const cy = Math.max(0, Math.floor(y));
    const cw = Math.min(Math.ceil(w), ctx.canvas.width - cx);
    const ch = Math.min(Math.ceil(h), ctx.canvas.height - cy);
    if (cw <= 0 || ch <= 0) return;

    for (let py = cy; py < cy + ch; py += pixelSize) {
        for (let px = cx; px < cx + cw; px += pixelSize) {
            const blockW = Math.min(pixelSize, cx + cw - px);
            const blockH = Math.min(pixelSize, cy + ch - py);
            const data = ctx.getImageData(px, py, 1, 1).data;
            ctx.fillStyle = `rgb(${data[0]},${data[1]},${data[2]})`;
            ctx.fillRect(px, py, blockW, blockH);
        }
    }
}

/**
 * Detects faces in the given image file and returns a new File with all
 * detected faces pixelated. If no faces are found or detection fails,
 * the original file is returned unchanged.
 */
export async function blurFacesInFile(file: File): Promise<File> {
    await loadModels();

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        bitmap.close();
        return file;
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    let detections: faceapi.FaceDetection[];
    try {
        const results = await faceapi.detectAllFaces(
            canvas,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }),
        );
        detections = results;
    } catch (err) {
        // Reset so the next call retries model loading
        loadPromise = null;
        console.warn("[face-blur] detection failed, uploading original:", err);
        return file;
    }

    if (detections.length === 0) return file;

    for (const detection of detections) {
        const { x, y, width, height } = detection.box;
        pixelateRegion(ctx, x, y, width, height);
    }

    return new Promise<File>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) { reject(new Error("toBlob failed")); return; }
                resolve(new File([blob], file.name, { type: file.type }));
            },
            file.type,
        );
    });
}

