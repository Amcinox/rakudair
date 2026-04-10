import slugify from "slugify";

/**
 * Generates a URL-safe slug.
 * - Latin/accented text: transliterated (e.g. "Café" → "cafe")
 * - Japanese/CJK text: kept as-is (e.g. "東京グルメ" → "東京グルメ")
 * - Falls back to a short random ID if the result is empty
 */
export function generateSlug(text: string, prefix = "item"): string {
    const result = slugify(text, { lower: true, trim: true });
    return result || `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
