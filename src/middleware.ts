import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isPublicApiRoute = createRouteMatcher([
    "/api/subscribers",
    "/api/contact",
    "/api/webhooks(.*)",
    "/api/uploadthing(.*)",
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
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
