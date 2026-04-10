import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isPublicApiRoute = createRouteMatcher([
    "/api/subscribers",
    "/api/contact",
    "/api/webhooks(.*)",
    "/api/uploadthing(.*)",
    "/api/articles/featured",
    "/api/articles/posts-block",
]);

export default clerkMiddleware(async (auth, request) => {
    // Protect dashboard routes — require sign-in
    if (isProtectedRoute(request)) {
        await auth.protect();
    }

    // Protect API routes except public ones
    if (isApiRoute(request) && !isPublicApiRoute(request)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and static files, but always run for pages and API routes
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf|map)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
