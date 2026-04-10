import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorProfiles } from "@/lib/db/schema";
import { apiRoute } from "@/lib/api-utils";
import { eq } from "drizzle-orm";

/** GET /api/profile/[id] — returns a public profile by Clerk ID */
export const GET = apiRoute(
    async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params;

        const [profile] = await db
            .select({
                displayName: authorProfiles.displayName,
                slug: authorProfiles.slug,
                bio: authorProfiles.bio,
                avatar: authorProfiles.avatar,
                role: authorProfiles.role,
                location: authorProfiles.location,
                website: authorProfiles.website,
                socialTwitter: authorProfiles.socialTwitter,
                socialInstagram: authorProfiles.socialInstagram,
                socialYoutube: authorProfiles.socialYoutube,
                socialFacebook: authorProfiles.socialFacebook,
                socialTiktok: authorProfiles.socialTiktok,
                socialGithub: authorProfiles.socialGithub,
            })
            .from(authorProfiles)
            .where(eq(authorProfiles.clerkId, id))
            .limit(1);

        if (!profile) {
            return NextResponse.json({ data: null }, { status: 404 });
        }

        return NextResponse.json({ data: profile });
    },
);
