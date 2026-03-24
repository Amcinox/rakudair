import { NextRequest, NextResponse } from "next/server";

/**
 * Wraps a Next.js route handler with automatic error → JSON conversion.
 *
 * Usage:
 *   export const POST = apiRoute(async (req) => { … });
 *   export const PATCH = apiRoute(async (req, { params }) => { … });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function apiRoute(handler: Handler): Handler {
    return async (req, ctx) => {
        try {
            return await handler(req, ctx);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Internal server error";

            if (message === "Unauthorized") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            if (message === "Forbidden") {
                return NextResponse.json(
                    { error: "Forbidden — insufficient permissions" },
                    { status: 403 },
                );
            }

            console.error("[API Error]", req.method, req.nextUrl.pathname, error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 },
            );
        }
    };
}
