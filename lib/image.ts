const MAX_EDGE = 2400;
const QUALITY = 0.82;
const TARGET_TYPE = "image/webp";

function toWebpName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base}.webp`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas
): Promise<Blob | null> {
  return new Promise((resolve) => {
    if ("convertToBlob" in canvas) {
      canvas.convertToBlob({ type: TARGET_TYPE, quality: QUALITY }).then(
        (b) => resolve(b),
        () => resolve(null)
      );
      return;
    }
    const c = canvas as HTMLCanvasElement;
    c.toBlob(
      (b) => resolve(b),
      TARGET_TYPE,
      QUALITY
    );
  });
}

export function isSupportedImage(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  return file.type !== "image/gif" && file.type !== "image/svg+xml";
}

/**
 * Shrinks a photo in the browser before it is uploaded.
 * A 10 MB phone photo becomes roughly 300 KB with no visible loss.
 * Falls back to the original file if anything goes wrong.
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!isSupportedImage(file)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    let canvas: HTMLCanvasElement | OffscreenCanvas;
    if (typeof OffscreenCanvas !== "undefined") {
      canvas = new OffscreenCanvas(width, height);
    } else {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      canvas = c;
    }

    const ctx = canvas.getContext("2d") as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null;
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await canvasToBlob(canvas);
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], toWebpName(file.name), {
      type: TARGET_TYPE,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export function prettySize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
