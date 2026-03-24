/**
 * Typed wrapper around fetch that returns parsed JSON and throws
 * a descriptive Error when the response is not OK.
 */
export async function apiFetch<T = unknown>(
    url: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
    });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            if (body?.error) message = body.error;
        } catch {
            // response had no JSON body — use default message
        }
        throw new Error(message);
    }

    // Some responses (204) may have no body
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
}
