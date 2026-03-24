import { auth, currentUser } from "@clerk/nextjs/server";

export type Role = "admin" | "editor" | "viewer";

/**
 * Get the current user's role from Clerk publicMetadata.
 *
 * In development, defaults to "admin" so you can work without
 * manually setting metadata. In production you MUST set
 * `publicMetadata.role` on each user via the Clerk dashboard
 * or the Clerk API — otherwise they default to "viewer".
 */
export async function getRole(): Promise<Role> {
    const user = await currentUser();
    const metaRole = user?.publicMetadata?.role as Role | undefined;

    if (metaRole) return metaRole;

    // Dev‑mode convenience: first authenticated user is treated as admin
    if (process.env.NODE_ENV === "development") return "admin";

    return "viewer";
}

export async function requireAuth() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return userId;
}

export async function requireRole(roles: Role[]) {
    const userId = await requireAuth();
    const role = await getRole();
    if (!roles.includes(role)) {
        throw new Error("Forbidden");
    }
    return { userId, role };
}

export async function hasRole(role: Role): Promise<boolean> {
    const currentRole = await getRole();
    const hierarchy: Record<Role, number> = {
        admin: 3,
        editor: 2,
        viewer: 1,
    };
    return hierarchy[currentRole] >= hierarchy[role];
}
