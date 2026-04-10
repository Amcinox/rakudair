import slugify from "slugify";

/**
 * Generates a URL-safe slug.
 * - Latin/accented text: transliterated via slugify (e.g. "Café" → "cafe")
 * - Japanese/CJK/Arabic/etc.: kept as Unicode (e.g. "モカモカ" → "モカモカ")
 * - Falls back to a short random ID only if the result is truly empty
 *
 * Note: slugify strips any character not in its transliteration map,
 * so Japanese always falls through to the Unicode path.
 */
export function generateSlug(text: string, prefix = "item"): string {
    // Try Latin/accented transliteration first
    const ascii = slugify(text, { lower: true, strict: true });
    if (ascii) return ascii;

    // For non-Latin scripts (Japanese, CJK, Arabic, Korean, etc.)
    // keep Unicode letters/numbers, normalise whitespace to hyphens
    const unicode = text
        .trim()
        .toLowerCase()
        .replace(/[\s\u3000]+/g, "-")          // spaces + ideographic space
        .replace(/[^\p{L}\p{N}-]/gu, "")        // strip punctuation/symbols
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (unicode) return unicode;

    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
